import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { Farmer, ProductType } from "@/types";

// Multiple regions around Oslo for more coverage
const LOKALLAG_IDS = [
    4,  // Oslo
    1,  // Akershus Vest
    2,  // Akershus Øst
    3,  // Follo
    5,  // Romerike
    6,  // Østfold
    7,  // Vestfold
    8,  // Buskerud
];
const BASE_URL = "https://bondensmarked.no";

// Cache scraped data for 12 hours (shorter to get fresher data)
let cachedData: { farmers: Farmer[]; timestamp: number } | null = null;
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours

// Map common Norwegian food terms to product types
function inferProducts(text: string): ProductType[] {
    const lowerText = text.toLowerCase();
    const products: ProductType[] = [];

    if (lowerText.includes("honning") || lowerText.includes("bie")) products.push("honey");
    if (lowerText.includes("melk") || lowerText.includes("meieri")) products.push("milk");
    if (lowerText.includes("råmelk")) products.push("raw_milk");
    if (lowerText.includes("egg") || lowerText.includes("høns")) products.push("eggs");
    if (lowerText.includes("kjøtt") || lowerText.includes("storfe") || lowerText.includes("sau") || lowerText.includes("lam") || lowerText.includes("gris") || lowerText.includes("svin")) products.push("meat");
    if (lowerText.includes("pølse") || lowerText.includes("speke")) products.push("sausages");
    if (lowerText.includes("grønnsak") || lowerText.includes("tomat") || lowerText.includes("salat") || lowerText.includes("gulrot")) products.push("vegetables");
    if (lowerText.includes("potet")) products.push("potatoes");
    if (lowerText.includes("fisk") || lowerText.includes("sild") || lowerText.includes("laks") || lowerText.includes("torsk")) products.push("fish");
    if (lowerText.includes("skalldyr") || lowerText.includes("reke") || lowerText.includes("krabbe")) products.push("shellfish");
    if (lowerText.includes("ost") || lowerText.includes("ysteri")) products.push("cheese");
    if (lowerText.includes("brød") || lowerText.includes("bakeri") || lowerText.includes("lefse") || lowerText.includes("flatbrød")) products.push("bread");

    // Default to seasonal if no specific products found
    if (products.length === 0) products.push("seasonal");

    return [...new Set(products)];
}

// Fetch producer detail page to get real image and better description
async function fetchProducerDetails(url: string): Promise<{ image: string | null; description: string | null; address: string | null }> {
    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "KortreistMat/1.0" }
        });
        if (!response.ok) return { image: null, description: null, address: null };

        const html = await response.text();
        const $ = cheerio.load(html);

        // Find Cloudinary image (the large featured image)
        let image: string | null = null;
        $('img[src*="cloudinary"]').each((_, el) => {
            const src = $(el).attr("src");
            if (src && src.includes("/BM/") && !image) {
                // Get higher resolution version
                image = src.replace(/h_\d+/, "h_600").replace(/w_\d+/, "w_800");
            }
        });

        // Get description from page content
        const description = $('p').first().text().trim() || null;

        // Try to find address
        let address: string | null = null;
        const addressMatch = html.match(/(\d{4}\s+[A-ZÆØÅa-zæøå]+)/);
        if (addressMatch) {
            address = addressMatch[1];
        }

        return { image, description, address };
    } catch {
        return { image: null, description: null, address: null };
    }
}

// Geocode address using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const query = encodeURIComponent(`${address}, Norway`);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
            {
                headers: {
                    "User-Agent": "KortreistMat/1.0 (https://kortreistmat.no)"
                }
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error("Geocoding error:", error);
    }
    return null;
}

// Fallback coordinates for Oslo area
const OSLO_CENTER = { lat: 59.9139, lng: 10.7522 };

async function scrapeProducers(): Promise<Farmer[]> {
    const farmers: Farmer[] = [];
    const allProducerLinks: { name: string; url: string; description: string; cardImage: string | null; region: string }[] = [];

    try {
        // Fetch all region pages in PARALLEL for speed (Vercel has 10s timeout)
        const mainUrls = [
            `${BASE_URL}/produsenter`, // All producers
            ...LOKALLAG_IDS.map(id => `${BASE_URL}/produsenter?lokallag=${id}`)
        ];

        const fetchPage = async (url: string) => {
            const lokallagId = url.includes("lokallag=") ? url.split("lokallag=")[1] : "all";
            try {
                const response = await fetch(url, {
                    headers: { "User-Agent": "KortreistMat/1.0 (https://kortreistmat.no)" }
                });
                if (!response.ok) return [];

                const html = await response.text();
                const $ = cheerio.load(html);
                const links: typeof allProducerLinks = [];

                $('a[href^="/produsent/"]').each((_, element) => {
                    const $el = $(element);
                    const href = $el.attr("href");
                    const name = $el.find("h2, h3, .font-bold").first().text().trim() ||
                        $el.text().trim().split("\n")[0].trim();

                    if (href && name && name.length > 2) {
                        let cardImage: string | null = null;
                        const imgSrc = $el.find("img").attr("src");
                        if (imgSrc && imgSrc.includes("cloudinary")) {
                            cardImage = imgSrc.replace(/h_\d+/, "h_600").replace(/w_\d+/, "w_800");
                        }

                        links.push({
                            name,
                            url: `${BASE_URL}${href}`,
                            description: $el.find("p").first().text().trim() || "",
                            cardImage,
                            region: `lokallag-${lokallagId}`
                        });
                    }
                });
                return links;
            } catch {
                return [];
            }
        };

        // Fetch all pages in parallel
        const results = await Promise.all(mainUrls.map(fetchPage));
        results.forEach(links => allProducerLinks.push(...links));

        // Remove duplicates by URL
        const uniqueProducers = allProducerLinks.filter((p, i, arr) =>
            arr.findIndex(x => x.url === p.url) === i
        );

        console.log(`Found ${uniqueProducers.length} unique producers from Bondens Marked`);

        // Process producers - use card data only, skip detail page fetches for speed
        for (const producer of uniqueProducers) {
            const id = producer.url.split("/").pop() || `bm-${Date.now()}`;
            const products = inferProducts(`${producer.name} ${producer.description}`);

            // Add slight randomization to prevent overlapping markers
            const location = {
                lat: OSLO_CENTER.lat + (Math.random() - 0.5) * 0.1,
                lng: OSLO_CENTER.lng + (Math.random() - 0.5) * 0.1
            };

            const cleanName = producer.name.split(/\s{2,}/)[0].trim();

            farmers.push({
                id: `bm-${id}`,
                name: cleanName,
                description: producer.description || `Lokal produsent fra Bondens Marked. Kvalitetsprodukter direkte fra gården.`,
                products,
                location,
                address: "Oslo-området",
                images: producer.cardImage ? [producer.cardImage] : ["/placeholder-farm.jpg"]
            });
        }

    } catch (error) {
        console.error("Scraping error:", error);
    }

    return farmers;
}

export async function GET() {
    try {
        // Check cache
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return NextResponse.json({
                farmers: cachedData.farmers,
                source: "cache",
                count: cachedData.farmers.length
            });
        }

        // Scrape fresh data
        const farmers = await scrapeProducers();

        // Update cache
        cachedData = {
            farmers,
            timestamp: Date.now()
        };

        return NextResponse.json({
            farmers,
            source: "fresh",
            count: farmers.length
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to scrape producers", farmers: [] },
            { status: 500 }
        );
    }
}

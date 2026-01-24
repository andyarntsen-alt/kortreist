import { NextResponse } from "next/server";
import { Farmer, ProductType } from "@/types";

const HANEN_API = "https://kart.hanen.no/api/kart/data";

// Cache scraped data for 24 hours (data changes rarely)
let cachedData: { farmers: Farmer[]; timestamp: number } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Map HANEN categories to our product types
function mapCategories(categories: string[]): ProductType[] {
    const products: ProductType[] = [];
    const categoryText = categories.join(" ").toLowerCase();

    if (categoryText.includes("honning") || categoryText.includes("birøkt")) products.push("honey");
    if (categoryText.includes("melk") || categoryText.includes("meieri")) products.push("milk");
    if (categoryText.includes("ost") || categoryText.includes("ysteri")) products.push("cheese");
    if (categoryText.includes("egg")) products.push("eggs");
    if (categoryText.includes("kjøtt") || categoryText.includes("slakteri")) products.push("meat");
    if (categoryText.includes("pølse") || categoryText.includes("speke")) products.push("sausages");
    if (categoryText.includes("grønnsak") || categoryText.includes("frukt") || categoryText.includes("bær")) products.push("vegetables");
    if (categoryText.includes("fisk") || categoryText.includes("sjømat")) products.push("fish");
    if (categoryText.includes("brød") || categoryText.includes("bakeri") || categoryText.includes("lefse")) products.push("bread");
    if (categoryText.includes("sider") || categoryText.includes("drikke") || categoryText.includes("bryggeri")) products.push("drinks");
    if (categoryText.includes("gårdsbutikk")) products.push("seasonal");

    // Default to seasonal if no specific products found
    if (products.length === 0) products.push("seasonal");

    return [...new Set(products)];
}

// Clean HTML from description
function cleanHtml(html: string): string {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/\s+/g, " ")
        .trim();
}

interface HanenFeature {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    introduction?: string;
    html?: string;
    image_url?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    shipping_street?: string;
    shipping_city?: string;
    shipping_postal_code?: string;
    county?: string;
    category?: string[];
    slug?: string;
}

async function fetchFromHanen(): Promise<Farmer[]> {
    const farmers: Farmer[] = [];

    try {
        const response = await fetch(HANEN_API, {
            headers: {
                "User-Agent": "KortreistMat/1.0 (https://kortreist.vercel.app)",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            console.error("HANEN API response not ok:", response.status);
            return [];
        }

        const data: HanenFeature[] = await response.json();
        console.log(`HANEN API returned ${data.length} features`);

        for (const feature of data) {
            // Skip entries without coordinates
            if (!feature.latitude || !feature.longitude) continue;

            // Build address from components
            const addressParts = [
                feature.shipping_street,
                feature.shipping_postal_code,
                feature.shipping_city || feature.county
            ].filter(Boolean);
            const address = addressParts.length > 0
                ? addressParts.join(", ")
                : feature.county || "Norge";

            // Get best description
            const description = feature.introduction
                || cleanHtml(feature.html || "")
                || "Lokal produsent med kvalitetsvarer.";

            // Get image (prefer image_url over logo)
            // Images are stored as Cloudinary public IDs
            const CLOUDINARY_BASE = "https://res.cloudinary.com/hanen/image/upload/c_fill,h_400,w_600/";
            const images: string[] = [];
            if (feature.image_url) {
                images.push(`${CLOUDINARY_BASE}${feature.image_url}`);
            } else if (feature.logo) {
                images.push(`${CLOUDINARY_BASE}${feature.logo}`);
            } else {
                images.push("/placeholder.jpg");
            }

            // Map categories to products
            const products = mapCategories(feature.category || []);

            farmers.push({
                id: `hanen-${feature.id}`,
                name: feature.name,
                description: description.slice(0, 500), // Limit length
                products,
                location: {
                    lat: feature.latitude,
                    lng: feature.longitude
                },
                address,
                images,
                website: feature.website || undefined,
                phone: feature.phone || undefined,
            });
        }

        console.log(`Processed ${farmers.length} farmers from HANEN`);
        return farmers;

    } catch (error) {
        console.error("HANEN fetch error:", error);
        return [];
    }
}

export async function GET() {
    try {
        // Check cache
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
            return NextResponse.json({
                farmers: cachedData.farmers,
                source: "cache",
                count: cachedData.farmers.length
            }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
                }
            });
        }

        // Fetch fresh data
        const farmers = await fetchFromHanen();

        // Update cache
        cachedData = {
            farmers,
            timestamp: Date.now()
        };

        return NextResponse.json({
            farmers,
            source: "fresh",
            count: farmers.length
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
            }
        });

    } catch (error) {
        console.error("HANEN API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch from HANEN", farmers: [] },
            { status: 500 }
        );
    }
}

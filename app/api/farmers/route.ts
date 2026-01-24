import { NextResponse } from "next/server";
import { Farmer, ProductType } from "@/types";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Regioner med bounding boxes
const REGIONS = {
    oslo: { bbox: "(59.6,10.4,60.15,11.2)", name: "Oslo-området" },
    trondheim: { bbox: "(63.35,10.2,63.5,10.55)", name: "Trondheim-området" },
    bergen: { bbox: "(60.3,5.2,60.45,5.45)", name: "Bergen-området" },
    stavanger: { bbox: "(58.9,5.6,59.05,5.85)", name: "Stavanger-området" },
    kristiansand: { bbox: "(58.1,7.9,58.2,8.15)", name: "Kristiansand-området" },
    tromsø: { bbox: "(69.6,18.85,69.7,19.1)", name: "Tromsø-området" },
};

// Cache for merged data (1 hour to reduce API calls)
let mergedCache: { farmers: Farmer[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchFromOSMRegion(regionKey: string, region: { bbox: string; name: string }): Promise<Farmer[]> {
    const query = `
        [out:json][timeout:25];
        (
          node["shop"="farm"]${region.bbox};
          node["shop"="dairy"]${region.bbox};
          node["shop"="butcher"]${region.bbox};
          node["shop"="greengrocer"]${region.bbox};
          node["shop"="honey"]${region.bbox};
          node["shop"="cheese"]${region.bbox};
          node["shop"="fish"]${region.bbox};
          node["shop"="seafood"]${region.bbox};
          node["craft"="beekeeper"]${region.bbox};
          node["amenity"="marketplace"]${region.bbox};
          node["shop"="bakery"]${region.bbox};
          node["shop"="deli"]${region.bbox};
        );
        out body;
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
        const response = await fetch(OVERPASS_URL, {
            method: "POST",
            body: "data=" + encodeURIComponent(query),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error("OSM response not ok:", response.status);
            return [];
        }

    const data = await response.json();
    const farmers: Farmer[] = [];

    for (const element of data.elements) {
        if (element.type === "node" && element.tags) {
            const products: ProductType[] = [];
            const tags = element.tags;

            if (tags.produce) {
                if (tags.produce.includes("honey")) products.push("honey");
                if (tags.produce.includes("eggs")) products.push("eggs");
                if (tags.produce.includes("meat")) products.push("meat");
                if (tags.produce.includes("milk")) products.push("milk");
                if (tags.produce.includes("vegetables")) products.push("vegetables");
            }

            if (tags.craft === "beekeeper") products.push("honey");
            if (tags.shop === "butcher") products.push("meat");
            if (tags.shop === "dairy") products.push("milk");
            if (tags.shop === "greengrocer") products.push("vegetables");
            if (tags.shop === "honey") products.push("honey");
            if (tags.shop === "cheese") products.push("cheese");
            if (tags.shop === "fish" || tags.shop === "seafood") products.push("fish");
            if (tags.shop === "bakery") products.push("bread");
            if (tags.shop === "farm" && products.length === 0) products.push("seasonal");
            if (products.length === 0) products.push("seasonal");

            farmers.push({
                id: `osm-${element.id}`,
                name: tags.name || "Lokal Gård",
                description: tags.description || tags.note || "Lokal produsent med ferske varer.",
                products: Array.from(new Set(products)),
                location: { lat: element.lat, lng: element.lon },
                address: tags["addr:street"]
                    ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}, ${tags["addr:city"] || region.name.replace("-området", "")}`.trim()
                    : region.name,
                images: ["/placeholder.jpg"]
            });
        }
    }

    console.log(`OSM ${regionKey} returned ${farmers.length} farmers`);
    return farmers;
    } catch (error) {
        console.error(`OSM ${regionKey} fetch error:`, error);
        return [];
    }
}

async function fetchFromOSM(): Promise<Farmer[]> {
    // Fetch from all regions in parallel
    const regionEntries = Object.entries(REGIONS);
    const results = await Promise.all(
        regionEntries.map(([key, region]) => fetchFromOSMRegion(key, region).catch(() => []))
    );

    // Flatten results
    const allFarmers = results.flat();
    console.log(`OSM total: ${allFarmers.length} farmers from ${regionEntries.length} regions`);
    return allFarmers;
}

async function fetchFromBondensMarked(): Promise<Farmer[]> {
    try {
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/scrape/bondensmarked`, {
            cache: "no-store" // Always get fresh data, scraper has its own cache
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.farmers || [];
    } catch (error) {
        console.error("Bondens Marked fetch error:", error);
        return [];
    }
}

async function fetchFromHanen(): Promise<Farmer[]> {
    try {
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000";

        const response = await fetch(`${baseUrl}/api/scrape/hanen`, {
            cache: "no-store"
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.farmers || [];
    } catch (error) {
        console.error("HANEN fetch error:", error);
        return [];
    }
}

export async function GET() {
    try {
        // Check cache
        if (mergedCache && Date.now() - mergedCache.timestamp < CACHE_DURATION) {
            return NextResponse.json({
                farmers: mergedCache.farmers,
                count: mergedCache.farmers.length,
                source: "cache"
            }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
                }
            });
        }

        // Fetch from all sources in parallel
        const [osmFarmers, bmFarmers, hanenFarmers] = await Promise.all([
            fetchFromOSM().catch(() => []),
            fetchFromBondensMarked().catch(() => []),
            fetchFromHanen().catch(() => [])
        ]);

        // Merge and deduplicate by name similarity
        // Priority: HANEN first (best data), then Bondens Marked, then OSM
        const allFarmers = [...hanenFarmers, ...bmFarmers, ...osmFarmers];
        const seen = new Set<string>();
        const uniqueFarmers: Farmer[] = [];

        for (const farmer of allFarmers) {
            const normalizedName = farmer.name.toLowerCase().replace(/[^a-zæøå0-9]/g, "");
            if (!seen.has(normalizedName)) {
                seen.add(normalizedName);
                uniqueFarmers.push(farmer);
            }
        }

        // Update cache
        mergedCache = {
            farmers: uniqueFarmers,
            timestamp: Date.now()
        };

        return NextResponse.json({
            farmers: uniqueFarmers,
            count: uniqueFarmers.length,
            sources: {
                hanen: hanenFarmers.length,
                bondensmarked: bmFarmers.length,
                osm: osmFarmers.length
            }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        console.error("Farmers API Error:", error);
        return NextResponse.json({ error: "Failed to fetch farmers", farmers: [] }, { status: 500 });
    }
}

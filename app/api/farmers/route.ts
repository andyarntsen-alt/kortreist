import { NextResponse } from "next/server";
import { Farmer, ProductType } from "@/types";

// Oslo og Akershus bounding box
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const OSLO_BBOX = "(59.6,10.4,60.15,11.2)";

// Cache for merged data (1 hour to reduce API calls)
let mergedCache: { farmers: Farmer[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchFromOSM(): Promise<Farmer[]> {
    const query = `
        [out:json][timeout:25];
        (
          node["shop"="farm"]${OSLO_BBOX};
          node["shop"="dairy"]${OSLO_BBOX};
          node["shop"="butcher"]${OSLO_BBOX};
          node["shop"="greengrocer"]${OSLO_BBOX};
          node["shop"="honey"]${OSLO_BBOX};
          node["shop"="cheese"]${OSLO_BBOX};
          node["shop"="fish"]${OSLO_BBOX};
          node["shop"="seafood"]${OSLO_BBOX};
          node["craft"="beekeeper"]${OSLO_BBOX};
          node["amenity"="marketplace"]${OSLO_BBOX};
          node["shop"="bakery"]${OSLO_BBOX};
          node["shop"="deli"]${OSLO_BBOX};
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
                description: tags.description || tags.note || "Lokal gård med ferske varer.",
                products: Array.from(new Set(products)),
                location: { lat: element.lat, lng: element.lon },
                address: tags["addr:street"]
                    ? `${tags["addr:street"]} ${tags["addr:housenumber"] || ""}, ${tags["addr:city"] || "Oslo"}`.trim()
                    : "Oslo-området",
                images: ["/placeholder.jpg"]
            });
        }
    }

    console.log(`OSM returned ${farmers.length} farmers`);
    return farmers;
    } catch (error) {
        console.error("OSM fetch error:", error);
        return [];
    }
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
        const [osmFarmers, bmFarmers] = await Promise.all([
            fetchFromOSM().catch(() => []),
            fetchFromBondensMarked().catch(() => [])
        ]);

        // Merge and deduplicate by name similarity
        const allFarmers = [...osmFarmers, ...bmFarmers];
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
                osm: osmFarmers.length,
                bondensmarked: bmFarmers.length
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

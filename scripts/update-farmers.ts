#!/usr/bin/env npx tsx
/**
 * Script for å oppdatere farmers.json med data fra Bondens Marked
 * Kjør med: npx tsx scripts/update-farmers.ts
 */

import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";

interface ProductType {
    type: string;
}

interface Farmer {
    id: string;
    name: string;
    description: string;
    products: string[];
    location: { lat: number; lng: number };
    address: string;
    images: string[];
}

const LOKALLAG_IDS = [4, 1, 2, 3, 5, 6, 7, 8];
const BASE_URL = "https://bondensmarked.no";
const OSLO_CENTER = { lat: 59.9139, lng: 10.7522 };

function inferProducts(text: string): string[] {
    const lowerText = text.toLowerCase();
    const products: string[] = [];

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

    if (products.length === 0) products.push("seasonal");
    return [...new Set(products)];
}

async function fetchPage(url: string): Promise<{ name: string; url: string; description: string; cardImage: string | null }[]> {
    try {
        console.log(`  Henter: ${url}`);
        const response = await fetch(url, {
            headers: { "User-Agent": "KortreistMat/1.0 (https://kortreistmat.no)" }
        });
        if (!response.ok) return [];

        const html = await response.text();
        const $ = cheerio.load(html);
        const links: { name: string; url: string; description: string; cardImage: string | null }[] = [];

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
                    cardImage
                });
            }
        });
        return links;
    } catch (error) {
        console.error(`  Feil ved ${url}:`, error);
        return [];
    }
}

async function scrapeBondensMarked(): Promise<Farmer[]> {
    console.log("\n🥕 Scraper Bondens Marked...\n");

    const allProducerLinks: { name: string; url: string; description: string; cardImage: string | null }[] = [];

    // Hent alle region-sider
    const mainUrls = [
        `${BASE_URL}/produsenter`,
        ...LOKALLAG_IDS.map(id => `${BASE_URL}/produsenter?lokallag=${id}`)
    ];

    for (const url of mainUrls) {
        const links = await fetchPage(url);
        allProducerLinks.push(...links);
        // Litt pause for å være snill mot serveren
        await new Promise(r => setTimeout(r, 500));
    }

    // Fjern duplikater
    const uniqueProducers = allProducerLinks.filter((p, i, arr) =>
        arr.findIndex(x => x.url === p.url) === i
    );

    console.log(`\n✅ Fant ${uniqueProducers.length} unike produsenter\n`);

    // Konverter til Farmer-format
    const farmers: Farmer[] = [];
    for (const producer of uniqueProducers) {
        const id = producer.url.split("/").pop() || `bm-${Date.now()}`;
        const products = inferProducts(`${producer.name} ${producer.description}`);

        // Tilfeldig plassering rundt Oslo (siden vi ikke har eksakte koordinater)
        const location = {
            lat: OSLO_CENTER.lat + (Math.random() - 0.5) * 0.15,
            lng: OSLO_CENTER.lng + (Math.random() - 0.5) * 0.15
        };

        const cleanName = producer.name.split(/\s{2,}/)[0].trim();

        farmers.push({
            id: `bm-${id}`,
            name: cleanName,
            description: producer.description || `Lokal produsent fra Bondens Marked.`,
            products,
            location,
            address: "Oslo-området",
            images: producer.cardImage ? [producer.cardImage] : ["/placeholder-farm.jpg"]
        });
    }

    return farmers;
}

async function main() {
    console.log("🌾 Oppdaterer farmers.json...\n");

    // Les eksisterende data
    const dataPath = path.join(__dirname, "..", "data", "farmers.json");
    const existingData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    const existingFarmers: Farmer[] = existingData.farmers || [];

    console.log(`📁 Eksisterende: ${existingFarmers.length} produsenter`);

    // Hent nye fra Bondens Marked
    const bmFarmers = await scrapeBondensMarked();

    // Slå sammen - behold eksisterende som ikke er fra BM, legg til nye BM
    const nonBmFarmers = existingFarmers.filter(f => !f.id.startsWith("bm-"));
    const allFarmers = [...nonBmFarmers, ...bmFarmers];

    // Dedupliser på navn
    const seen = new Set<string>();
    const uniqueFarmers: Farmer[] = [];
    for (const farmer of allFarmers) {
        const normalizedName = farmer.name.toLowerCase().replace(/[^a-zæøå0-9]/g, "");
        if (!seen.has(normalizedName)) {
            seen.add(normalizedName);
            uniqueFarmers.push(farmer);
        }
    }

    console.log(`\n📊 Resultat:`);
    console.log(`   - Ikke-BM: ${nonBmFarmers.length}`);
    console.log(`   - Bondens Marked: ${bmFarmers.length}`);
    console.log(`   - Totalt (etter deduplisering): ${uniqueFarmers.length}`);

    // Lagre
    const output = { farmers: uniqueFarmers };
    fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Lagret til ${dataPath}\n`);
}

main().catch(console.error);

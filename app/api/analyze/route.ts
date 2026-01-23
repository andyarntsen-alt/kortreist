import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import * as cheerio from "cheerio";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;
        let { text } = body;

        // SCENARIO 1: URL provided -> Fetch Content
        if (url) {
            console.log("Fetching URL:", url);
            try {
                const res = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    }
                });
                const html = await res.text();

                // Parse HTML to get main text (reduce token usage)
                const $ = cheerio.load(html);

                // Remove scripts, styles, and nav/footers to reduce noise
                $('script, style, nav, footer, iframe, svg').remove();

                // Get text content
                text = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000); // Limit context window
                console.log("Fetched text length:", text.length);

            } catch (fetchError) {
                console.error("Fetch error:", fetchError);
                return NextResponse.json({ error: "Kunne ikke hente nettsiden. Sjekk URL." }, { status: 400 });
            }
        }

        if (!text) {
            return NextResponse.json({ error: "Ingen tekst eller URL funnet." }, { status: 400 });
        }

        console.log("Analyzing with Groq...");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an event extraction AI. Your goal is to extract structured data from unstructured text (website scrape or raw text).
          
          Extract the following fields in strict JSON format:
          - tittel (string): A short, catchy title.
          - beskrivelse (string): A summary of the event (max 200 chars).
          - pris (number): The price in NOK (0 if free).
          - prisType (string): "gratis" or "betalt".
          - dato (string): Date in format DD.MM.YYYY (if not found/past, assume upcoming realistic date).
          - tid (string): Time range (e.g., "12:00-14:00").
          - kategori (string): One of: "tur", "lekeplass", "teater", "musikk", "bibliotek", "museum", "annet".
          - lokasjon (object): { adresse: "Address string", lat: 59.9139, lng: 10.7522 }. (Guess approximate coords if address found).

          Return ONLY the JSON object. Do not include markdown formatting.
          If multiple events are found, return the FIRST/MOST RELEVANT one only for this simple version.`,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
        });

        const content = completion.choices[0]?.message?.content || "{}";
        const jsonString = content.replace(/```json\n?|\n?```/g, "").trim();
        const analyzedData = JSON.parse(jsonString);

        return NextResponse.json(analyzedData);
    } catch (error) {
        console.error("Groq/AI Error:", error);
        return NextResponse.json(
            { error: "Failed to analyze text" },
            { status: 500 }
        );
    }
}

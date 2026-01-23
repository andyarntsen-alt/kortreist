import { Farmer } from "@/types";
import { getProductLabel } from "./utils";

/**
 * Search farmers by text query
 * Searches in: name, description, products, address
 */
export function searchFarmers(farmers: Farmer[], query: string): Farmer[] {
    if (!query || query.trim() === "") {
        return farmers;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    return farmers.filter(farmer => {
        const searchableText = [
            farmer.name,
            farmer.description,
            farmer.address,
            ...farmer.products.map(p => getProductLabel(p)),
            ...farmer.products // Also search raw product IDs
        ].join(" ").toLowerCase();

        // Match if all query words are found somewhere in the searchable text
        return queryWords.every(word => searchableText.includes(word));
    });
}

/**
 * Filter farmers by product types
 */
export function filterByProducts(farmers: Farmer[], products: string[]): Farmer[] {
    if (!products || products.length === 0) {
        return farmers;
    }

    return farmers.filter(farmer =>
        products.some(product => farmer.products.includes(product))
    );
}

/**
 * Combined search and filter
 */
export function searchAndFilter(
    farmers: Farmer[],
    query: string,
    products: string[]
): Farmer[] {
    let results = farmers;

    // Apply text search
    results = searchFarmers(results, query);

    // Apply product filter
    results = filterByProducts(results, products);

    return results;
}

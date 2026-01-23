import { Farmer, Location } from "@/types";

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Add distance to each farmer from a given location
 */
export function addDistanceToFarmers(
    farmers: Farmer[],
    userLocation: Location
): Farmer[] {
    return farmers.map(farmer => ({
        ...farmer,
        distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            farmer.location.lat,
            farmer.location.lng
        )
    }));
}

/**
 * Filter farmers within a given radius (in km)
 */
export function filterByRadius(
    farmers: Farmer[],
    userLocation: Location,
    radiusKm: number
): Farmer[] {
    return farmers.filter(farmer => {
        const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            farmer.location.lat,
            farmer.location.lng
        );
        return distance <= radiusKm;
    });
}

/**
 * Sort farmers by distance from user location
 */
export function sortByDistance(
    farmers: Farmer[],
    userLocation: Location
): Farmer[] {
    const farmersWithDistance = addDistanceToFarmers(farmers, userLocation);
    return farmersWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
}

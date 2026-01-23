export type ProductType =
    | 'honey'
    | 'milk'
    | 'eggs'
    | 'meat'
    | 'vegetables'
    | 'seasonal'
    | 'fish'
    | 'shellfish'
    | 'beeswax'
    | 'raw_milk'
    | 'sausages'
    | 'potatoes'
    | 'cheese'
    | 'bread';

export interface Location {
    lat: number;
    lng: number;
}

export interface Farmer {
    id: string;
    name: string;
    description: string;
    products: string[];
    location: Location;
    address: string;
    images: string[];
    distance?: number; // Distance in km from user
    website?: string;
    phone?: string;
}

export interface FilterState {
    products: ProductType[];
    searchQuery?: string;
}

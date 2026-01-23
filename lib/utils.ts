import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getProductLabel(id: string): string {
    const map: Record<string, string> = {
        'honey': 'Honning',
        'beeswax': 'Bievoks',
        'milk': 'Melk',
        'raw_milk': 'Råmelk',
        'eggs': 'Egg',
        'meat': 'Kjøtt',
        'sausages': 'Pølser',
        'vegetables': 'Grønnsaker',
        'potatoes': 'Poteter',
        'seasonal': 'Sesongvarer',
        'fish': 'Fisk',
        'shellfish': 'Skalldyr',
        'cheese': 'Ost',
        'bread': 'Brød'
    };
    return map[id.toLowerCase()] || id;
}

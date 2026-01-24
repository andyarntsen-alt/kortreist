import { Metadata } from "next";
import rawData from "@/data/farmers.json";
import { Farmer } from "@/types";
import { getProductLabel } from "@/lib/utils";
import { FarmerPageContent } from "@/components/features/FarmerPageContent";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const farmer = (rawData.farmers as Farmer[]).find(f => f.id === id);

    if (!farmer) {
        return {
            title: "Produsent ikke funnet | Kortreist Mat",
        };
    }

    const products = farmer.products.map(p => getProductLabel(p)).join(", ");

    return {
        title: `${farmer.name} | Kortreist Mat`,
        description: `Kjøp ${products} direkte fra ${farmer.name}. ${farmer.description}`,
        openGraph: {
            title: farmer.name,
            description: `Kjøp ${products} direkte fra ${farmer.name}`,
            images: farmer.images[0] && !farmer.images[0].includes('placeholder') ? [farmer.images[0]] : [],
        },
    };
}

export default function FarmerPage({ params }: { params: Promise<{ id: string }> }) {
    return <FarmerPageContent params={params} />;
}

import { Metadata } from "next";
import rawData from "@/data/farmers.json";
import { Farmer } from "@/types";
import { getProductLabel } from "@/lib/utils";

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const farmer = (rawData.farmers as Farmer[]).find((f) => f.id === id);

    if (!farmer) {
        return {
            title: "Produsent ikke funnet | Kortreist Mat",
        };
    }

    const products = farmer.products.map((p) => getProductLabel(p)).join(", ");
    const title = `${farmer.name} | Kortreist Mat`;
    const description = `Kjøp ${products} fra ${farmer.name} i ${farmer.address}. ${farmer.description.slice(0, 120)}...`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            locale: "nb_NO",
            siteName: "Kortreist Mat",
            ...(farmer.images[0] &&
                !farmer.images[0].includes("placeholder") && {
                    images: [
                        {
                            url: farmer.images[0],
                            width: 800,
                            height: 600,
                            alt: farmer.name,
                        },
                    ],
                }),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(farmer.images[0] &&
                !farmer.images[0].includes("placeholder") && {
                    images: [farmer.images[0]],
                }),
        },
    };
}

export default function FarmerLayout({ children }: Props) {
    return <>{children}</>;
}

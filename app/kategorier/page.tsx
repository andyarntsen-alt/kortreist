"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Milk, Droplets, Cookie, Egg, Beef, Wheat, Fish } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Farmer, ProductType } from "@/types";
import rawData from "@/data/farmers.json";

const categories: {
    id: ProductType;
    label: string;
    icon: typeof Milk;
    color: string;
    description: string;
}[] = [
    {
        id: "raw_milk",
        label: "Råmelk",
        icon: Milk,
        color: "bg-white",
        description: "Upasteurisert melk direkte fra gården. Naturlig og næringsrik."
    },
    {
        id: "honey",
        label: "Honning",
        icon: Droplets,
        color: "bg-[#FFD700]",
        description: "Lokal honning fra norske birøktere. Rå og ubehandlet."
    },
    {
        id: "bread",
        label: "Brød",
        icon: Cookie,
        color: "bg-[#DEB887]",
        description: "Hjemmebakt brød, lefser og bakevarer fra lokale bakerier."
    },
    {
        id: "eggs",
        label: "Egg",
        icon: Egg,
        color: "bg-[#FFA500]",
        description: "Frittgående høner, økologiske egg fra små gårder."
    },
    {
        id: "meat",
        label: "Kjøtt",
        icon: Beef,
        color: "bg-[#FF90E8]",
        description: "Storfe, gris, lam og vilt fra lokale bønder med dyrevelferd i fokus."
    },
    {
        id: "vegetables",
        label: "Grønnsaker",
        icon: Wheat,
        color: "bg-[#CCFF00]",
        description: "Sesongbaserte grønnsaker, poteter og urter fra nærområdet."
    },
    {
        id: "cheese",
        label: "Ost",
        icon: Milk,
        color: "bg-[#FFE4B5]",
        description: "Håndlaget ost fra lokale ysterier. Hvitost, brunost og spesialiteter."
    },
    {
        id: "fish",
        label: "Fisk",
        icon: Fish,
        color: "bg-[#00D2FF]",
        description: "Fersk fisk og sjømat fra lokale fiskere og fiskehandlere."
    }
];

export default function KategorierPage() {
    // Start with local data immediately
    const [farmers, setFarmers] = useState<Farmer[]>(rawData.farmers as Farmer[]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchMoreFarmers() {
            try {
                const res = await fetch("/api/farmers");
                const data = await res.json();
                if (data.farmers && data.farmers.length > 0) {
                    // Merge API data with local data
                    const apiIds = new Set(data.farmers.map((f: Farmer) => f.id));
                    const localFarmers = (rawData.farmers as Farmer[]).filter(f => !apiIds.has(f.id));
                    setFarmers([...data.farmers, ...localFarmers]);
                }
            } catch {
                // Keep local data on error
            }
        }
        fetchMoreFarmers();
    }, []);

    // Count producers per category
    const getCategoryCount = (categoryId: ProductType): number => {
        return farmers.filter(f => f.products.includes(categoryId)).length;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-muted/30 border-b-2 border-black py-12">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            Kategorier
                        </h1>
                        <p className="text-lg md:text-xl font-mono max-w-2xl mx-auto">
                            Utforsk lokale produsenter etter hva de selger. Klikk på en kategori for å se alle produsenter.
                        </p>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="container mx-auto px-4 md:px-6 py-12">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat) => {
                                const count = getCategoryCount(cat.id);
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/?filter=${cat.id}`}
                                        className="group"
                                    >
                                        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all h-full">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 ${cat.color} border-2 border-black mb-4`}>
                                                <cat.icon className="h-8 w-8 stroke-[2.5]" />
                                            </div>
                                            <h2 className="text-xl font-black uppercase mb-2 group-hover:text-primary transition-colors">
                                                {cat.label}
                                            </h2>
                                            <p className="text-sm text-muted-foreground font-mono mb-4">
                                                {cat.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-4 border-t border-black/10">
                                                <span className="text-2xl font-black text-primary">{count}</span>
                                                <span className="text-xs font-mono text-muted-foreground uppercase">produsenter</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

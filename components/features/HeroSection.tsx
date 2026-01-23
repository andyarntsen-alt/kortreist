"use client";

import { Button } from "@/components/ui/button";
import { Milk, Egg, Wheat, Droplets, Beef, MapPin, Loader2, Fish, Cookie, ChevronDown } from "lucide-react";
import { ProductType, Farmer } from "@/types";
import { SearchInput } from "./SearchInput";
import { useRouter } from "next/navigation";

const categories: { id: ProductType; label: string; icon: typeof Droplets; color: string }[] = [
    { id: "raw_milk", label: "Råmelk", icon: Milk, color: "bg-white text-black" },
    { id: "honey", label: "Honning", icon: Droplets, color: "bg-[#FFD700] text-black" },
    { id: "bread", label: "Brød", icon: Cookie, color: "bg-[#DEB887] text-black" },
    { id: "eggs", label: "Egg", icon: Egg, color: "bg-[#FFA500] text-black" },
    { id: "meat", label: "Kjøtt", icon: Beef, color: "bg-[#FF90E8] text-black" },
    { id: "vegetables", label: "Grønnsaker", icon: Wheat, color: "bg-[#CCFF00] text-black" },
    { id: "cheese", label: "Ost", icon: Milk, color: "bg-[#FFE4B5] text-black" },
    { id: "fish", label: "Fisk", icon: Fish, color: "bg-[#00D2FF] text-black" },
];

interface HeroSectionProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onCategoryClick?: (categoryId: ProductType) => void;
    activeCategories?: ProductType[];
    onFindNearMe?: () => void;
    isLocating?: boolean;
    farmers?: Farmer[];
}

export function HeroSection({
    searchQuery = "",
    onSearchChange,
    onCategoryClick,
    activeCategories = [],
    onFindNearMe,
    isLocating = false,
    farmers = [],
}: HeroSectionProps) {
    const router = useRouter();

    const scrollToResults = () => {
        setTimeout(() => {
            const el = document.getElementById("aktiviteter");
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const handleCategoryClick = (categoryId: ProductType) => {
        onCategoryClick?.(categoryId);
        scrollToResults();
    };

    const handleSelectFarmer = (farmerId: string) => {
        router.push(`/farmer/${farmerId}`);
    };

    const handleSelectProduct = (productId: ProductType) => {
        if (!activeCategories.includes(productId)) {
            onCategoryClick?.(productId);
        }
        scrollToResults();
    };

    return (
        <div className="relative overflow-hidden bg-background border-b-2 border-black pt-20 pb-16 md:pt-32 md:pb-24">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-16 h-16 bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden lg:block" />
            <div className="absolute top-20 right-20 w-12 h-12 bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-12 hidden lg:block" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="mx-auto max-w-4xl text-center space-y-8">
                    <div className="inline-block bg-[#FF6B6B] border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 mb-4">
                        <span className="text-sm font-bold uppercase tracking-widest text-white">Dyre butikker? Nei takk</span>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl text-foreground uppercase leading-[0.9]">
                        Ekte <span className="text-primary italic">mat</span> fra ekte<br /> bønder
                    </h1>
                    <p className="text-xl font-bold font-mono md:text-2xl max-w-2xl mx-auto bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Dropp de dyre dagligvarekjedene. Finn råmelk, lokalhonning, hjemmebakt brød og ferskt kjøtt - direkte fra bonden.
                    </p>

                    <div className="relative mx-auto mt-10 max-w-xl">
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => onSearchChange?.(val)}
                            farmers={farmers}
                            onSelectFarmer={handleSelectFarmer}
                            onSelectProduct={handleSelectProduct}
                        />
                    </div>

                    {/* Find Near Me Button */}
                    <div className="mt-6 flex justify-center">
                        <Button
                            size="lg"
                            onClick={onFindNearMe}
                            disabled={isLocating}
                            className="h-12 px-6 bg-[#90EE90] text-black hover:bg-[#7CCD7C] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50"
                        >
                            {isLocating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <MapPin className="mr-2 h-5 w-5" />
                            )}
                            {isLocating ? "FINNER DEG..." : "FINN NÆR MEG"}
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => {
                            const isActive = activeCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${cat.color} ${isActive ? "ring-4 ring-black ring-offset-2" : ""}`}
                                >
                                    <cat.icon className="h-4 w-4 stroke-[2.5]" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Scroll hint */}
                    <div className="mt-8 animate-bounce">
                        <ChevronDown className="h-6 w-6 mx-auto text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}

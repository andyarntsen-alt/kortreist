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
    { id: "vegetables", label: "Grønt", icon: Wheat, color: "bg-[#CCFF00] text-black" },
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
        <div className="relative overflow-hidden bg-background border-b-2 border-black pt-6 pb-8 md:pt-20 md:pb-16">
            {/* Decorative Elements - Desktop only */}
            <div className="absolute top-10 left-10 w-16 h-16 bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden lg:block" />
            <div className="absolute top-20 right-20 w-12 h-12 bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-12 hidden lg:block" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="mx-auto max-w-4xl text-center space-y-4 md:space-y-8">
                    {/* Badge */}
                    <div className="inline-block bg-[#FF6B6B] border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                        <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">Dyre butikker? Nei takk</span>
                    </div>

                    {/* Main Heading - Mobile optimized */}
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl lg:text-8xl text-foreground uppercase leading-[0.9]">
                        Ekte <span className="text-primary italic">mat</span><br className="sm:hidden" /> fra<br className="hidden sm:block" /> ekte bønder
                    </h1>

                    {/* Tagline - Compact on mobile */}
                    <p className="text-base md:text-xl lg:text-2xl font-bold font-mono max-w-2xl mx-auto bg-white border-2 border-black p-3 md:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <span className="hidden sm:inline">Dropp de dyre dagligvarekjedene. </span>Finn råmelk, honning, brød og kjøtt - direkte fra bonden.
                    </p>

                    {/* Search Input - Full width on mobile */}
                    <div className="relative mx-auto mt-6 md:mt-10 max-w-xl">
                        <SearchInput
                            value={searchQuery}
                            onChange={(val) => onSearchChange?.(val)}
                            farmers={farmers}
                            onSelectFarmer={handleSelectFarmer}
                            onSelectProduct={handleSelectProduct}
                        />
                    </div>

                    {/* Find Near Me Button - Touch friendly */}
                    <div className="mt-4 md:mt-6 flex justify-center">
                        <Button
                            size="lg"
                            onClick={onFindNearMe}
                            disabled={isLocating}
                            className="h-12 md:h-14 px-6 md:px-8 text-sm md:text-base bg-[#90EE90] text-black hover:bg-[#7CCD7C] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 touch-manipulation"
                        >
                            {isLocating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <MapPin className="mr-2 h-5 w-5" />
                            )}
                            {isLocating ? "FINNER DEG..." : "FINN NÆR MEG"}
                        </Button>
                    </div>

                    {/* Categories - Horizontal scroll on mobile */}
                    <div className="mt-6 md:mt-8 -mx-4 md:mx-0">
                        <div className="flex md:flex-wrap md:justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide px-4 md:px-0 pb-2 md:pb-0 snap-x snap-mandatory">
                            {categories.map((cat) => {
                                const isActive = activeCategories.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className={`flex-shrink-0 snap-start flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] touch-manipulation ${cat.color} ${isActive ? "ring-2 md:ring-4 ring-black ring-offset-1 md:ring-offset-2" : ""}`}
                                    >
                                        <cat.icon className="h-4 w-4 stroke-[2.5]" />
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Scroll hint - Smaller on mobile */}
                    <div className="mt-4 md:mt-8 animate-bounce">
                        <ChevronDown className="h-5 w-5 md:h-6 md:w-6 mx-auto text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}

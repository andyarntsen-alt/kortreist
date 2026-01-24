"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Tag } from "lucide-react";
import { Farmer, ProductType } from "@/types";
import { getProductLabel } from "@/lib/utils";

interface SearchSuggestion {
    type: "farmer" | "product";
    id: string;
    label: string;
    subLabel?: string;
}

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    farmers: Farmer[];
    onSelectFarmer?: (farmerId: string) => void;
    onSelectProduct?: (productId: ProductType) => void;
}

const ALL_PRODUCTS: ProductType[] = [
    "raw_milk", "honey", "bread", "eggs", "meat", "vegetables", "cheese", "fish"
];

export function SearchInput({
    value,
    onChange,
    farmers,
    onSelectFarmer,
    onSelectProduct,
}: SearchInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Generate suggestions based on input
    const suggestions = useMemo<SearchSuggestion[]>(() => {
        if (!value || value.length < 2) return [];

        const query = value.toLowerCase();
        const results: SearchSuggestion[] = [];

        // Match products first
        ALL_PRODUCTS.forEach(productId => {
            const label = getProductLabel(productId);
            if (label.toLowerCase().includes(query) || productId.includes(query)) {
                results.push({
                    type: "product",
                    id: productId,
                    label: label,
                });
            }
        });

        // Match farmers (limit to 5)
        const matchedFarmers = farmers
            .filter(f =>
                f.name.toLowerCase().includes(query) ||
                f.address.toLowerCase().includes(query)
            )
            .slice(0, 5);

        matchedFarmers.forEach(farmer => {
            results.push({
                type: "farmer",
                id: farmer.id,
                label: farmer.name,
                subLabel: farmer.address,
            });
        });

        return results.slice(0, 8);
    }, [value, farmers]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleSelect(suggestions[selectedIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (suggestion: SearchSuggestion) => {
        if (suggestion.type === "farmer") {
            onSelectFarmer?.(suggestion.id);
        } else {
            onSelectProduct?.(suggestion.id as ProductType);
        }
        setIsOpen(false);
        onChange("");
        inputRef.current?.blur();

        // Scroll to results
        setTimeout(() => {
            const resultsEl = document.getElementById("aktiviteter");
            if (resultsEl) {
                resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    return (
        <div ref={wrapperRef} className="relative flex-1">
            <Search className="absolute left-3 md:left-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-black z-10" />
            <Input
                ref={inputRef}
                id="search-producer"
                name="search-producer"
                placeholder="Søk produsent..."
                className="pl-10 md:pl-12 h-12 md:h-14 text-base md:text-lg font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] touch-manipulation"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                    setSelectedIndex(-1);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
            />

            {/* Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 max-h-64 md:max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.type}-${suggestion.id}`}
                            className={`w-full px-3 md:px-4 py-3 md:py-3 flex items-center gap-2 md:gap-3 text-left active:bg-gray-200 transition-colors touch-manipulation ${
                                index === selectedIndex ? "bg-primary/20" : ""
                            }`}
                            onClick={() => handleSelect(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {suggestion.type === "product" ? (
                                <Tag className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                                <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="font-bold text-sm truncate">
                                    {suggestion.label}
                                </div>
                                {suggestion.subLabel && (
                                    <div className="text-xs text-gray-500 truncate">
                                        {suggestion.subLabel}
                                    </div>
                                )}
                            </div>
                            {suggestion.type === "product" && (
                                <span className="text-xs bg-primary/20 px-2 py-0.5 rounded font-medium shrink-0">
                                    Kategori
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

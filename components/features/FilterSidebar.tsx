"use client";

import { FilterState, ProductType, SortOption } from "@/types";
import { Heart, MapPin, ArrowUpDown } from "lucide-react";

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
    showFavoritesOnly?: boolean;
    onToggleFavoritesOnly?: () => void;
    favoritesCount?: number;
    // Radius filter
    radiusKm?: number | null;
    onRadiusChange?: (radius: number | null) => void;
    hasUserLocation?: boolean;
    // Sorting
    sortBy?: SortOption;
    onSortChange?: (sort: SortOption) => void;
}

const RADIUS_OPTIONS = [
    { value: null, label: "Alle" },
    { value: 5, label: "5 km" },
    { value: 10, label: "10 km" },
    { value: 25, label: "25 km" },
    { value: 50, label: "50 km" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "distance", label: "Nærmest" },
    { value: "name", label: "A-Å" },
    { value: "products", label: "Flest produkter" },
];

export function FilterSidebar({
    filters,
    setFilters,
    className,
    showFavoritesOnly = false,
    onToggleFavoritesOnly,
    favoritesCount = 0,
    radiusKm = null,
    onRadiusChange,
    hasUserLocation = false,
    sortBy = "distance",
    onSortChange,
}: FilterSidebarProps) {
    const categories: { id: ProductType, label: string }[] = [
        { id: 'raw_milk', label: 'Råmelk' },
        { id: 'milk', label: 'Melk' },
        { id: 'honey', label: 'Honning' },
        { id: 'eggs', label: 'Egg' },
        { id: 'meat', label: 'Kjøtt' },
        { id: 'vegetables', label: 'Grønnsaker' },
        { id: 'cheese', label: 'Ost' },
        { id: 'fish', label: 'Fisk' },
        { id: 'bread', label: 'Brød' },
        { id: 'seasonal', label: 'Sesong' },
    ];

    const toggleCategory = (catId: ProductType) => {
        const current = filters.products || [];
        const isSelected = current.includes(catId);
        if (isSelected) {
            setFilters({ ...filters, products: current.filter(c => c !== catId) });
        } else {
            setFilters({ ...filters, products: [...current, catId] });
        }
    };

    const clearAll = () => {
        setFilters({ products: [] });
    };

    return (
        <div className={`space-y-4 p-4 md:p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className || ''}`}>
            {/* Sort Options */}
            {onSortChange && (
                <div className="pb-4 border-b-2 border-black/10">
                    <h3 className="font-black text-base md:text-lg uppercase flex items-center gap-2 mb-3">
                        <ArrowUpDown className="h-4 w-4" />
                        Sorter
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onSortChange(option.value)}
                                disabled={option.value === "distance" && !hasUserLocation}
                                className={`px-3 py-1.5 text-sm font-bold border-2 border-black transition-all touch-manipulation ${
                                    sortBy === option.value
                                        ? "bg-green-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                        : option.value === "distance" && !hasUserLocation
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                                        : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Radius Filter */}
            {onRadiusChange && (
                <div className="pb-4 border-b-2 border-black/10">
                    <h3 className="font-black text-base md:text-lg uppercase flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4" />
                        Avstand
                    </h3>
                    {!hasUserLocation ? (
                        <p className="text-xs text-muted-foreground">
                            Aktiver posisjon for å filtrere på avstand
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {RADIUS_OPTIONS.map((option) => (
                                <button
                                    key={option.label}
                                    onClick={() => onRadiusChange(option.value)}
                                    className={`px-3 py-1.5 text-sm font-bold border-2 border-black transition-all touch-manipulation ${
                                        radiusKm === option.value
                                            ? "bg-blue-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                            : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Favorites Filter */}
            {onToggleFavoritesOnly && (
                <div className="pb-4 border-b-2 border-black/10">
                    <button
                        onClick={onToggleFavoritesOnly}
                        className={`w-full flex items-center justify-between gap-2 p-2.5 md:p-3 text-sm font-bold border-2 border-black transition-all touch-manipulation ${
                            showFavoritesOnly
                                ? "bg-red-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Heart className={`h-4 w-4 ${showFavoritesOnly ? "fill-red-500 text-red-500" : ""}`} />
                            Kun favoritter
                        </span>
                        {favoritesCount > 0 && (
                            <span className="flex items-center justify-center min-w-[20px] h-5 text-xs bg-red-500 text-white rounded-full px-1.5">
                                {favoritesCount}
                            </span>
                        )}
                    </button>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h3 className="font-black text-base md:text-lg uppercase flex items-center gap-2">
                    <span className="w-3 h-3 md:w-4 md:h-4 bg-primary border-2 border-black"></span>
                    Produkter
                </h3>
                {filters.products.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-xs font-bold text-gray-500 hover:text-black underline touch-manipulation"
                    >
                        Nullstill
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                {categories.map((cat) => {
                    const isSelected = filters.products?.includes(cat.id);
                    return (
                        <label
                            key={cat.id}
                            className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-2 text-sm font-bold cursor-pointer border-2 border-black transition-all touch-manipulation ${
                                isSelected
                                    ? "bg-primary shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                    : "bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
                            }`}
                        >
                            <div className={`relative w-5 h-5 md:w-6 md:h-6 border-2 border-black bg-white flex items-center justify-center flex-shrink-0`}>
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-full h-full cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => toggleCategory(cat.id)}
                                />
                                <div className="absolute inset-0 bg-black hidden peer-checked:block m-0.5 md:m-1"></div>
                            </div>
                            <span className="truncate">{cat.label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}

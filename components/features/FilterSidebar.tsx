"use client";

import { FilterState, ProductType } from "@/types";

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ filters, setFilters, className }: FilterSidebarProps) {
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

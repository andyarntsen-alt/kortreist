"use client";

import { Button } from "@/components/ui/button";
import { FilterState, ProductType } from "@/types";
import { X } from "lucide-react";

interface FilterSidebarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function FilterSidebar({ filters, setFilters, className, onClose }: FilterSidebarProps) {
    const categories: { id: string, label: string }[] = [
        { id: 'honey', label: 'Honning' },
        { id: 'milk', label: 'Melk' },
        { id: 'eggs', label: 'Egg' },
        { id: 'meat', label: 'Kjøtt' },
        { id: 'vegetables', label: 'Grønnsaker' },
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

    return (
        <div className={`space-y-8 p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${className}`}>
            <div className="flex items-center justify-between lg:hidden border-b-2 border-black pb-4 mb-4">
                <h3 className="font-black text-xl uppercase">Filter</h3>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="h-6 w-6 stroke-[3]" /></Button>
            </div>

            <div>
                <h3 className="font-black text-lg uppercase mb-4 flex items-center gap-2">
                    <span className="w-4 h-4 bg-primary border-2 border-black"></span>
                    Produkter
                </h3>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-3 text-sm font-bold cursor-pointer group">
                            <div className="relative w-6 h-6 border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-full h-full cursor-pointer"
                                    checked={filters.products?.includes(cat.id as ProductType)}
                                    onChange={() => toggleCategory(cat.id as ProductType)}
                                />
                                <div className="absolute inset-0 bg-black hidden peer-checked:block m-1"></div>
                            </div>
                            {cat.label}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

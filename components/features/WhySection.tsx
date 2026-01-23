"use client";

import { PiggyBank, Star, Heart } from "lucide-react";

const reasons = [
    {
        icon: PiggyBank,
        title: "Spar Penger",
        description: "Kutt ut mellomleddene. Bonden får mer, du betaler mindre.",
        color: "bg-[#90EE90]"
    },
    {
        icon: Star,
        title: "Bedre Kvalitet",
        description: "Ferske varer høstet samme dag. Ingen lange transportveier.",
        color: "bg-[#FFD700]"
    },
    {
        icon: Heart,
        title: "Støtt Naboen",
        description: "Pengene dine blir i lokalsamfunnet. Ekte relasjon til maten.",
        color: "bg-[#FF90E8]"
    }
];

export function WhySection() {
    return (
        <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4"
                        >
                            <div className={`shrink-0 flex items-center justify-center w-12 h-12 ${reason.color} border-2 border-black`}>
                                <reason.icon className="h-6 w-6 stroke-[2.5]" />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase">{reason.title}</h3>
                                <p className="text-xs text-muted-foreground font-mono">{reason.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
    return (
        <section className="py-8 border-b border-black/10">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-xl md:text-2xl font-black uppercase mb-3">
                        Hva er Kortreist Mat?
                    </h2>
                    <p className="font-mono text-muted-foreground mb-4">
                        Kortreist Mat er en uavhengig guide til lokale matprodusenter i Oslo-området.
                        Vi hjelper deg å finne bønder, gårdsbutikker og markeder som selger ferske,
                        lokale produkter - direkte fra produsent til deg.
                    </p>
                    <Link
                        href="/om"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4"
                    >
                        Les mer om oss
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

"use client";

interface StatsBannerProps {
    farmerCount: number;
}

export function StatsBanner({ farmerCount }: StatsBannerProps) {
    return (
        <div className="bg-black text-white py-4 border-y-2 border-black">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-black text-[#90EE90]">{farmerCount}+</span>
                        <span className="font-mono text-sm md:text-base">produsenter</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">|</div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-black text-[#FFD700]">6</span>
                        <span className="font-mono text-sm md:text-base">byer</span>
                    </div>
                    <div className="hidden sm:block text-muted-foreground">|</div>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl md:text-3xl font-black text-[#FF90E8]">100%</span>
                        <span className="font-mono text-sm md:text-base">norsk</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

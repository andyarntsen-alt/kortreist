import { Farmer } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ChevronDown, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductLabel } from "@/lib/utils";
import { formatDistance } from "@/lib/geo";
import { useState, memo } from "react";
import { ProducerCardSkeleton } from "./ProducerCardSkeleton";

interface ActivityGridProps {
    activities: Farmer[];
    isLoadingMore?: boolean;
}

const ITEMS_PER_PAGE = 12;

// Image component with fallback
function ProducerImage({ src, alt }: { src: string; alt: string }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if src is valid
    const validSrc = src && src !== '/placeholder.jpg' && src !== '/placeholder-farm.jpg';

    if (!validSrc || hasError) {
        // Show placeholder with icon
        return (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <Store className="h-12 w-12 text-primary/40" />
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                className={`h-full w-full object-cover transition-all duration-300 group-hover:scale-105 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
        </>
    );
}

// Memoize individual card to prevent re-renders
const ProducerCard = memo(function ProducerCard({ farmer }: { farmer: Farmer }) {
    return (
        <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-shadow border-2 border-black/10">
            <div className="relative h-40 w-full overflow-hidden bg-muted">
                <ProducerImage src={farmer.images[0] || ''} alt={farmer.name} />
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {farmer.products.slice(0, 3).map((prod) => (
                        <Badge key={prod} variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">
                            {getProductLabel(prod)}
                        </Badge>
                    ))}
                </div>
            </div>

            <CardHeader className="p-4 pb-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/farmer/${farmer.id}`}>{farmer.name}</Link>
                    </h3>
                    {farmer.distance !== undefined && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                            <Navigation className="h-3 w-3" />
                            {formatDistance(farmer.distance)}
                        </span>
                    )}
                </div>
                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{farmer.address}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-grow">
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {farmer.description}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Link href={`/farmer/${farmer.id}`} className="w-full">
                    <Button variant="outline" className="w-full text-sm">Se Detaljer</Button>
                </Link>
            </CardFooter>
        </Card>
    );
});

export function ActivityGrid({ activities, isLoadingMore = false }: ActivityGridProps) {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visibleActivities = activities.slice(0, visibleCount);
    const hasMore = visibleCount < activities.length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleActivities.map((farmer) => (
                    <ProducerCard key={farmer.id} farmer={farmer} />
                ))}
                {/* Show skeleton cards while loading more from API */}
                {isLoadingMore && Array.from({ length: 3 }).map((_, i) => (
                    <ProducerCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4">
                    <Button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        variant="outline"
                        className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Last flere ({activities.length - visibleCount} igjen)
                    </Button>
                </div>
            )}
        </div>
    );
}

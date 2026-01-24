import { Farmer } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, ChevronDown, Store, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProductLabel } from "@/lib/utils";
import { formatDistance } from "@/lib/geo";
import { useState, memo } from "react";
import { ProducerCardSkeleton } from "./ProducerCardSkeleton";

interface ActivityGridProps {
    activities: Farmer[];
    isLoadingMore?: boolean;
    isFavorite?: (id: string) => boolean;
    onToggleFavorite?: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

// Image component with fallback
function ProducerImage({ src, alt }: { src: string; alt: string }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const validSrc = src && src !== '/placeholder.jpg' && src !== '/placeholder-farm.jpg';

    if (!validSrc || hasError) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <Store className="h-10 w-10 md:h-12 md:w-12 text-primary/40" />
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
                className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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

interface ProducerCardProps {
    farmer: Farmer;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

// Memoize individual card to prevent re-renders
const ProducerCard = memo(function ProducerCard({ farmer, isFavorite = false, onToggleFavorite }: ProducerCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite?.(farmer.id);
    };

    return (
        <Link href={`/farmer/${farmer.id}`} className="block touch-manipulation">
            <Card className="overflow-hidden flex flex-col h-full group active:scale-[0.98] transition-transform border-2 border-black/10 hover:border-black/30">
                <div className="relative h-32 md:h-40 w-full overflow-hidden bg-muted">
                    <ProducerImage src={farmer.images[0] || ''} alt={farmer.name} />
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5 md:gap-2 flex-wrap">
                        {farmer.products.slice(0, 2).map((prod) => (
                            <Badge key={prod} variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
                                {getProductLabel(prod)}
                            </Badge>
                        ))}
                        {farmer.products.length > 2 && (
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm text-xs px-2 py-0.5">
                                +{farmer.products.length - 2}
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Button */}
                    {onToggleFavorite && (
                        <button
                            onClick={handleFavoriteClick}
                            className={`absolute top-2 right-2 md:top-3 md:right-3 p-1.5 rounded-full transition-all touch-manipulation ${
                                isFavorite
                                    ? "bg-red-500 text-white shadow-md"
                                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
                            } ${farmer.distance !== undefined ? "top-10 md:top-12" : ""}`}
                            aria-label={isFavorite ? "Fjern fra favoritter" : "Legg til favoritter"}
                        >
                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                        </button>
                    )}

                    {farmer.distance !== undefined && (
                        <span className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            <Navigation className="h-3 w-3" />
                            {formatDistance(farmer.distance)}
                        </span>
                    )}
                </div>

                <CardHeader className="p-3 md:p-4 pb-1">
                    <h3 className="font-bold text-sm md:text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                        {farmer.name}
                    </h3>
                    <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{farmer.address}</span>
                    </div>
                </CardHeader>

                <CardContent className="p-3 md:p-4 pt-1 flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {farmer.description}
                    </p>
                </CardContent>

                <CardFooter className="p-3 md:p-4 pt-0 mt-auto">
                    <Button variant="outline" className="w-full text-xs md:text-sm h-9 md:h-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:shadow-none group-active:translate-x-0.5 group-active:translate-y-0.5">
                        Se Detaljer
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
});

export function ActivityGrid({ activities, isLoadingMore = false, isFavorite, onToggleFavorite }: ActivityGridProps) {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const visibleActivities = activities.slice(0, visibleCount);
    const hasMore = visibleCount < activities.length;

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {visibleActivities.map((farmer) => (
                    <ProducerCard
                        key={farmer.id}
                        farmer={farmer}
                        isFavorite={isFavorite?.(farmer.id)}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
                {isLoadingMore && Array.from({ length: 2 }).map((_, i) => (
                    <ProducerCardSkeleton key={`skeleton-${i}`} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-2 md:pt-4">
                    <Button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        variant="outline"
                        className="h-11 md:h-12 px-6 text-sm md:text-base border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
                    >
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Last flere ({activities.length - visibleCount} igjen)
                    </Button>
                </div>
            )}
        </div>
    );
}

"use client";

import dynamic from "next/dynamic";
import { Farmer, Location } from "@/types";
import { Loader2 } from "lucide-react";

// Dynamic import for Leaflet (client-side only)
const Map = dynamic(() => import("@/components/map/Map"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted/20 border-2 border-black">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
});

interface ProducerMapViewProps {
    farmers: Farmer[];
    userLocation: Location | null;
    className?: string;
}

export function ProducerMapView({ farmers, userLocation, className = "" }: ProducerMapViewProps) {
    return (
        <div className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden ${className}`}>
            <Map
                activities={farmers}
                userLocation={userLocation}
                className="h-full w-full"
            />
        </div>
    );
}

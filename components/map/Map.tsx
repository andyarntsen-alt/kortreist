"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Farmer, Location } from "@/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { getProductLabel } from "@/lib/utils";
import { formatDistance } from "@/lib/geo";

// Fix for default Leaflet markers in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

// User location icon (blue dot)
const UserIcon = L.divIcon({
    className: "user-location-marker",
    html: `<div style="
        width: 20px;
        height: 20px;
        background: #4285F4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    activities: Farmer[];
    center?: [number, number];
    zoom?: number;
    className?: string;
    userLocation?: Location | null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export default function Map({
    activities: farmers,
    center = [59.9139, 10.7522], // Oslo sentrum
    zoom = 11,
    className,
    userLocation
}: MapProps) {
    // Determine map center - use user location if available
    const mapCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : center;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className={`flex items-center justify-center bg-muted/20 ${className}`}>
                <span className="text-muted-foreground">Loading map...</span>
            </div>
        );
    }

    return (
        <MapContainer
            center={mapCenter}
            zoom={userLocation ? 12 : zoom}
            scrollWheelZoom={false}
            className={`z-0 rounded-xl ${className}`}
            style={{ height: "100%", width: "100%" }}
        >
            <ChangeView center={mapCenter} zoom={userLocation ? 12 : zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User location marker */}
            {userLocation && (
                <>
                    <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={UserIcon}
                    >
                        <Popup>
                            <div className="text-sm font-bold">Din posisjon</div>
                        </Popup>
                    </Marker>
                    <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={20000}
                        pathOptions={{
                            color: "#4285F4",
                            fillColor: "#4285F4",
                            fillOpacity: 0.1,
                            weight: 2
                        }}
                    />
                </>
            )}

            {/* Farmer markers */}
            {farmers.map((farmer) => (
                <Marker
                    key={farmer.id}
                    position={[farmer.location.lat, farmer.location.lng]}
                >
                    <Popup className="min-w-[200px]">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-bold">{farmer.name}</h3>
                            {farmer.distance !== undefined && (
                                <span className="text-xs text-blue-600 font-semibold">
                                    📍 {formatDistance(farmer.distance)} unna
                                </span>
                            )}
                            <p className="text-xs text-gray-600 line-clamp-2">{farmer.description}</p>
                            <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                                {farmer.products.slice(0, 2).map(p => (
                                    <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                                        {getProductLabel(p)}
                                    </span>
                                ))}
                            </div>
                            <Link href={`/farmer/${farmer.id}`} className="w-full mt-2">
                                <Button size="sm" variant="secondary" className="w-full h-7 text-xs">
                                    Se Detaljer
                                </Button>
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

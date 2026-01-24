"use client";

import { use, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Navigation, Globe, Phone, Store, Heart } from "lucide-react";
import { ShareButton } from "@/components/features/ShareButton";
import { useFavorites } from "@/lib/hooks/useFavorites";
import Link from "next/link";
import rawData from "@/data/farmers.json";
import { Farmer } from "@/types";
import { getProductLabel } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function FarmerPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const { isFavorite, toggleFavorite } = useFavorites();

    // Get current URL for sharing
    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    useEffect(() => {
        async function loadFarmer() {
            // First check local data
            const localFarmer = (rawData.farmers as Farmer[]).find(f => f.id === resolvedParams.id);
            if (localFarmer) {
                setFarmer(localFarmer);
                setIsLoading(false);
                return;
            }

            // If not found locally, fetch from API
            try {
                const res = await fetch('/api/farmers');
                if (res.ok) {
                    const data = await res.json();
                    const apiFarmer = data.farmers?.find((f: Farmer) => f.id === resolvedParams.id);
                    if (apiFarmer) {
                        setFarmer(apiFarmer);
                    } else {
                        setNotFound(true);
                    }
                } else {
                    setNotFound(true);
                }
            } catch {
                setNotFound(true);
            }
            setIsLoading(false);
        }

        loadFarmer();
    }, [resolvedParams.id]);

    // Generate Google Maps directions URL
    const getDirectionsUrl = (f: Farmer) => {
        if (f.location?.lat && f.location?.lng) {
            return `https://www.google.com/maps/dir/?api=1&destination=${f.location.lat},${f.location.lng}`;
        }
        // Fallback to address search
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(f.address)}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col font-sans bg-background">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (notFound || !farmer) {
        return (
            <div className="min-h-screen flex flex-col font-sans bg-background">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center gap-4">
                    <h1 className="text-2xl font-black uppercase">Produsent ikke funnet</h1>
                    <Link href="/">
                        <Button variant="outline" className="border-2 border-black">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Tilbake til produsenter
                        </Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    // Generate JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: farmer.name,
        description: farmer.description,
        address: {
            "@type": "PostalAddress",
            streetAddress: farmer.address,
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: farmer.location.lat,
            longitude: farmer.location.lng,
        },
        ...(farmer.phone && { telephone: farmer.phone }),
        ...(farmer.website && { url: farmer.website }),
        ...(farmer.images[0] && !farmer.images[0].includes('placeholder') && { image: farmer.images[0] }),
    };

    return (
        <div className="min-h-screen flex flex-col font-sans bg-background">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase mb-8 hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Tilbake til produsenter
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-muted relative">
                            {imageError || !farmer.images[0] || farmer.images[0].includes('placeholder') ? (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                    <Store className="h-24 w-24 text-primary/40" />
                                </div>
                            ) : (
                                <img
                                    src={farmer.images[0]}
                                    alt={farmer.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {farmer.products.map(p => (
                                    <Badge key={p} variant="secondary" className="border-black border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {getProductLabel(p)}
                                    </Badge>
                                ))}
                            </div>
                            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">{farmer.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground font-medium mb-4">
                                <MapPin className="w-5 h-5" />
                                {farmer.address}
                            </div>

                            {/* Share and Favorite buttons */}
                            <div className="flex items-center gap-3">
                                <ShareButton
                                    url={currentUrl}
                                    title={farmer.name}
                                    description={`Kjøp ${farmer.products.map(p => getProductLabel(p)).join(', ')} fra ${farmer.name}`}
                                />
                                <Button
                                    onClick={() => toggleFavorite(farmer.id)}
                                    variant="outline"
                                    className={`flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${
                                        isFavorite(farmer.id) ? "bg-red-100" : ""
                                    }`}
                                >
                                    <Heart className={`h-4 w-4 ${isFavorite(farmer.id) ? "fill-red-500 text-red-500" : ""}`} />
                                    {isFavorite(farmer.id) ? "Favoritt" : "Lagre"}
                                </Button>
                            </div>
                        </div>

                        <div className="prose prose-lg">
                            <p>{farmer.description}</p>
                        </div>

                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-bold text-xl uppercase">Kontakt / Besøk</h3>

                                {farmer.website && (
                                    <a
                                        href={farmer.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm hover:underline"
                                    >
                                        <Globe className="w-4 h-4" />
                                        {farmer.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </a>
                                )}

                                {farmer.phone && (
                                    <a
                                        href={`tel:${farmer.phone}`}
                                        className="flex items-center gap-2 text-sm hover:underline"
                                    >
                                        <Phone className="w-4 h-4" />
                                        {farmer.phone}
                                    </a>
                                )}

                                <a
                                    href={getDirectionsUrl(farmer)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="w-full font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 bg-primary text-black hover:bg-primary/90" size="lg">
                                        <Navigation className="w-5 h-5 mr-2" />
                                        Få Veibeskrivelse
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

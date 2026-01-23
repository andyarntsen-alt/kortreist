"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Check, Loader2 } from "lucide-react";
import { useState } from "react";

// BYTT UT MED DIN FORMSPREE ID (fra formspree.io)
const FORMSPREE_ID = "xkojqnoj";

export default function TipsPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        producerName: "",
        products: "",
        location: "",
        website: "",
        yourName: "",
        yourEmail: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "Produsentens navn": formData.producerName,
                    "Produkter": formData.products,
                    "Lokasjon": formData.location,
                    "Nettside": formData.website || "Ikke oppgitt",
                    "Tipserens navn": formData.yourName || "Anonym",
                    "Tipserens e-post": formData.yourEmail || "Ikke oppgitt"
                })
            });

            if (response.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-[#FFD700]/30 border-b-2 border-black py-12">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD700] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <Lightbulb className="h-10 w-10 stroke-[2]" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            Tips Oss!
                        </h1>
                        <p className="text-xl font-mono max-w-2xl mx-auto">
                            Kjenner du en lokal produsent som burde være med? Del tipset med oss!
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-xl mx-auto">
                        {submitted ? (
                            <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#90EE90] border-2 border-black mb-4">
                                    <Check className="h-8 w-8 stroke-[3]" />
                                </div>
                                <h2 className="text-2xl font-black uppercase mb-2">Takk for tipset!</h2>
                                <p className="font-mono text-muted-foreground mb-4">
                                    Vi setter stor pris på at du bidrar til å gjøre Kortreist Mat bedre.
                                    Vi sjekker opp tipset og legger til produsenten hvis den passer.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setFormData({
                                            producerName: "",
                                            products: "",
                                            location: "",
                                            website: "",
                                            yourName: "",
                                            yourEmail: ""
                                        });
                                    }}
                                    variant="outline"
                                    className="border-2 border-black"
                                >
                                    Send et nytt tips
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <h2 className="text-2xl font-black uppercase mb-6">Del ditt tips</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold uppercase mb-2">Produsentens navn *</label>
                                        <Input
                                            required
                                            value={formData.producerName}
                                            onChange={(e) => setFormData({ ...formData, producerName: e.target.value })}
                                            className="border-2 border-black"
                                            placeholder="Navn på gård, butikk eller marked"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase mb-2">Hva selger de? *</label>
                                        <Input
                                            required
                                            value={formData.products}
                                            onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                                            className="border-2 border-black"
                                            placeholder="Egg, honning, grønnsaker, kjøtt..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase mb-2">Hvor holder de til? *</label>
                                        <Input
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="border-2 border-black"
                                            placeholder="By, område eller adresse"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold uppercase mb-2">Nettside / Facebook (valgfritt)</label>
                                        <Input
                                            type="text"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="border-2 border-black"
                                            placeholder="Lenke eller navn på Facebook-side"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-black/10">
                                        <p className="text-xs font-mono text-muted-foreground mb-4">
                                            Valgfritt: Legg igjen din kontaktinfo hvis du vil at vi skal kunne kontakte deg.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">Ditt navn</label>
                                                <Input
                                                    value={formData.yourName}
                                                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="Valgfritt"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">Din e-post</label>
                                                <Input
                                                    type="email"
                                                    value={formData.yourEmail}
                                                    onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="Valgfritt"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-12 text-lg font-bold uppercase bg-[#FFD700] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
                                    >
                                        {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Sender...</> : "Send tips"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

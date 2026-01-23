"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tractor, Check, Users, TrendingUp, Heart } from "lucide-react";
import { useState } from "react";

const benefits = [
    {
        icon: Users,
        title: "Nå flere kunder",
        description: "Bli synlig for tusenvis av matinteresserte i Oslo-området."
    },
    {
        icon: TrendingUp,
        title: "Helt gratis",
        description: "Ingen kostnader, ingen provisjon. Vi tar ingenting av salget ditt."
    },
    {
        icon: Heart,
        title: "Støtt bevegelsen",
        description: "Bli en del av fellesskapet som gjør lokal mat tilgjengelig for alle."
    }
];

export default function BondePage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        farmName: "",
        email: "",
        phone: "",
        address: "",
        products: "",
        description: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to an API/email
        console.log("Form submitted:", formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-[#90EE90]/30 border-b-2 border-black py-12">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#90EE90] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <Tractor className="h-10 w-10 stroke-[2]" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            Er du Bonde?
                        </h1>
                        <p className="text-xl font-mono max-w-2xl mx-auto">
                            Bli med i Kortreist Mat og nå nye kunder som ønsker å handle lokalt.
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="container mx-auto px-4 md:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="flex items-start gap-4">
                                <div className="shrink-0 flex items-center justify-center w-12 h-12 bg-primary border-2 border-black">
                                    <benefit.icon className="h-6 w-6 stroke-[2.5]" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase">{benefit.title}</h3>
                                    <p className="text-sm font-mono text-muted-foreground">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-muted/30 border-y-2 border-black py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="max-w-2xl mx-auto">
                            {submitted ? (
                                <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#90EE90] border-2 border-black mb-4">
                                        <Check className="h-8 w-8 stroke-[3]" />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase mb-2">Takk for din interesse!</h2>
                                    <p className="font-mono text-muted-foreground">
                                        Vi har mottatt din henvendelse og tar kontakt så snart som mulig.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <h2 className="text-2xl font-black uppercase mb-6">Registrer din gård</h2>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">Ditt navn *</label>
                                                <Input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="Ola Nordmann"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">Gård/Bedrift *</label>
                                                <Input
                                                    required
                                                    value={formData.farmName}
                                                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="Nordmanns Gård"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">E-post *</label>
                                                <Input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="ola@gard.no"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold uppercase mb-2">Telefon</label>
                                                <Input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="border-2 border-black"
                                                    placeholder="999 99 999"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold uppercase mb-2">Adresse *</label>
                                            <Input
                                                required
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="border-2 border-black"
                                                placeholder="Gårdsveien 1, 1234 Sted"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold uppercase mb-2">Hva selger du? *</label>
                                            <Input
                                                required
                                                value={formData.products}
                                                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                                                className="border-2 border-black"
                                                placeholder="Egg, honning, grønnsaker, kjøtt..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold uppercase mb-2">Kort beskrivelse</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full min-h-[100px] p-3 border-2 border-black font-mono text-sm"
                                                placeholder="Fortell litt om gården din og hva som gjør produktene dine spesielle..."
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-bold uppercase bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-0.5 hover:translate-y-0.5"
                                        >
                                            Send inn
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

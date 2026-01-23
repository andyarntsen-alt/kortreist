import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Heart, Leaf, Users, HelpCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        q: "Hva er Kortreist Mat?",
        a: "Kortreist Mat er en uavhengig, gratis tjeneste som hjelper deg å finne lokale matprodusenter i Oslo-området. Vi samler informasjon om gårdsbutikker, bønder og markeder som selger direkte til forbruker."
    },
    {
        q: "Koster det noe å bruke tjenesten?",
        a: "Nei, Kortreist Mat er helt gratis å bruke - både for forbrukere og produsenter. Vi tror på åpen tilgang til informasjon om lokal mat."
    },
    {
        q: "Hvordan kan jeg legge til en produsent?",
        a: "Bruk 'Tips oss'-funksjonen for å foreslå en produsent du kjenner til, eller 'Er du bonde?'-skjemaet hvis du selv er produsent."
    },
    {
        q: "Hvem står bak Kortreist Mat?",
        a: "Kortreist Mat er et uavhengig prosjekt drevet av matentusiaster som ønsker å gjøre det enklere å handle lokalt og støtte norske bønder."
    }
];

export default function OmOssPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <div className="bg-primary/10 border-b-2 border-black py-16">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <MapPin className="h-10 w-10 stroke-[2.5]" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase mb-4">
                            Om Kortreist Mat
                        </h1>
                        <p className="text-xl md:text-2xl font-mono max-w-3xl mx-auto">
                            Vi kobler deg med lokale matprodusenter - direkte fra bonden til ditt kjøkken.
                        </p>
                    </div>
                </div>

                {/* Mission */}
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-black uppercase mb-6">Vår Misjon</h2>
                        <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p className="text-lg font-mono mb-6">
                                I en tid der matprisene stiger og dagligvarekjedene tar stadig større marginer,
                                finnes det et alternativ: <strong>handle direkte fra produsenten</strong>.
                            </p>
                            <p className="text-lg font-mono mb-6">
                                Kortreist Mat er en uavhengig guide som samler informasjon om lokale matprodusenter
                                i Oslo-området. Vi hjelper deg å finne bønder, gårdsbutikker og markeder som selger
                                ferske, lokale produkter - uten mellomledd.
                            </p>
                            <p className="text-lg font-mono">
                                Når du handler kortreist, får du <strong>bedre mat til bedre pris</strong>,
                                samtidig som du støtter lokale bønder og reduserer miljøavtrykket.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why Local */}
                <div className="bg-muted/30 border-y-2 border-black py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl font-black uppercase mb-8 text-center">Hvorfor Kortreist?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#90EE90] border-2 border-black mb-4">
                                    <Heart className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-2">Støtt Lokalt</h3>
                                <p className="font-mono text-sm text-muted-foreground">
                                    Pengene dine går direkte til bonden, ikke til mellommenn og kjeder.
                                    Du bygger relasjoner med de som produserer maten din.
                                </p>
                            </div>
                            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FFD700] border-2 border-black mb-4">
                                    <Leaf className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-2">Bedre for Miljøet</h3>
                                <p className="font-mono text-sm text-muted-foreground">
                                    Kortere transportveier betyr lavere klimaavtrykk.
                                    Mange lokale produsenter driver økologisk eller bærekraftig.
                                </p>
                            </div>
                            <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FF90E8] border-2 border-black mb-4">
                                    <Users className="h-7 w-7 stroke-[2.5]" />
                                </div>
                                <h3 className="text-xl font-black uppercase mb-2">Fersk Kvalitet</h3>
                                <p className="font-mono text-sm text-muted-foreground">
                                    Mat som er høstet samme dag smaker bedre og har høyere næringsverdi.
                                    Du vet hvor maten kommer fra.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="container mx-auto px-4 md:px-6 py-16">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="h-8 w-8" />
                            <h2 className="text-3xl font-black uppercase">Ofte Stilte Spørsmål</h2>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white border-2 border-black p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                                    <h3 className="font-black text-lg mb-2">{faq.q}</h3>
                                    <p className="font-mono text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-black text-white py-12">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-2xl md:text-3xl font-black uppercase mb-4">
                            Klar til å handle lokalt?
                        </h2>
                        <p className="font-mono mb-6 text-white/80">
                            Finn produsenter nær deg og støtt lokale bønder i dag.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-primary text-black font-bold uppercase px-8 py-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        >
                            Utforsk Produsenter
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

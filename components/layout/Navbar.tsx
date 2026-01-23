import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-primary text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <MapPin className="h-6 w-6 stroke-[3]" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tighter italic">Kortreist</span>
                </Link>
                <nav className="hidden gap-8 md:flex">
                    <Link href="/" className="text-base font-bold uppercase hover:underline decoration-2 underline-offset-4">
                        Utforsk
                    </Link>
                    <Link href="/kategorier" className="text-base font-bold uppercase hover:underline decoration-2 underline-offset-4">
                        Kategorier
                    </Link>
                    <Link href="/om" className="text-base font-bold uppercase hover:underline decoration-2 underline-offset-4">
                        Om oss
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/bonde">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex uppercase">
                            Er du bonde?
                        </Button>
                    </Link>
                    <Link href="/tips">
                        <Button size="sm" variant="accent">Tips oss!</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

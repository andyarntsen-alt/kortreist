import { MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t-2 border-black bg-secondary">
            {/* Marquee-like strip */}
            <div className="w-full bg-accent border-b-2 border-black py-1.5 md:py-2 overflow-hidden">
                <div className="whitespace-nowrap font-bold uppercase tracking-widest text-xs md:text-sm animate-marquee">
                    STØTT LOKALT *** KJØP FERSKT *** FRA JORD TIL BORD *** ØKOLOGISK MAT *** STØTT LOKALT *** KJØP FERSKT *** FRA JORD TIL BORD *** ØKOLOGISK MAT ***
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 md:px-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 stroke-[3]" />
                            </div>
                            <p className="text-base md:text-lg font-black uppercase">Kortreist</p>
                        </div>
                        <p className="max-w-xs text-xs md:text-sm font-medium border-l-4 border-black pl-3 md:pl-4">
                            Samler regionens beste råvarer for deg. Ikke noe mer smakløs butikkmat.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:gap-16 font-bold uppercase text-xs md:text-sm">
                        <div className="flex flex-col gap-2">
                            <Link href="/om" className="hover:bg-white hover:text-black inline-block px-1 py-0.5 transition-colors touch-manipulation">Om oss</Link>
                            <Link href="/kategorier" className="hover:bg-white hover:text-black inline-block px-1 py-0.5 transition-colors touch-manipulation">Kategorier</Link>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link href="/bonde" className="hover:bg-white hover:text-black inline-block px-1 py-0.5 transition-colors touch-manipulation">Er du bonde?</Link>
                            <Link href="/tips" className="hover:bg-white hover:text-black inline-block px-1 py-0.5 transition-colors touch-manipulation">Tips oss</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t-2 border-black border-dashed flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-bold uppercase safe-bottom">
                    <span>&copy; {new Date().getFullYear()} Kortreist Mat</span>
                    <span className="text-center">Laget med ♥ for god mat</span>
                </div>
            </div>
        </footer>
    );
}

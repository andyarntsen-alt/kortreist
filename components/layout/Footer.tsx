import { MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t-2 border-black bg-secondary">
            {/* Marquee-like strip */}
            <div className="w-full bg-accent border-b-2 border-black py-2 overflow-hidden">
                <div className="whitespace-nowrap font-bold uppercase tracking-widest text-sm animate-marquee">
                    STØTT LOKALT *** KJØP FERSKT *** FRA JORD TIL BORD *** ØKOLOGISK MAT ***
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <MapPin className="h-4 w-4 stroke-[3]" />
                            </div>
                            <p className="text-lg font-black uppercase">LokalMat</p>
                        </div>
                        <p className="max-w-xs text-sm font-medium border-l-4 border-black pl-4">
                            Samler regionens beste råvarer for deg. <br />
                            Ikke noe mer smakløs butikkmat.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:gap-16 font-bold uppercase text-sm">
                        <div className="flex flex-col gap-2">
                            <a href="#" className="hover:bg-white hover:text-black inline-block px-1 transition-colors">Personvern</a>
                            <a href="#" className="hover:bg-white hover:text-black inline-block px-1 transition-colors">Vilkår</a>
                        </div>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="hover:bg-white hover:text-black inline-block px-1 transition-colors">Kontakt</a>
                            <a href="#" className="hover:bg-white hover:text-black inline-block px-1 transition-colors">Om oss</a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-black border-dashed flex justify-between items-center text-xs font-bold uppercase">
                    <span>&copy; {new Date().getFullYear()} LokalMat</span>
                    <span>Laget med &hearts; for god mat</span>
                </div>
            </div>
        </footer>
    );
}

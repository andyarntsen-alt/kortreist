"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Scroll to top when clicking logo on homepage
    const handleLogoClick = (e: React.MouseEvent) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Close menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-background">
                <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
                    <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
                        <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            <Image src="/logo.svg" alt="Kortreist Mat" width={40} height={40} className="w-full h-full" />
                        </div>
                        <span className="text-lg md:text-xl font-black uppercase tracking-tighter italic">Kortreist</span>
                    </Link>

                    {/* Desktop Navigation */}
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

                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/bonde" className="hidden sm:block">
                            <Button variant="ghost" size="sm" className="uppercase text-xs md:text-sm">
                                Er du bonde?
                            </Button>
                        </Link>
                        <Link href="/tips" className="hidden sm:block">
                            <Button size="sm" variant="accent" className="text-xs md:text-sm">Tips oss!</Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                            aria-label="Meny"
                        >
                            {isMenuOpen ? (
                                <X className="h-5 w-5 stroke-[2.5]" />
                            ) : (
                                <Menu className="h-5 w-5 stroke-[2.5]" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-14 right-0 bottom-0 w-[280px] bg-background border-l-2 border-black z-50 transform transition-transform duration-300 ease-out md:hidden ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <nav className="flex flex-col p-6 gap-2">
                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-black uppercase py-3 px-4 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                        Utforsk
                    </Link>
                    <Link
                        href="/kategorier"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-black uppercase py-3 px-4 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                        Kategorier
                    </Link>
                    <Link
                        href="/om"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-black uppercase py-3 px-4 border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                        Om oss
                    </Link>

                    <div className="border-t-2 border-black border-dashed my-4" />

                    <Link
                        href="/bonde"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-black uppercase py-3 px-4 border-2 border-black bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                        Er du bonde?
                    </Link>
                    <Link
                        href="/tips"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-black uppercase py-3 px-4 border-2 border-black bg-accent shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                        Tips oss!
                    </Link>
                </nav>
            </div>
        </>
    );
}

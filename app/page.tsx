"use client";

import { HeroSection } from "@/components/features/HeroSection";
import { WhySection } from "@/components/features/WhySection";
import { StatsBanner } from "@/components/features/StatsBanner";
import { AboutSection } from "@/components/features/AboutSection";
import { FilterSidebar } from "@/components/features/FilterSidebar";
import { ActivityGrid } from "@/components/features/ActivityGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { FilterState, Farmer, ProductType, Location } from "@/types";
import rawData from "@/data/farmers.json";
import { searchAndFilter } from "@/lib/search";
import { sortByDistance } from "@/lib/geo";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { useDebouncedCallback } from "use-debounce";
import { getProductLabel } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const initialFilters: FilterState = {
  products: []
};

function HomeContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") as ProductType | null;

  const [filters, setFilters] = useState<FilterState>(() => ({
    products: filterParam ? [filterParam] : []
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [farmers, setFarmers] = useState<Farmer[]>(rawData.farmers as Farmer[]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { location: geoLocation, loading: isLocating, error: geoError, requestLocation } = useGeolocation();

  // Update user location when geolocation succeeds
  useEffect(() => {
    if (geoLocation) {
      setUserLocation(geoLocation);
    }
  }, [geoLocation]);

  // Handle filter from URL parameter
  useEffect(() => {
    if (filterParam) {
      setFilters({ products: [filterParam] });
      setTimeout(() => {
        const el = document.getElementById("aktiviteter");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [filterParam]);

  // Prevent body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  // Debounced search - reduced to 150ms for snappier feel
  const handleSearchChange = useDebouncedCallback((query: string) => {
    setDebouncedQuery(query);
  }, 150);

  const onSearchInputChange = useCallback((query: string) => {
    setSearchQuery(query);
    handleSearchChange(query);
  }, [handleSearchChange]);

  // Handle category toggle
  const handleCategoryClick = useCallback((categoryId: ProductType) => {
    setFilters(prev => {
      const isActive = prev.products.includes(categoryId);
      return {
        ...prev,
        products: isActive
          ? prev.products.filter(p => p !== categoryId)
          : [...prev.products, categoryId]
      };
    });
  }, []);

  // Fetch additional farmers from API in background (non-blocking)
  useEffect(() => {
    async function fetchMoreFarmers() {
      try {
        const res = await fetch('/api/farmers');
        if (!res.ok) return;
        const data = await res.json();

        if (data.farmers && data.farmers.length > 0) {
          const apiIds = new Set(data.farmers.map((f: Farmer) => f.id));
          const localFarmers = (rawData.farmers as Farmer[]).filter(f => !apiIds.has(f.id));
          setFarmers([...data.farmers, ...localFarmers]);
        }
      } catch {
        // Silently fail - we already have local data
      } finally {
        setIsLoadingMore(false);
      }
    }

    fetchMoreFarmers();
  }, []);

  // Memoize filtered and sorted farmers
  const filteredFarmers = useMemo(() => {
    let results = searchAndFilter(farmers, debouncedQuery, filters.products);
    if (userLocation) {
      results = sortByDistance(results, userLocation);
    }
    return results;
  }, [farmers, filters, debouncedQuery, userLocation]);

  const activeFilterCount = filters.products.length + (debouncedQuery ? 1 : 0) + (userLocation ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={onSearchInputChange}
          onCategoryClick={handleCategoryClick}
          activeCategories={filters.products}
          onFindNearMe={requestLocation}
          isLocating={isLocating}
          farmers={farmers}
        />

        {geoError && (
          <div className="container mx-auto px-4 md:px-6 py-2">
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded text-sm">
              {geoError}
            </div>
          </div>
        )}

        <StatsBanner farmerCount={farmers.length} />

        <WhySection />

        <AboutSection />

        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          {/* Search Results Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl md:text-2xl font-black uppercase">
              {debouncedQuery || filters.products.length > 0 || userLocation
                ? "Søkeresultater"
                : "Finn Produsenter"
              }
            </h2>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm font-bold border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters - Mobile scrollable */}
          {(debouncedQuery || filters.products.length > 0 || userLocation) && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap mb-4">
              {debouncedQuery && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full text-sm">
                  Søk: &quot;{debouncedQuery}&quot;
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setDebouncedQuery("");
                    }}
                    className="ml-1 hover:text-red-500 touch-manipulation"
                  >
                    ×
                  </button>
                </span>
              )}
              {userLocation && (
                <span className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-full text-sm text-blue-700">
                  📍 Nær deg
                </span>
              )}
              {filters.products.map(product => (
                <span
                  key={product}
                  className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm"
                >
                  {getProductLabel(product)}
                  <button
                    onClick={() => handleCategoryClick(product)}
                    className="ml-1 hover:text-red-500 touch-manipulation"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-20">
                <h3 className="text-lg font-bold mb-4">Filtrer Resultater</h3>
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-xs md:text-sm font-mono text-muted-foreground">
                  {filteredFarmers.length} produsenter funnet
                  {isLoadingMore && (
                    <span className="ml-2 text-primary animate-pulse">• Laster flere...</span>
                  )}
                </span>
              </div>

              {/* Producer List */}
              <section id="aktiviteter">
                {filteredFarmers.length === 0 ? (
                  <div className="text-center py-8 md:py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <p className="text-lg md:text-xl font-bold text-gray-500 mb-2">Ingen resultater</p>
                    <p className="text-sm md:text-base text-gray-400">
                      Prøv å fjerne noen filtre eller søk etter noe annet
                    </p>
                  </div>
                ) : (
                  <ActivityGrid activities={filteredFarmers} isLoadingMore={isLoadingMore} />
                )}
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Bottom Sheet */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background border-t-2 border-black z-50 transform transition-transform duration-300 ease-out lg:hidden rounded-t-2xl max-h-[70vh] overflow-y-auto ${
          isMobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4 pb-8">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            onClose={() => setIsMobileFilterOpen(false)}
          />
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="w-full mt-4 py-3 text-base font-bold border-2 border-black bg-primary shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 touch-manipulation"
          >
            Vis {filteredFarmers.length} resultater
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

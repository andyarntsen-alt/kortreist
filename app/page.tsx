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
  // Start with local data immediately for instant loading
  const [farmers, setFarmers] = useState<Farmer[]>(rawData.farmers as Farmer[]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(true); // Loading additional data

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
      // Scroll to results after a short delay
      setTimeout(() => {
        const el = document.getElementById("aktiviteter");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, [filterParam]);

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
          // Merge API data with local data
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
    // Apply search and product filters
    let results = searchAndFilter(farmers, debouncedQuery, filters.products);

    // If user has location, add distance and sort by it
    if (userLocation) {
      results = sortByDistance(results, userLocation);
    }

    return results;
  }, [farmers, filters, debouncedQuery, userLocation]);

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
            <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded">
              {geoError}
            </div>
          </div>
        )}

        <StatsBanner farmerCount={farmers.length} />

        <WhySection />

        <AboutSection />

        <div className="container mx-auto px-4 md:px-6 py-6">
          {/* Search Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-2xl font-black uppercase text-center md:text-left">
              {debouncedQuery || filters.products.length > 0 || userLocation
                ? "Søkeresultater"
                : "Finn Produsenter"
              }
            </h2>

            {/* Active Filters */}
            {(debouncedQuery || filters.products.length > 0 || userLocation) && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {debouncedQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm">
                    Søk: &quot;{debouncedQuery}&quot;
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setDebouncedQuery("");
                      }}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
                {userLocation && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 border border-blue-300 rounded-full text-sm text-blue-700">
                    📍 Nær deg
                  </span>
                )}
                {filters.products.map(product => (
                  <span
                    key={product}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm"
                  >
                    {getProductLabel(product)}
                    <button
                      onClick={() => handleCategoryClick(product)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-bold mb-6">Filtrer Resultater</h2>
                <FilterSidebar filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-muted-foreground">
                  {filteredFarmers.length} produsenter funnet
                  {isLoadingMore && (
                    <span className="ml-2 text-primary animate-pulse">• Laster flere...</span>
                  )}
                </span>
              </div>

              {/* Producer List */}
              <section id="aktiviteter">
                {filteredFarmers.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                    <p className="text-xl font-bold text-gray-500 mb-2">Ingen resultater</p>
                    <p className="text-gray-400">
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

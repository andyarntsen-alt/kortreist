"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "kortreist-favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed);
                }
            }
        } catch {
            // Ignore localStorage errors
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when favorites change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            } catch {
                // Ignore localStorage errors
            }
        }
    }, [favorites, isLoaded]);

    const addFavorite = useCallback((id: string) => {
        setFavorites(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavorites(prev => prev.filter(f => f !== id));
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites(prev => {
            if (prev.includes(id)) {
                return prev.filter(f => f !== id);
            }
            return [...prev, id];
        });
    }, []);

    const isFavorite = useCallback((id: string) => {
        return favorites.includes(id);
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
        isLoaded,
    };
}

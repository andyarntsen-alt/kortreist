"use client";

import { useState, useCallback } from "react";
import { Location } from "@/types";

interface GeolocationState {
    location: Location | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        loading: false,
    });

    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: "Geolokalisering støttes ikke av nettleseren din",
                loading: false,
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                let errorMessage = "Kunne ikke hente posisjonen din";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Du må gi tillatelse til å dele posisjonen din";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Posisjonen din er ikke tilgjengelig";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Det tok for lang tid å hente posisjonen";
                        break;
                }

                setState({
                    location: null,
                    error: errorMessage,
                    loading: false,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    }, []);

    const clearLocation = useCallback(() => {
        setState({
            location: null,
            error: null,
            loading: false,
        });
    }, []);

    return {
        ...state,
        requestLocation,
        clearLocation,
    };
}

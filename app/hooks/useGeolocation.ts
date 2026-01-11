'use client';

import { useState, useEffect } from 'react';
interface Position {
    latitude: number;
    longitude: number;
}

export function useGeolocation() {
    const [position, setPosition] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => setPosition({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            }),
            (err) => setError(err.message)
        );
    }, []);

    return { position, error };
}
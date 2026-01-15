'use client';

import { JSX, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/src/components/custom-button';
import { getHaversineDistance } from '@/lib/haversine';
import { useGeolocation } from '@/hooks/useGeolocation';

const MapContent = dynamic(() => import('@/src/components/map-content').then(mod => ({ default: mod.MapContent })), {
    ssr: false,
    loading: () => <div className="w-full h-screen bg-gray-200 animate-pulse" />
});

function formatWalkingTime(distanceKm: number): JSX.Element {
    const minutes = Math.round((distanceKm / 5) * 60);
    
    if (minutes < 60) {
        return <><span className="text-2xl">{minutes}</span> minuti</>;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return <><span className="text-2xl">{hours}</span>ore <span className="text-2xl">{mins}</span>minuti</>;
}

export default function MapPage({ params }: { params: Promise<{ id: string }> }) {
    const loc = useGeolocation();
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [activityData, setActivityData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const { id } = await params;
                setId(id);
                const activityDoc = await getDoc(doc(db, 'Activity', id));
                const data = activityDoc.exists() ? activityDoc.data() : null;
                if(data !== null)
                    setActivityData(data["Position"]);
                setError(null);
            } catch (err: any) {
                console.error('MapPage: Failed to fetch activity:', err);
                setError(err.message ?? 'Failed to load activity');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [params]);

    console.log('MapPage: rendering MapContent');
    
    const remainingDistance = activityData && loc.position 
        ? getHaversineDistance(activityData, {
            latitude: loc.position.latitude,
            longitude: loc.position.longitude
        })
        : 0;
    //const remainingDistance = 0.1;
    const walkingTime = formatWalkingTime(remainingDistance);
    
    return (
        <div className="w-full h-screen flex flex-col">
            <MapContent activityData={activityData} className='max-h-1/2'/>
            <div className="flex flex-col p-4 text-black justify-center items-center align-middle">
                {
                    remainingDistance <= 0.2 ? (
                        <>
                            <span className="text-lg">Sei vicino!</span>
                            <Button className="text-xl bold mt-10" href={"/complete/" + id}>Vai al quiz</Button>
                        </>
                    ) : (
                        <>
                            <span className="mt-10 text-lg">{walkingTime}</span>
                            <span className="text-lg">Distanza rimanente: <span className="text-2xl">{remainingDistance.toFixed(0)}</span> KM</span>
                            <Button className="text-xl bold mt-10" onClick={() => router.back()}>Interrompi percorso</Button>
                        </>
                    )
                }
            </div>
        </div>
    );
}
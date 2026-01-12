import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const MapContent = dynamic(() => import('@/src/components/map-content').then(mod => ({ default: mod.MapContent })), {
    loading: () => <div className="w-full h-screen bg-gray-200 animate-pulse" />
});

export async function generateStaticParams() {
    const activitiesSnapshot = await getDocs(collection(db, 'Activity'));
    
    return activitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
    }));
}

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const activityDoc = await getDoc(doc(db, 'Activity', id));
    const activityData = activityDoc.exists() ? activityDoc.data() : null;

    return <MapContent activityData={activityData} />;
}
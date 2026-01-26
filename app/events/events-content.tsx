'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { OrganizedSessionData } from '@/models/organized-session';
import OrganizedSessionCard from '@/components/organized-session-card';
import OrganizedSessionCardSkeleton from '@/components/organized-session-card-skeleton';

export default function EventsContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  
  const [events, setEvents] = useState<OrganizedSessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const MIN_SKELETON_MS = 500;
      const startTime = Date.now();
      try {
        const now = Timestamp.now();
        const eventsRef = collection(db, 'OrganizedSession');
        
        // Build query with optional activity filter
        const queryConstraints = [where('Datetime', '>', now)];
        
        if (activityId) {
          const activityRef = doc(db, 'Activity', activityId);
          queryConstraints.push(where('Activity', '==', activityRef));
        }
        
        const q = query(eventsRef, ...queryConstraints);
        
        const querySnapshot = await getDocs(q);
        const eventsData: OrganizedSessionData[] = [];
        
        querySnapshot.forEach((doc) => {
          eventsData.push({
            id: doc.id,
            ...doc.data(),
          } as OrganizedSessionData);
        });

        // Sort by date ascending (earliest first)
        eventsData.sort((a, b) => {
          const dateA = a.Datetime.toDate();
          const dateB = b.Datetime.toDate();
          return dateA.getTime() - dateB.getTime();
        });

        setEvents(eventsData);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_SKELETON_MS - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [activityId]);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <OrganizedSessionCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Al momento non ci sono eventi disponibili. Riprova più tardi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <OrganizedSessionCard key={event.id} session={event} />
          ))}
        </div>
      )}
    </main>
  );
}

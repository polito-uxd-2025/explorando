'use client';

import { Suspense } from 'react';
import EventsContent from './events-content';
import OrganizedSessionCardSkeleton from '@/components/organized-session-card-skeleton';

export default function EventPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <OrganizedSessionCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}

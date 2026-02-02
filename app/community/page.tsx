'use client';

import { FeedData, getFeedByUserRef } from '@/models/feed';
import { getCurrentUser, getUserData, UserData } from '@/models/user';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getActivityById, getActivityByRef } from '@/models/activity';
import Feed from '@/components/feed';
import { FeedSkeleton } from '@/components/feed-skeleton';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface EnrichedFeedData {
  feedItem: FeedData;
  user: UserData;
  activity: any;
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enrichedFeed, setEnrichedFeed] = useState<EnrichedFeedData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<UserData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUserData(currentUser);

        if (currentUser) {
          try {
            // Always include current user's feed
            const selfFeedPromise = getFeedByUserRef(doc(db, 'User', currentUser.id));

            // Fetch friend feeds (if any) in parallel
            const friendFeedPromises = (currentUser.Friends || []).map((friendRef) =>
              getFeedByUserRef(friendRef)
            );

            const allFeedArrays = await Promise.all([selfFeedPromise, ...friendFeedPromises]);

            // Flatten all feed arrays into one
            const allFeed = allFeedArrays.flat();

            // Sort by datetime descending
            allFeed.sort((a, b) => {
              const timeA = a.Datetime.toMillis?.() ?? 0;
              const timeB = b.Datetime.toMillis?.() ?? 0;
              return timeB - timeA;
            });

            // Fetch user and activity data for each feed item
            const enrichedData = await Promise.all(
              allFeed.map(async (feedItem) => {
                const feedUser = await getUserData(feedItem.User.id);
                const feedActivity = await getActivityByRef(feedItem.Activity);
                return {
                  feedItem,
                  user: feedUser,
                  activity: feedActivity,
                };
              })
            );

            setEnrichedFeed(enrichedData);
          } catch (err: any) {
            console.error('Failed to fetch feeds:', err);
            setError(err.message || 'Failed to fetch feeds');
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch user:', err);
        setError(err.message || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    setSearchError(null);
    setSearchResult(null);

    if (!trimmed) {
      setSearchError('Inserisci un username');
      return;
    }

    try {
      setSearching(true);
      const foundUser = await getUserData(trimmed, true);
      setSearchResult(foundUser);
    } catch (err: any) {
      setSearchError(err.message || 'Utente non trovato');
    } finally {
      setSearching(false);
    }
  };

  const renderSearchBar = () => (
    <form onSubmit={handleSearch} className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Cerca username"
          className="flex-1 bg-transparent text-sm text-black placeholder:text-zinc-400 focus:outline-none"
          aria-label="Cerca username"
        />
        <button
          type="submit"
          disabled={searching}
          aria-label="Cerca"
          className="rounded-lg bg-zinc-900 px-2.5 py-2 text-white disabled:opacity-50"
        >
          <FiSearch size={16} />
        </button>
      </div>

      {searchError && (
        <p className="mt-2 text-sm text-red-500">{searchError}</p>
      )}

      {searchResult && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">
              {searchResult.DisplayName || searchResult.Username}
            </span>
            <span className="text-xs text-zinc-500">@{searchResult.Username}</span>
          </div>
          <Link
            href={`/profile/${searchResult.Username}`}
            className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white"
          >
            Vai al profilo
          </Link>
        </div>
      )}
    </form>
  );

  if (loading) {
    return (
      <div className="flex w-full flex-col h-full text-black bg-zinc-50">
        {renderSearchBar()}
        {[...Array(5)].map((_, i) => (
          <FeedSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col h-full text-black">
      {renderSearchBar()}
      {error && <p className="text-red-500">{error}</p>}
      {enrichedFeed.length > 0 ? (
        enrichedFeed.map((item) => (
          <Feed
            key={item.feedItem.id}
            Date={item.feedItem.Datetime}
            Username={item.user.Username}
            UserAvatar={item.user.Avatar ? item.user.Avatar[1] : '/default-avatar.png'}
            FeedIcon={item.activity.Imgsrc}
            FeedTitle={item.activity.Title}
            FeedContext="ha completato"
            FeedContent={item.feedItem.Comment}
            ActivityId={item.activity.id}
          />
        ))
      ) : (
        <div className="flex items-center justify-center p-8 text-gray-500">
          Nessun contenuto nel feed
        </div>
      )}
    </div>
  );
}

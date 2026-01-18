'use client';

import { useState, useEffect } from 'react';
import { addFriend, removeFriend, isFriend } from '@/models/user';

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const checkFriendship = async () => {
      try {
        const result = await isFriend(targetUserId);
        setIsFollowing(result);
      } catch (error) {
        console.error('Failed to check friendship status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFriendship();
  }, [targetUserId]);

  const handleToggleFollow = async () => {
    setUpdating(true);
    try {
      if (isFollowing) {
        await removeFriend(targetUserId);
        setIsFollowing(false);
      } else {
        await addFriend(targetUserId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to update friendship:', error);
      alert('Errore durante l\'aggiornamento');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-400 font-semibold"
      >
        ...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={updating}
      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-accent-500 text-white hover:bg-accent-600'
      } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isFollowing ? 'Segui già' : 'Segui'}
    </button>
  );
}

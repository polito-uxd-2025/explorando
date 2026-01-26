'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

interface HeaderContentProps {
  pathname: string;
  currentUserId: string | null;
  onBackClick: () => void;
  showBack: boolean;
  setShowBack: (show: boolean) => void;
}

export function HeaderContent({ pathname, currentUserId, onBackClick, showBack, setShowBack }: HeaderContentProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show back icon except for root, community, me, and the current user's profile
    const isRoot = pathname === "/";
    const isCommunity = pathname === "/community";
    const isMe = pathname === "/me";
    const isEvents = pathname === "/events" && searchParams.get("id") === null;
    const isProfile = pathname.startsWith("/profile/");
    let shouldShowBack = !(isRoot || isCommunity || isMe || isEvents);
    if (isProfile) {
      const parts = pathname.split("/");
      const profileId = parts.length >= 3 ? parts[2] : null;
      console.log(profileId, currentUserId);
      if (profileId && currentUserId && profileId === currentUserId) shouldShowBack = false;
    }

    setShowBack(shouldShowBack);
  }, [pathname, currentUserId, searchParams, setShowBack]);

  return null; // This component only manages state
}

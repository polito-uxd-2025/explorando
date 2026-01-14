'use client';

import Link from 'next/link';
import Image from 'next/image';
import { use, useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { levelFromXp } from '@/lib/level';
import Feed from '@/src/components/feed';

interface UserData {
  username: string;
  id: string;
  [key: string]: any;
}

interface BadgeData {
  id: string;
  Name: string;
  Image: string;
}

interface FeedItemData {
  id: string;
  Activity: any;
  Comment: string;
  Datetime: any;
  User: any;
}

interface FeedItemData {
  id: string;
  Activity: any;
  Comment: string;
  Datetime: any;
  User: any;
}

export default function Profile({ params }: { params: Promise<{ username: string }> }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItemData[]>([]);

  useEffect(() => {
      const fetchUserData = async () => {
          try {
              const { username } = await params;

              // Query the User collection by username field
              const q = query(collection(db, 'User'), where('Username', '==', username));
              const snapshot = await getDocs(q);

              if (snapshot.empty) {
                  setError(`User "${username}" not found`);
                  return;
              }

              // Get the first (and should be only) document
              const userDoc = snapshot.docs[0];
              const userData = {
                  id: userDoc.id,
                  ...userDoc.data()
              } as UserData;
              setUserData(userData);

              // Fetch badge data if user has badges (DocumentReferences)
              if (userData["Badges"] && userData["Badges"].length > 0) {
                  const badgePromises = userData["Badges"].map((badgeRef: any) =>
                      getDoc(badgeRef)
                  );
                  const badgeDocs = await Promise.all(badgePromises);
                  const badgesData = badgeDocs
                      .filter(doc => doc.exists())
                      .map(doc => ({
                          id: doc.id,
                          ...doc.data()
                      } as BadgeData));
                  setBadges(badgesData);
              }

              // Fetch feed items for this user
              const feedQuery = query(
                  collection(db, 'Feed'),
                  where('User', '==', userDoc.ref),
                  orderBy('Datetime', 'desc')
              );
              const feedSnapshot = await getDocs(feedQuery);
              
              // Fetch the full data for each feed item (including User and Activity references)
              const feedDataPromises = feedSnapshot.docs.map(async (feedDoc) => {
                  const feedData = feedDoc.data();
                  
                  // Fetch the User document
                  const userDocData = feedData.User ? await getDoc(feedData.User) : null;
                  const userInfo = userDocData?.exists() ? userDocData.data() : null;
                  
                  // Fetch the Activity document
                  const activityDocData = feedData.Activity ? await getDoc(feedData.Activity) : null;
                  const activityInfo = activityDocData?.exists() ? activityDocData.data() : null;
                  
                  return {
                      id: feedDoc.id,
                      ...feedData,
                      User: userInfo,
                      Activity: activityInfo
                  } as FeedItemData;
              });
              
              const feedData = await Promise.all(feedDataPromises);
              setFeedItems(feedData);

          } catch (err: any) {
              console.error('ProfilePage: Failed to fetch user data:', err);
              setError(err.message || 'Failed to fetch user data');
          } finally {
              setLoading(false);
          }
      };

      fetchUserData();
  }, [params]);

  console.log(badges);

  return (
    <div className="flex h-full bg-white font-sans flex-col">     
      {userData && (
        <div className="flex flex-col w-full text-black">
          <div className="flex flex-row p-4">
            {userData["Avatar"] && userData["Avatar"][1] && (
              <Image 
                src={userData["Avatar"][1]} 
                alt="Avatar" 
                width={100} 
                height={100} 
                className="rounded-full m-4" 
              />
            )}
            <div className="flex flex-col flex-1">
              <div className="flex flex-row p-5 pl-1 pb-1">
                <div className="flex flex-col text-2xl">
                  <div>{userData["DisplayName"]}</div>
                  <div className="text-gray-600">{userData["Username"]}</div>
                </div>
                <div className="text-4xl pl-2">{levelFromXp(userData["XP"])}</div>
              </div>
              {badges && badges.length > 0 && (
                <div className="flex flex-row gap-4 flex-wrap">
                  {badges.map((badge: BadgeData) => (
                    <div key={badge.id} className="flex flex-col items-center">
                      <Image
                        src={badge.Image}
                        alt={badge.Name || "Badge"}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="bg-black w-full h-1"></div>
      <div className="flex flex-col">
        {
          feedItems.length > 0 ? (
              feedItems.map((item: FeedItemData) => {
                return <Feed 
                  key={item.id}
                  Date={item.Datetime}
                  Username={item.User["Username"]}
                  UserAvatar={item.User["Avatar"] ? item.User["Avatar"][1] : '/default-avatar.png'}
                  FeedIcon={item.Activity["Imgsrc"]}
                  FeedTitle={item.Activity["Title"]}
                  FeedContext="ha completato"
                  FeedContent={item.Comment}
                />
              })
          ) : (
            <div className="flex items-center justify-center p-8 text-gray-500">
              No feed items yet
            </div>
          )
        }
      </div>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { FilterButton } from '@/components/filter-button';
import { ShopItem } from '@/components/shop-item';
import { ShopItemSkeleton } from '@/components/shop-item-skeleton';
import { getAllItems, ItemData } from '@/models/item';
import { getCurrentUser, purchaseItem } from '@/models/user';

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ownedIds, setOwnedIds] = useState<Set<string>>(new Set());
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [data, user] = await Promise.all([
          getAllItems(),
          getCurrentUser(),
        ]);
        if (!alive) return;
        setItems(data);
        const userItems = Array.isArray(user.Items)
          ? user.Items.map((ref) => (ref as any)?.id).filter(Boolean)
          : [];
        setOwnedIds(new Set(userItems));
        setPoints(user.Points ?? 0);
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || 'Failed to load items');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => unique.add(item.Category));
    return ['Tutti', ...Array.from(unique)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'Tutti') return items;
    return items.filter((item) => item.Category === activeFilter);
  }, [items, activeFilter]);

  const handlePurchase = async (itemId: string, cost: number) => {
    await purchaseItem(itemId, cost);
    setOwnedIds((prev) => new Set(prev).add(itemId));
    setPoints((p) => Math.max(0, p - cost));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('points:update', { detail: { points } }));
  }, [points]);

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-2 h-full">
        <div className="flex flex-col gap-2 h-full w-full">
          {loading ? (
            <div className="flex flex-row w-full gap-2 p-2 overflow-hidden">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-row w-full gap-2 p-2 overflow-x-scroll">
              {categories.map((category) => (
                <FilterButton
                  key={category}
                  label={category}
                  isActive={activeFilter === category}
                  onClick={() => setActiveFilter(category)}
                />
              ))}
            </div>
          )}
          <div className="flex flex-col p-2 pt-0 h-full overflow-y-scroll">
            {loading && (
              <div className="flex flex-col gap-3">
                {[1,2,3].map((i) => (
                  <ShopItemSkeleton key={i} />
                ))}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {filteredItems.map((item, index) => {
                  const isPurchased = ownedIds.has(item.id);
                  const isAffordable = points >= item.Value;
                  return (
                    <ShopItem
                      key={item.id}
                      id={item.id}
                      name={item.Name}
                      price={item.Value}
                      imageUrl={item.Imgsrc}
                      category={item.Category}
                      isPurchased={isPurchased}
                      isDisabled={!isPurchased && !isAffordable}
                      disabledLabel={!isAffordable ? 'Fondi insufficienti' : undefined}
                      onClick={() => handlePurchase(item.id, item.Value)}
                      index={index}
                    />
                  );
                })}
                {filteredItems.length === 0 && (
                  <div className="text-sm text-gray-500">Nessun elemento trovato.</div>
                )}
              </div>
            )}
          </div>
        </div>
    </main>
  );
}

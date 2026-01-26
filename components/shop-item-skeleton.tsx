'use client';

export const ShopItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-row bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 h-32 animate-pulse">
      <div className="w-32 h-32 bg-gray-200" />
      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-2">
          <div className="w-20 h-3 bg-gray-200 rounded" />
          <div className="w-40 h-4 bg-gray-300 rounded" />
        </div>
        <div className="w-full h-12 rounded bg-gradient-to-r from-gray-200 to-gray-300" />
      </div>
    </div>
  );
};

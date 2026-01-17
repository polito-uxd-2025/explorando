'use client';

import { motion } from "framer-motion";
import { useHaptic } from "react-haptic";
import Image from "next/image";
import { useState } from "react";

interface ShopItemProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  isPurchased?: boolean;
  isDisabled?: boolean;
  disabledLabel?: string;
  onClick?: () => Promise<void> | void;
  index?: number;
}

export const ShopItem: React.FC<ShopItemProps> = ({
  id,
  name,
  price,
  imageUrl,
  category,
  isPurchased = false,
  isDisabled = false,
  disabledLabel,
  onClick,
  index = 0,
}) => {
  const { vibrate } = useHaptic();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = async () => {
    if (isPurchased || isDisabled) return;
    vibrate();
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
    } else {
      if (onClick) {
        try {
          await onClick();
        } catch (err) {
          console.error('ShopItem: onClick failed', err);
        }
      }
      setIsConfirming(false);
    }
  };

  return (
    <motion.div
      className="flex flex-row bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-200 h-32"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.25 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="relative w-32 h-32 bg-gray-50 flex items-center justify-center flex-shrink-0 border-r-2 border-gray-200">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-500 font-medium">{category || 'Item'}</p>
          <h3 className="font-bold text-sm text-gray-900">{name}</h3>
        </div>
        <motion.button
          className={`w-full rounded-lg px-3 py-2.5 flex items-center gap-3 transition-all border-2 font-semibold ${
            isPurchased
              ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed'
              : isDisabled
              ? 'bg-gray-100 border-gray-300 text-red-500 cursor-not-allowed'
              : isConfirming
                ? 'bg-green-500 hover:bg-green-600 border-green-600 text-white shadow-lg'
                : 'bg-shop-500 hover:bg-shop-600 border-shop-600 text-white shadow-md'
          }`}
          onClick={handleClick}
          whileTap={isPurchased || isDisabled ? undefined : { scale: 0.95 }}
          disabled={isPurchased || isDisabled}
        >
          <span className="text-sm font-semibold">
            {isPurchased
              ? 'Acquistato'
              : isDisabled
              ? disabledLabel || 'Fondi insufficienti'
              : isConfirming
              ? 'Conferma'
              : 'Acquista'}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            {!isPurchased && (
              <>
                <span className={`text-sm font-bold ${isDisabled ? 'text-gray-500' : 'text-white'}`}>
                  {price}
                </span>
                <img src="/token.png" alt="coin" className={`w-5 h-5 flex-shrink-0 ${isDisabled ? 'opacity-60' : ''}`} />
              </>
            )}
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

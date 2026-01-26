import { motion } from "framer-motion";
import { useHaptic } from "react-haptic";

interface FilterButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  isActive = false,
  onClick 
}) => {
  const { vibrate } = useHaptic();

  const handleClick = () => {
    vibrate();
    onClick?.();
  };

  return (
    <motion.button
      className={`px-4 py-2 border-2 rounded-lg whitespace-nowrap transition-colors font-semibold ${
        isActive
          ? 'bg-shop-500 text-white border-shop-500 shadow-md'
          : 'bg-white text-shop-600 border-shop-400 hover:bg-shop-50'
      }`}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
};

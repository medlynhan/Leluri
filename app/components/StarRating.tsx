"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // nilai rating (misal 3.5)
  size?: number; // optional: ukuran icon bintang
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 16 }) => {
  // pastikan rating valid (0 - 5)
  const value = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = value >= i + 1;
        const half = value > i && value < i + 1;
        return (
          <Star
            key={i}
            className={`w-${size / 4} h-${size / 4} ${
              filled
                ? "text-yellow-400 fill-yellow-400"
                : half
                ? "text-[var(--medium-grey)]"
                : "text-[var(--medium-grey)]"
            }`}
          />
        );
      })}
      <span className="ml-2 text-sm text-[var(--black)]">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
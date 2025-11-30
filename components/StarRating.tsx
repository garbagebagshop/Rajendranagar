import React from 'react';
import { IconStar, IconStarHalf } from './Icons';

interface Props {
  rating: number; // 0 to 5
  size?: string;
  className?: string;
}

export const StarRating: React.FC<Props> = ({ rating, size = "w-4 h-4", className = "text-yellow-400" }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <IconStar key={`full-${i}`} className={size} />
      ))}
      {hasHalfStar && <IconStarHalf className={size} />}
      {[...Array(emptyStars)].map((_, i) => (
        <IconStar key={`empty-${i}`} className={`${size} text-gray-200`} />
      ))}
    </div>
  );
};
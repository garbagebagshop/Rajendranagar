import React from 'react';

interface Props {
  price: number;
}

export const PriceFormatter: React.FC<Props> = ({ price }) => {
  if (!price || isNaN(price)) return null;

  const formatIndianCurrency = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakhs`;
    } else {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
    }
  };

  return (
    <span className="text-sm font-bold text-white bg-green-600/90 backdrop-blur-md px-3 py-1 rounded-md shadow-lg border border-green-500/50">
      {formatIndianCurrency(price)}
    </span>
  );
};
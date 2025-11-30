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
    <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
      {formatIndianCurrency(price)}
    </span>
  );
};
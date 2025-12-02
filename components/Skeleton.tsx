import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export const PropertyCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
    <div className="aspect-[4/3] w-full bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="flex gap-2 pt-1">
         <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
         <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-full mt-4 animate-pulse" />
    </div>
  </div>
);

export const DetailSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
    <div className="mb-8">
      <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="h-[400px] w-full bg-gray-200 rounded-xl mb-8"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-24 w-full bg-gray-200 rounded-xl"></div>
        <div className="h-40 w-full bg-gray-200 rounded-xl"></div>
        <div className="h-40 w-full bg-gray-200 rounded-xl"></div>
      </div>
      <div className="lg:col-span-1">
         <div className="h-64 w-full bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

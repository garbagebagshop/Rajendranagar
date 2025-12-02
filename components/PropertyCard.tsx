import React from 'react';
import { Property } from '../types';
import { PriceFormatter } from './PriceFormatter';
import { IconMapPin, IconRuler } from './Icons';
import { Link } from './Link';

interface Props {
  property: Property;
  priority?: boolean;
}

export const PropertyCard: React.FC<Props> = ({ property, priority = false }) => {
  // Safely access images with optional chaining
  const images = property.media?.images || [];
  const coverImage = images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <Link 
      href={`/p/${property.id}`}
      className="block bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
      aria-label={`View property details for ${property.title}`}
    >
      <div className="aspect-4-3 w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={coverImage} 
          alt={property.title}
          width="600"
          height="450"
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {property.propertyType}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <PriceFormatter price={property.price} />
        </div>
        <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-2 truncate">
          {property.title}
        </h3>
        
        <div className="flex flex-col gap-1 text-sm text-gray-500 mb-4 flex-grow">
          <div className="flex items-center gap-1.5">
            <IconMapPin className="w-3.5 h-3.5" />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconRuler className="w-3.5 h-3.5" />
            <span>{property.size.value} {property.size.unit}</span>
          </div>
        </div>

        <div className="mt-auto w-full py-2 text-center bg-slate-50 text-slate-700 text-sm font-medium rounded border border-gray-200 group-hover:bg-slate-100 transition-colors">
          View Property
        </div>
      </div>
    </Link>
  );
};

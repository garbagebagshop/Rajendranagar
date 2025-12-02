import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { fetchPropertiesByArea } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/Skeleton';
import { IconArrowLeft, IconCheck } from '../components/Icons';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { getAreaContent } from '../data/areaContent';

interface Props {
  areaName: string;
}

const AreaPage: React.FC<Props> = ({ areaName }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const content = getAreaContent(areaName);

  useEffect(() => {
    setLoading(true);
    fetchPropertiesByArea(areaName)
      .then(data => setProperties(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [areaName]);

  const seoTitle = `Properties in ${areaName} | Buy Villas, Plots & Flats | Rajendranagar.online`;
  const seoDesc = `Find verified properties in ${areaName}, Rajendra Nagar. Luxury villas, open plots, and apartments for sale in ${areaName} with zero brokerage.`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonical={`https://rajendranagar.online/area/${encodeURIComponent(areaName)}`}
      />

      <Link 
        href="/"
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 text-sm"
      >
        <IconArrowLeft /> Back to Home
      </Link>

      <div className="mb-8 border-b border-gray-100 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">{content.title}</h1>
        <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">
          Browse the best real estate listings in {areaName}. Verified owners, direct contact, and transparent deals.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-lg border border-gray-100 mb-12">
          <p className="text-gray-500 text-lg mb-2">No properties found in {areaName} at the moment.</p>
          <p className="text-sm text-gray-400 mb-4">We are actively verifying new listings.</p>
          <Link 
            href="/"
            className="text-blue-600 hover:underline font-medium"
          >
            Browse all areas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Dynamic Rich SEO Content */}
      <article className="prose prose-slate max-w-none bg-slate-50/50 p-6 md:p-8 rounded-2xl border border-slate-100">
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
        
        <div className="mt-8 pt-8 border-t border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Facts about {areaName}</h3>
           <ul className="grid md:grid-cols-2 gap-3 list-none pl-0 text-slate-700">
            <li className="flex items-center gap-2">
              <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Direct Connectivity to Main Roads</span>
            </li>
            <li className="flex items-center gap-2">
               <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>High Appreciation Potential</span>
            </li>
            <li className="flex items-center gap-2">
               <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Safe & Secure Neighborhood</span>
            </li>
            <li className="flex items-center gap-2">
               <IconCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span>Close to Schools & Hospitals</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
};

export default AreaPage;

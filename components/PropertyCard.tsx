import React from 'react';
import { Property, ContactType } from '../types';
import { PriceFormatter } from './PriceFormatter';
import { IconMapPin, IconRuler, IconPhone, IconWhatsApp } from './Icons';
import { Link } from './Link';

interface Props {
  property: Property;
  priority?: boolean;
}

export const PropertyCard: React.FC<Props> = ({ property, priority = false }) => {
  const images = property.media?.images || [];
  const coverImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/600x400?text=No+Image';

  const contactPhone = property.contact?.type === ContactType.Custom && property.contact.phone ? property.contact.phone : "6281256601";
  const contactWhatsapp = property.contact?.type === ContactType.Custom && property.contact.whatsapp ? property.contact.whatsapp : "6281256601";

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 card-hover flex flex-col h-full group relative hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300">
      
      {/* Image Area */}
      <Link href={`/p/${property.id}`} className="block relative aspect-4-3 bg-slate-800 overflow-hidden">
        <img 
          src={coverImage} 
          alt={property.title}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
           <span className="bg-slate-950/90 backdrop-blur-md border border-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-lg">
             {property.propertyType}
           </span>
           {property.featured === "1" && (
             <span className="bg-gold-gradient text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-lg border border-yellow-400/20">
               Featured
             </span>
           )}
        </div>

        {/* Price on Image */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
           <PriceFormatter price={property.price} />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        {/* Subtle top gradient inside card body */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

        <Link href={`/p/${property.id}`} className="block mb-3 group-hover:text-gold transition-colors">
          <h3 className="font-display font-bold text-white text-xl leading-snug line-clamp-2">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-5 text-sm text-slate-400 font-medium mb-6">
          <div className="flex items-center gap-1.5">
            <IconMapPin className="w-4 h-4 text-gold/80" />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconRuler className="w-4 h-4 text-gold/80" />
            <span>{property.size.value} {property.size.unit}</span>
          </div>
        </div>

        {/* Actions - Clearly Distinct */}
        <div className="grid grid-cols-4 gap-3 mt-auto pt-5 border-t border-slate-800/50">
          <a 
            href={`tel:+91${contactPhone}`}
            className="col-span-1 flex items-center justify-center bg-slate-800 border border-slate-700 text-white hover:bg-white hover:text-slate-900 rounded-xl transition-colors py-2.5 shadow-sm"
            title="Call Now"
          >
            <IconPhone className="w-4 h-4" />
          </a>
          <a 
            href={`https://wa.me/91${contactWhatsapp}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="col-span-1 flex items-center justify-center bg-green-900/20 border border-green-900/50 text-green-500 hover:bg-green-600 hover:text-white rounded-xl transition-colors py-2.5 shadow-sm"
            title="Chat on WhatsApp"
          >
            <IconWhatsApp className="w-4 h-4" />
          </a>
          <Link 
            href={`/p/${property.id}`}
            className="col-span-2 flex items-center justify-center btn-primary text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-gold/10"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
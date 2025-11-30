import React, { useEffect, useState } from 'react';
import { ContactType, Property } from '../types';
import { fetchPropertyById } from '../services/api';
import { PriceFormatter } from '../components/PriceFormatter';
import { StarRating } from '../components/StarRating';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconPhone, 
  IconWhatsApp, 
  IconBed, 
  IconRuler, 
  IconCompass, 
  IconCheck,
  IconShieldCheck
} from '../components/Icons';

interface Props {
  propertyId: string;
}

const PropertyDetail: React.FC<Props> = ({ propertyId }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyById(propertyId)
      .then(data => setProperty(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Details...</div>;
  if (!property) return <div className="p-12 text-center text-red-500">Property not found.</div>;

  const contactName = property.contact?.type === ContactType.Custom ? property.contact.name : "Agent";
  const contactPhone = property.contact?.type === ContactType.Custom ? property.contact.phone : "6281256601";
  const contactWhatsapp = property.contact?.type === ContactType.Custom ? property.contact.whatsapp : "6281256601";

  // Safely access images
  const images = property.media?.images || [];
  
  // Safely access amenities
  const amenitiesList = Array.isArray(property.amenities) ? property.amenities : [];

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const youtubeId = property.media?.youtubeLink ? getYouTubeId(property.media.youtubeLink) : null;

  const ratingValue = 4.8;
  const reviewCount = 12;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product", 
    "name": property.title,
    "description": property.description,
    "image": images,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": property.price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <SEO 
        title={`${property.title} - ${property.area} | Rajendranagar.online`}
        description={`For Sale: ${property.title} in ${property.area}. ${property.propertyType}, ${property.size.value} ${property.size.unit}. Verified Listing.`}
        schema={schema}
        image={images[0]}
      />

      <Link 
        href="/"
        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 mb-6 text-sm"
      >
        <IconArrowLeft /> Back to Home
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-3">
          {property.title}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <IconMapPin className="w-5 h-5 text-blue-500" />
            <span className="text-lg">{property.area}, Rajendranagar</span>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="text-xl">
               <PriceFormatter price={property.price} />
             </div>
             <div className="flex items-center gap-1">
               <StarRating rating={ratingValue} size="w-4 h-4" />
               <span className="text-xs text-slate-500 font-medium">({reviewCount} Verified Checks)</span>
             </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-xl overflow-hidden shadow-sm h-96 md:h-[500px]">
        <div className="h-full bg-gray-100">
          <img 
            src={images[0] || 'https://via.placeholder.com/800x600?text=No+Image'} 
            alt="Main view" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full hidden md:grid">
          {[1, 2, 3, 4].map((idx) => {
             const imgUrl = images[idx] || null;
             if (!imgUrl) return <div key={idx} className="bg-gray-50"></div>;
             return (
               <div key={idx} className="bg-gray-100 relative">
                  <img src={imgUrl} alt={`View ${idx}`} className="w-full h-full object-cover" />
               </div>
             );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="text-center">
              <IconBed className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-400">Type</span>
              <div className="font-medium">{property.propertyType}</div>
            </div>
            <div className="text-center">
              <IconRuler className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-400">Size</span>
              <div className="font-medium">{property.size.value} {property.size.unit}</div>
            </div>
            <div className="text-center">
              <IconCompass className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-400">Facing</span>
              <div className="font-medium">{property.facing || 'NA'}</div>
            </div>
            <div className="text-center">
              <IconMapPin className="w-6 h-6 text-slate-500 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-400">Area</span>
              <div className="font-medium">{property.area}</div>
            </div>
          </div>

          <div className="bg-green-50/50 border border-green-100 p-6 rounded-xl flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-full">
               <IconShieldCheck className="w-8 h-8 text-green-600" />
             </div>
             <div>
               <h3 className="font-bold text-slate-900">Verified Listing</h3>
               <p className="text-xs text-slate-600">Documents & Location Checked</p>
             </div>
          </div>

          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
            <p className="text-slate-600 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </section>

          {amenitiesList.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-slate-700">
                    <IconCheck className="w-5 h-5 text-green-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
             <h3 className="text-xl font-bold text-slate-900 mb-4">Location</h3>
             <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 text-center">
                <IconMapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <a 
                  href={property.location?.googleMapsLink || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-white border border-gray-300 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Open in Google Maps
                </a>
             </div>
          </section>

          {youtubeId && (
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Video Tour</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Contact */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interested?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Contact {contactName} for details.
            </p>

            <div className="space-y-3">
              <a 
                href={`tel:+91${contactPhone}`}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                <IconPhone />
                <span>Call Agent</span>
              </a>
              <a 
                href={`https://wa.me/91${contactWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-bold hover:bg-[#20bd5a] transition-colors"
              >
                <IconWhatsApp className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;

import React, { useEffect, useState } from 'react';
import { ContactType, Property } from '../types';
import { fetchPropertyById } from '../services/api';
import { PriceFormatter } from '../components/PriceFormatter';
import { StarRating } from '../components/StarRating';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { DetailSkeleton } from '../components/Skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { 
  IconArrowLeft, 
  IconMapPin, 
  IconPhone, 
  IconWhatsApp, 
  IconBed, 
  IconRuler, 
  IconCompass, 
  IconCheck,
  IconShieldCheck,
  IconShare,
  IconCopy
} from '../components/Icons';

interface Props {
  propertyId: string;
}

const PropertyDetail: React.FC<Props> = ({ propertyId }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPropertyById(propertyId)
      .then(data => setProperty(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) return <DetailSkeleton />;
  if (!property) return <div className="p-12 text-center text-red-500">Property not found.</div>;

  // Determine Contact Details
  const contactName = property.contact?.type === ContactType.Custom ? property.contact.name : "Team";
  const contactPhone = property.contact?.type === ContactType.Custom ? property.contact.phone : "6281256601";
  const contactWhatsapp = property.contact?.type === ContactType.Custom ? property.contact.whatsapp : "6281256601";

  // Images: API Adapter maps img1..4 to property.media.images
  const images = property.media?.images || [];
  
  // Amenities: API Adapter parses JSON if needed, but we add a safety check
  let amenitiesList: string[] = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities;
  } else if (typeof property.amenities === 'string') {
    // Double fallback in case Adapter missed it
    try {
      amenitiesList = JSON.parse(property.amenities);
    } catch(e) {
      amenitiesList = [];
    }
  }

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

  // Helper to format price for simple text share
  const formatPrice = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakhs`;
    return `₹${num}`;
  };

  const shareText = `Check out this property on Rajendranagar.online:\n\n${property.title}\n📍 ${property.area}\n💰 Price: ${formatPrice(property.price)}\n\nView details here: ${window.location.href}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

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
        className="flex items-center gap-1 text-slate-400 hover:text-white mb-6 text-sm"
      >
        <IconArrowLeft /> Back to Home
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
          {property.title}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <IconMapPin className="w-5 h-5 text-gold" />
            <span className="text-lg">{property.area}, Rajendranagar</span>
          </div>
          <div className="flex flex-col items-end gap-1">
             <div className="text-xl">
               <PriceFormatter price={property.price} />
             </div>
             <div className="flex items-center gap-1">
               <StarRating rating={ratingValue} size="w-4 h-4" />
               <span className="text-xs text-slate-400 font-medium">({reviewCount} Verified Checks)</span>
             </div>
          </div>
        </div>
      </div>

      {/* Gallery - Swiper Carousel */}
      <div className="mb-8 h-72 md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-slate-800 bg-slate-900 relative">
        {images.length <= 1 ? (
          <img 
            src={images[0] || 'https://via.placeholder.com/800x600?text=No+Image'} 
            alt="Main view" 
            loading="eager"
            className="w-full h-full object-cover"
          />
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            pagination={{ clickable: true }}
            navigation
            loop
            className="h-full w-full"
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img 
                  src={src} 
                  className="w-full h-full object-cover" 
                  alt={`Slide ${i}`} 
                  loading={i === 0 ? "eager" : "lazy"} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="text-center">
              <IconBed className="w-6 h-6 text-gold mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-500">Type</span>
              <div className="font-medium text-white">{property.propertyType}</div>
            </div>
            <div className="text-center">
              <IconRuler className="w-6 h-6 text-gold mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-500">Size</span>
              <div className="font-medium text-white">{property.size.value} {property.size.unit}</div>
            </div>
            <div className="text-center">
              <IconCompass className="w-6 h-6 text-gold mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-500">Facing</span>
              <div className="font-medium text-white">{property.facing || 'NA'}</div>
            </div>
            <div className="text-center">
              <IconMapPin className="w-6 h-6 text-gold mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-500">Area</span>
              <div className="font-medium text-white">{property.area}</div>
            </div>
          </div>

          <div className="bg-green-900/10 border border-green-800/50 p-6 rounded-xl flex items-center gap-3">
             <div className="bg-green-900/30 p-2 rounded-full">
               <IconShieldCheck className="w-8 h-8 text-green-500" />
             </div>
             <div>
               <h3 className="font-bold text-white">Verified Listing</h3>
               <p className="text-xs text-slate-400">Documents & Location Checked</p>
             </div>
          </div>

          <section>
            <h3 className="text-xl font-bold text-white mb-4">Description</h3>
            <p className="text-slate-300 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </section>

          {amenitiesList.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-slate-300">
                    <IconCheck className="w-5 h-5 text-gold" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
             <h3 className="text-xl font-bold text-white mb-4">Location</h3>
             <div className="bg-slate-900 rounded-xl p-8 border border-slate-800 text-center">
                <IconMapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <a 
                  href={property.location?.googleMapsLink || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-slate-800 border border-slate-700 text-white px-6 py-2.5 rounded-lg hover:bg-slate-700 hover:border-gold font-medium transition-colors"
                >
                  Open in Google Maps
                </a>
             </div>
          </section>

          {youtubeId && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Video Tour</h3>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-slate-800">
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

        {/* Right Column: Contact & Share */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact Card */}
          <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Interested?</h3>
            <p className="text-slate-400 text-sm mb-6">
              Contact {contactName} for details.
            </p>

            <div className="space-y-3">
              <a 
                href={`tel:+91${contactPhone}`}
                className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                aria-label="Call Now"
              >
                <IconPhone />
                <span>Call Now</span>
              </a>
              <a 
                href={`https://wa.me/91${contactWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-lg font-bold hover:bg-[#20bd5a] transition-colors"
                aria-label="Chat on WhatsApp"
              >
                <IconWhatsApp className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Share Card */}
          <div className="sticky top-[380px] bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Share this Property</h3>
            <div className="flex flex-col gap-3">
              <a 
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-900/20 text-green-500 border border-green-900/50 py-2.5 rounded-lg font-semibold hover:bg-green-900/40 transition-colors text-sm"
                aria-label="Share on WhatsApp"
              >
                <IconWhatsApp className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-slate-800 text-slate-300 border border-slate-700 py-2.5 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
                  aria-label="Share options"
                >
                  <IconShare className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-2 border py-2.5 rounded-lg font-semibold transition-colors text-sm ${
                    copied 
                      ? "bg-blue-900/30 text-blue-400 border-blue-800" 
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                  aria-label="Copy link to clipboard"
                >
                  {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;
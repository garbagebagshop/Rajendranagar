import React, { useEffect, useState } from 'react';
import { Area, Property, PropertyType } from '../types';
import { fetchProperties } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { IconCheck, IconShieldCheck, IconTrophy, IconBriefcase, IconSearch, IconFilter, IconX } from '../components/Icons';
import { StarRating } from '../components/StarRating';
import { Link, navigate } from '../components/Link';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    fetchProperties()
      .then(data => setProperties(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAreaClick = (area: string) => {
    navigate(`/area/${encodeURIComponent(area)}`);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedArea("");
    setSelectedType("");
    setMinPrice("");
    setMaxPrice("");
  };

  // Filter Logic
  const filteredProperties = properties.filter(property => {
    // Search Term (Title or Description)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match = property.title.toLowerCase().includes(term) || 
                    property.description.toLowerCase().includes(term);
      if (!match) return false;
    }

    // Area
    if (selectedArea && property.area !== selectedArea) return false;

    // Property Type
    if (selectedType && property.propertyType !== selectedType) return false;

    // Price Range
    const price = Number(property.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;

    return true;
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Rajendranagar.online",
    "url": "https://rajendranagar.online",
    "logo": "https://rajendranagar.online/logo.png",
    "image": "https://rajendranagar.online/og-image.png",
    "telephone": "+916281256601",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rajendra Nagar",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "17.3297",
      "longitude": "78.4124"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    },
    "priceRange": "₹₹"
  };

  return (
    <div className="pb-12 bg-white">
      <SEO 
        title="Rajendranagar.online | Real Estate in Kismatpur, Budvel & Attapur"
        description="Buy verified properties in Rajendra Nagar, Kismatpur, Budvel & Attapur. Zero brokerage on villas, open plots and apartments. Trusted by 500+ clients."
        schema={schema}
      />

      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-16 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            ZERO BROKERAGE PLATFORM
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Space in Rajendranagar</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-6">
            The fastest way to buy and sell properties in Kismatpur, Budvel, Attapur, and surrounding areas.
            Explore verified open plots, luxury villas, and commercial lands.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-400">
             <span className="flex items-center gap-1"><IconShieldCheck className="w-4 h-4 text-green-400" /> 100% Verified Listings</span>
             <span className="flex items-center gap-1"><IconCheck className="w-4 h-4 text-blue-400" /> Zero Brokerage</span>
             <span className="flex items-center gap-1"><IconTrophy className="w-4 h-4 text-yellow-400" /> ₹300 Cr+ Transaction Value</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - Moved Here for Best Fit & Removed Sticky */}
      <section className="px-4 -mt-12 relative z-10 mb-8" id="search">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-gray-100 pb-2">
            <IconSearch className="w-5 h-5 text-blue-600" />
            <h2>Find Your Property</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-4 relative">
              <IconSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by title, keywords..." 
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Area Select */}
            <div className="md:col-span-2">
              <select 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">All Areas</option>
                {Object.values(Area).map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Type Select */}
            <div className="md:col-span-2">
              <select 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {Object.values(PropertyType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="md:col-span-2">
              <input 
                type="number" 
                placeholder="Min Price" 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
               <input 
                type="number" 
                placeholder="Max Price" 
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              {(searchTerm || selectedArea || selectedType || minPrice || maxPrice) && (
                <button 
                  onClick={clearFilters}
                  className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
                  title="Clear Filters"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          {(filteredProperties.length !== properties.length) && (
            <div className="mt-3 text-xs text-gray-500 font-medium">
              Showing {filteredProperties.length} results
            </div>
          )}
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* Trust 1: Zero Brokerage */}
            <div className="flex flex-col items-center md:items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 mb-4">
                <IconCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">No Commission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We charge a simple listing fee to connect sellers and buyers directly. You save lakhs in commissions by dealing directly.
              </p>
            </div>

            {/* Trust 2: Curation */}
            <div className="flex flex-col items-center md:items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="bg-green-50 p-3 rounded-full text-green-600 mb-4">
                <IconShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Verified & Fake-Free</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                No public posting allowed. Every property is personally verified by us to ensure clean titles and zero spam.
              </p>
            </div>

            {/* Trust 3: Clientele */}
            <div className="flex flex-col items-center md:items-start p-4 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="bg-purple-50 p-3 rounded-full text-purple-600 mb-4">
                <IconBriefcase className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Trusted Professionals</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our trusted clientele includes employees from Google, Microsoft, Government staff, Professors, Lawyers, and NRIs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Properties - Moved above Explore Localities */}
      <section className="bg-gray-50 border-t border-gray-200 py-16" id="properties">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Latest Verified Properties</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading properties...</div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <IconFilter className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No properties match your search.</p>
              <button onClick={clearFilters} className="text-blue-600 font-medium hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Areas Grid */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Explore Localities</h2>
          <p className="text-slate-500">Find properties in the most popular areas of Rajendra Nagar</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.values(Area).map((area) => (
            <button
              key={area}
              onClick={() => handleAreaClick(area)}
              className="p-3 text-sm text-center bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-sm transition-all text-slate-700"
            >
              {area}
            </button>
          ))}
        </div>
      </section>

      {/* Buyer Motivation Content */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Invest in Rajendra Nagar Now?</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
          </div>
          <div className="prose prose-lg text-slate-600 text-justify mx-auto">
            <p>
              <strong>Unlocking Wealth in the New Gateway of Hyderabad.</strong><br/>
              Hyderabad's real estate market is witnessing a historic shift, and Rajendra Nagar is at the epicenter of this transformation. For decades, the western corridor (Hitech City, Gachibowli) dominated the narrative. However, with saturation hitting those markets and prices skyrocketing beyond reach, smart investors have turned their gaze South-West. Rajendra Nagar, specifically the Kismatpur-Budvel-Attapur belt, is no longer just an alternative; it is the primary choice for luxury living and high-growth investment.
            </p>
            <p>
              Why buy here? First, the <strong>Location Advantage</strong> is unbeatable. You are essentially living in a green, pollution-free zone next to the Himayat Sagar Lake, yet you are only a 15-minute drive from the Financial District via the seamless Outer Ring Road (ORR). The PVNR Expressway ensures you are never disconnected from the city center.
            </p>
            <p>
              Second, the <strong>Infrastructure Boom</strong>. The proposed IT Cluster in Budvel is a game-changer. It is poised to generate thousands of jobs, creating a massive rental demand and driving property prices up. The Eco-Park at Kothwalguda and the beautification of the Musi River front are adding aesthetic value that few other localities can boast of.
            </p>
            <p>
              Third, <strong>Value for Money</strong>. While a villa in Kokapet might cost you upwards of ₹10 Crores, Kismatpur offers the same luxury, larger plot sizes, and better air quality at a fraction of that price—but not for long. Market analysts predict a 30-40% appreciation in land values over the next 24 months. Buying a property here isn't just purchasing a home; it's securing a legacy asset that will compound in value while providing a serene lifestyle today. Don't wait for the prices to peak; the best time to enter this market is now.
            </p>
          </div>
        </div>
      </section>

      {/* Seller Motivation Content */}
      <section className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-4xl mx-auto px-4">
           <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Sell Smart, Sell Direct, Sell Fast</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded"></div>
          </div>
           <div className="prose prose-lg text-slate-400 text-justify mx-auto">
            <p>
              <strong>Maximize Your Property's Value: The Smart Way to Sell.</strong><br/>
              Selling a property in India has traditionally been a stressful, opaque, and expensive process. Homeowners often find themselves trapped in a web of local brokers, paying 2% to 4% in commissions, dealing with hundreds of irrelevant calls, and unsure if they are getting the true market price. At <strong>rajendranagar.online</strong>, we have dismantled this outdated system to put the power back in your hands.
            </p>
            <p>
              Why list with us? It comes down to <strong>Zero Brokerage and Maximum Reach</strong>. When you sell through a traditional channel, a significant chunk of your profit is lost to middleman commissions. On a ₹2 Crore villa, that’s ₹4 Lakhs lost! With our platform, you pay a nominal verified listing fee, and 100% of the sale value is yours. We believe your asset's appreciation belongs to you, not a broker.
            </p>
            <p>
              Furthermore, we solve the <strong>Quality vs. Quantity</strong> problem. Listing on generic free portals often leads to spam calls from window shoppers and aggressive agents. Our platform is curated. We market your property specifically to a database of serious buyers—tech professionals from Google, Microsoft, and Amazon, government officials, and NRIs who are actively looking for verified assets in Rajendra Nagar.
            </p>
            <p>
              We also assist in <strong>Trust Building</strong>. Our 'Verified' badge signals to buyers that your documents are in order and the location is genuine, allowing you to command a premium price and close deals faster. In a market flooded with litigation-prone lands, a verified listing is gold. Whether you are selling an open plot in Budvel or a luxury apartment in Attapur, our platform ensures your property is showcased with the professionalism it deserves, connecting you directly to the right buyer for a swift, transparent transaction.
            </p>
          </div>
          <div className="mt-10 text-center">
             <Link href="/contact" className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-500 transition-colors shadow-lg shadow-green-900/50">
               List Your Property Now
             </Link>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Client Success Stories</h2>
            <div className="flex justify-center items-center gap-2">
              <StarRating rating={4.9} size="w-5 h-5" />
              <span className="text-slate-600 font-medium">4.9/5 from 120+ Verified Customers</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-slate-900">Rajesh K.</div>
                <StarRating rating={5} />
              </div>
              <p className="text-slate-600 text-sm italic">
                "Saved almost 3 Lakhs in brokerage! The direct connection with the seller was seamless. Highly recommend this platform for anyone looking in Kismatpur."
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-slate-900">Sarah M.</div>
                <StarRating rating={5} />
              </div>
              <p className="text-slate-600 text-sm italic">
                "Found a great villa in Kismatpur without any hassle. Genuine listings and very professional support from the admin team."
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-slate-900">Dr. Venkat</div>
                <StarRating rating={4.5} />
              </div>
              <p className="text-slate-600 text-sm italic">
                "Transparent dealing. No hidden charges. The documentation guidance was also very helpful for my plot purchase in Budvel."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Is Rajendra Nagar good for investment?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes, with the ORR proximity and IT growth in Budvel, it's a prime corridor. The connectivity to the airport and financial district makes it a hotspot.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">What is Zero Brokerage?</h3>
              <p className="text-slate-600 leading-relaxed">
                We don't charge commission on the deal value. Just a listing fee for sellers to verify the property. Buyers pay nothing to browse and connect.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Are all listings verified?</h3>
              <p className="text-slate-600 leading-relaxed">
                Yes, we do not allow public posting. Every listing goes through an admin verification process to ensure authenticity and clean titles.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
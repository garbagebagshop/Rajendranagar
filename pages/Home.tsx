
import React, { useEffect, useState } from 'react';
import { Area, Property, PropertyType } from '../types';
import { fetchProperties } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyCardSkeleton } from '../components/Skeleton';
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
  
  // Collapsible text state
  const [showInvestMore, setShowInvestMore] = useState(false);
  
  // Live Search
  const [showDropdown, setShowDropdown] = useState(false);

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
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setShowDropdown(val.length > 0);
  };

  // Filter Logic
  const filteredProperties = properties.filter(property => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match = property.title.toLowerCase().includes(term) || 
                    property.description.toLowerCase().includes(term) ||
                    property.area.toLowerCase().includes(term);
      if (!match) return false;
    }
    if (selectedArea && property.area !== selectedArea) return false;
    if (selectedType && property.propertyType !== selectedType) return false;
    const price = Number(property.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });
  
  const sortedAreas = Object.values(Area).sort();
  const areaMatches = sortedAreas.filter(a => a.toLowerCase().includes(searchTerm.toLowerCase()));
  const titleMatches = properties.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 3);

  return (
    <div className="pb-12 bg-slate-950">
      <SEO 
        title="Rajendranagar.online | Premium Real Estate in Kismatpur, Budvel & Attapur"
        description="Buy verified properties in Rajendra Nagar. Zero brokerage on villas, open plots and apartments in Kismatpur, Budvel & Attapur."
      />

      {/* Hero Section - Immersive & High Contrast */}
      <div className="bg-hero-pattern relative min-h-[550px] flex items-center justify-center pt-24 pb-32 px-4 border-gold-gradient-bottom">
        <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
          <div className="inline-block bg-black/60 backdrop-blur-md border border-gold/40 text-xs font-bold px-5 py-2 rounded-full mb-8 uppercase tracking-[0.2em] text-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fade-in">
             Verified • Direct • Zero Brokerage
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 leading-tight drop-shadow-2xl">
            Find Your Legacy in <br/><span className="text-gold-gradient">Rajendra Nagar</span>
          </h1>
          <p className="text-slate-200 max-w-2xl mx-auto text-lg md:text-xl mb-10 font-light leading-relaxed drop-shadow-md">
            The most trusted platform for buying and selling properties in Kismatpur, Budvel, and Attapur. Direct owner connections, no middleman commissions.
          </p>
          
          {/* Quick Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-bold text-white uppercase tracking-wide">
             <span className="flex items-center gap-2"><IconCheck className="w-5 h-5 text-gold" /> 100% Verified</span>
             <span className="flex items-center gap-2"><IconCheck className="w-5 h-5 text-gold" /> Direct Owners</span>
          </div>
        </div>
      </div>

      {/* Floating Search Section - Premium Gold Finish */}
      <div className="px-4 -mt-20 relative z-20 mb-12" id="search">
        <div className="max-w-6xl mx-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold/30 p-6 md:p-8 relative overflow-hidden">
          {/* Top Gold Line Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gold-gradient"></div>

          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <h2 className="font-display text-2xl font-bold text-white">Search Properties</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/10 text-gold px-2 py-1 rounded border border-gold/20 animate-pulse">Live</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="md:col-span-4 relative group">
              <label htmlFor="search" className="sr-only">Keywords</label>
              <div className="relative">
                <IconSearch className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-gold transition-colors" />
                <input 
                  id="search"
                  type="text" 
                  placeholder="Search Title, Area, or Keyword..." 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:bg-slate-900 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all placeholder-slate-500 shadow-inner"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => { if(searchTerm) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  autoComplete="off"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && (searchTerm.length > 0) && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl shadow-2xl border border-gold/20 overflow-hidden z-30">
                    {areaMatches.length > 0 && (
                      <div className="p-2 border-b border-slate-700">
                        <p className="text-xs font-bold text-gold px-3 py-2 uppercase tracking-wider">Areas</p>
                        {areaMatches.map(area => (
                          <div key={area} onClick={() => { setSelectedArea(area); setSearchTerm(""); setShowDropdown(false); }} className="px-3 py-2.5 hover:bg-slate-700 text-sm rounded-lg cursor-pointer text-white transition-colors">
                            {area}
                          </div>
                        ))}
                      </div>
                    )}
                    {titleMatches.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-bold text-gold px-3 py-2 uppercase tracking-wider">Properties</p>
                        {titleMatches.map(p => (
                          <Link href={`/p/${p.id}`} key={p.id} className="block px-3 py-2.5 hover:bg-slate-700 text-sm rounded-lg cursor-pointer text-white truncate transition-colors">
                            {p.title}
                          </Link>
                        ))}
                      </div>
                    )}
                    {areaMatches.length === 0 && titleMatches.length === 0 && (
                      <div className="p-6 text-center text-sm text-slate-400">No results found</div>
                    )}
                 </div>
              )}
            </div>

            {/* Filters */}
            <div className="md:col-span-2">
              <select 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:bg-slate-900 focus:border-gold outline-none cursor-pointer shadow-sm"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">All Areas</option>
                {sortedAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <select 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:bg-slate-900 focus:border-gold outline-none cursor-pointer shadow-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="md:col-span-3 flex gap-2">
               <input 
                type="number" 
                placeholder="Min Price" 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:bg-slate-900 focus:border-gold outline-none shadow-sm"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
               <input 
                type="number" 
                placeholder="Max Price" 
                className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800 text-white focus:bg-slate-900 focus:border-gold outline-none shadow-sm"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            
             <div className="md:col-span-1 flex items-center justify-center">
              {(searchTerm || selectedArea || selectedType || minPrice || maxPrice) ? (
                 <button onClick={clearFilters} className="p-3 text-red-400 hover:bg-red-900/30 rounded-xl transition-colors border border-transparent hover:border-red-900/50" title="Clear Filters">
                  <IconX className="w-6 h-6" />
                </button>
              ) : (
                <button className="p-3.5 btn-primary w-full md:w-auto flex justify-center items-center shadow-[0_0_15px_rgba(212,175,55,0.3)] rounded-xl">
                  <IconSearch className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Areas Pills (Dark Style) */}
      <section className="mb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-white font-bold mb-6 px-1 flex items-center gap-3 text-lg">
            <span className="w-1.5 h-6 bg-gold-gradient rounded-full"></span> Browse by Locality
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-4 px-1 snap-x no-scrollbar mask-linear-fade">
            {sortedAreas.map((area) => (
              <button
                key={area}
                onClick={() => handleAreaClick(area)}
                className="flex-shrink-0 snap-center px-6 py-3 text-sm bg-slate-900 border border-slate-700 rounded-full hover:border-gold hover:text-white hover:bg-slate-800 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all text-slate-300 font-medium whitespace-nowrap"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="max-w-6xl mx-auto px-4 mb-12" id="properties">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gold-gradient mb-2">Latest Listings</h2>
            <p className="text-slate-400">Handpicked properties in prime locations</p>
          </div>
          <Link href="#search" className="hidden md:block text-sm font-bold text-gold hover:text-white transition-colors bg-slate-900 border border-gold/30 px-6 py-2 rounded-full mt-4 md:mt-0">
            View All Listings &rarr;
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => <PropertyCardSkeleton key={i} />)}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-slate-900 rounded-2xl border border-slate-800">
            <IconSearch className="w-16 h-16 text-slate-700 mx-auto mb-6" />
            <p className="text-slate-400 text-lg">No properties match your filters.</p>
            <button onClick={clearFilters} className="mt-4 text-gold font-bold hover:underline">Reset Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} priority={index < 3} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Badges - Radial Glow Background */}
      <section className="bg-gold-radial py-12 border-gold-gradient-top border-gold-gradient-bottom relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-gold/40 hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconTrophy className="w-7 h-7 text-gold drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gold transition-colors">Zero Commission</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We connect you directly with owners. Pay a small listing fee instead of a 2% brokerage cut. Save Lakhs.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-gold/40 hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconShieldCheck className="w-7 h-7 text-gold drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gold transition-colors">100% Verified</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every property is physically verified by our team. We ensure clean titles and zero spam listings.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex items-start gap-5 p-8 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-gold/40 hover:bg-slate-900/60 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconBriefcase className="w-7 h-7 text-gold drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gold transition-colors">Elite Network</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trusted by employees from Google, Microsoft, and Govt officials for safe, transparent deals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold"></div>

      {/* Content Sections - Clean & Readable */}
      <section className="py-16 bg-slate-900 relative overflow-hidden">
        {/* Ambient background shape */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[100px]"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white text-center mb-12">Why Invest in <span className="text-gold-gradient">Rajendra Nagar?</span></h2>
          
          <div className="prose prose-lg prose-invert mx-auto leading-relaxed text-slate-300">
            <p className="text-xl font-light text-center mb-8">
              Rajendra Nagar (Kismatpur, Budvel, Attapur) is Hyderabad's fastest-growing residential corridor. With the <strong>Budvel IT Cluster</strong> and proximity to the Financial District via ORR, property values are surging.
            </p>
            {showInvestMore && (
              <div className="animate-fade-in mt-8 space-y-6 bg-slate-950/50 p-8 rounded-2xl border border-white/5">
                <p>
                  It offers the perfect balance: a pollution-free environment near Himayat Sagar Lake, yet only a 20-minute drive to the airport or Hitech City. Whether you are looking for high-appreciation open plots in Budvel or luxury villas in Kismatpur, this is the golden zone of Hyderabad real estate.
                </p>
                <p>
                  <strong>Strategic Advantage:</strong> The area is an educational hub with top schools and universities, ensuring steady rental demand. Infrastructure projects like the widened roads and eco-parks add immense lifestyle value.
                </p>
              </div>
            )}
            <div className="text-center mt-8">
               <button onClick={() => setShowInvestMore(!showInvestMore)} className="text-gold font-bold hover:text-white transition-colors border-b border-gold hover:border-white pb-1">
                {showInvestMore ? "Read Less" : "Read More Analysis"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-gold"></div>

      <section className="py-16 bg-hero-pattern text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90"></div>
        <div className="absolute inset-0 bg-gold-gradient opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gold-gradient mb-6">List Your Property for Free</h2>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
             Post an ad in 2 minutes. Reach 1000s of buyers in Rajendra Nagar.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link href="/post-property" className="btn-primary w-full md:w-auto px-12 py-5 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] text-lg tracking-wide transform hover:scale-105 transition-transform duration-300">
              Post for Sale
            </Link>
            <Link href="/post-property" className="w-full md:w-auto px-12 py-5 rounded-full border border-white text-white font-bold hover:bg-white hover:text-slate-900 transition-colors duration-300">
              Post for Rent
            </Link>
          </div>
          
          <div className="mt-8">
             <Link href="/manage-ads" className="text-sm font-medium text-slate-400 hover:text-white underline decoration-gold/50 hover:decoration-gold">
               Manage my existing ads
             </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-slate-950 border-t border-gold-gradient-top">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <div className="inline-flex items-center gap-3 bg-slate-900/80 border border-gold/30 px-8 py-3 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.1)] mb-12">
              <StarRating rating={4.9} className="text-gold" />
              <span className="font-bold text-white text-lg">4.9/5 from 120+ Clients</span>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-white/5 hover:border-gold/30 transition-all group">
               <p className="text-slate-300 italic mb-6 leading-relaxed group-hover:text-white transition-colors">"Saved huge brokerage on my Kismatpur villa purchase. The direct owner meeting was very smooth."</p>
               <div className="font-bold text-gold border-t border-slate-800 pt-4">- Rajesh K, Software Architect</div>
             </div>
             <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-white/5 hover:border-gold/30 transition-all group">
               <p className="text-slate-300 italic mb-6 leading-relaxed group-hover:text-white transition-colors">"Professional verification. I was worried about land titles in Budvel, but their team checked everything."</p>
               <div className="font-bold text-gold border-t border-slate-800 pt-4">- Dr. Sarah, AIG Hospitals</div>
             </div>
             <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-white/5 hover:border-gold/30 transition-all group">
               <p className="text-slate-300 italic mb-6 leading-relaxed group-hover:text-white transition-colors">"Best platform for Rajendra Nagar. No fake listings like other big portals."</p>
               <div className="font-bold text-gold border-t border-slate-800 pt-4">- Venkat R, NRI Investor</div>
             </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

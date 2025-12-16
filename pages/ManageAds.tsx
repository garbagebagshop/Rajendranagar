
import React, { useState } from 'react';
import { Property } from '../types';
import { fetchMyProperties, deleteProperty } from '../services/api';
import { IconArrowLeft, IconPhone, IconSearch, IconX } from '../components/Icons';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { PropertyCard } from '../components/PropertyCard';

const ManageAds: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [listings, setListings] = useState<Property[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMyProperties(mobile);
      setListings(data);
      setSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setLoading(true);
      const success = await deleteProperty(id, mobile);
      if (success) {
        setListings(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <SEO title="Manage My Ads - Rajendranagar.online" description="View or delete your property listings." />

      <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white mb-6 text-sm">
        <IconArrowLeft /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Manage My Ads</h1>

      {/* Search Section */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-10">
        <label className="block text-slate-300 mb-2 text-sm">Enter your registered mobile number</label>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input 
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="9876543210"
            maxLength={10}
            className="flex-1 p-3 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-gold outline-none"
          />
          <button type="submit" disabled={loading} className="btn-primary px-6 rounded-lg whitespace-nowrap">
            {loading ? '...' : 'Find Ads'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-6 flex justify-between items-center">
            <span>Your Listings ({listings.length})</span>
            {listings.length === 0 && <span className="text-sm font-normal text-slate-500">No active ads found.</span>}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map(p => (
              <div key={p.id} className="relative group">
                <PropertyCard property={p} />
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors z-10"
                  title="Delete Listing"
                >
                  <IconX className="w-4 h-4" />
                </button>
                <div className="absolute top-2 right-12 bg-black/60 backdrop-blur text-white text-xs px-2 py-1.5 rounded border border-white/20">
                   Expires in {60 - Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            ))}
          </div>
          
          {listings.length === 0 && searched && (
             <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
               <p className="text-slate-500 mb-4">You haven't posted any ads yet or they have expired.</p>
               <Link href="/post-property" className="text-gold hover:underline">Post a Free Ad Now &rarr;</Link>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAds;

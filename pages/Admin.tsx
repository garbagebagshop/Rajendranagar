
import React, { useState, useRef, useEffect } from 'react';
import { Area, PropertyType, SizeUnit, ContactType, AMENITIES_LIST, PropertyData, ListingCategory, TIER_PLANS, DashboardStats, UserLimit, Property } from '../types';
import { PriceFormatter } from '../components/PriceFormatter';
import { saveProperty, getDashboardStats, getUserLimit, updateUserLimit, fetchMyProperties, deleteProperty } from '../services/api';
import { processAndUploadImages } from '../utils/imageUpload';
import { IconX, IconCheck, IconSearch, IconUser, IconTrophy } from '../components/Icons';
import { PropertyCard } from '../components/PropertyCard';
import { getEnv } from '../utils/env';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'post'>('dashboard');
  
  // Dashboard State
  const [stats, setStats] = useState<DashboardStats>({ totalAds: 0, todaysAds: 0, topAreas: [] });

  // User Management State
  const [searchMobile, setSearchMobile] = useState('');
  const [userLimit, setUserLimit] = useState<UserLimit | null>(null);
  const [userAds, setUserAds] = useState<Property[]>([]);
  const [userLoading, setUserLoading] = useState(false);

  // Post Property State
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    area: Area.Kismatpur,
    propertyType: PropertyType.Apartment,
    listingCategory: ListingCategory.Sale,
    size: { value: 0, unit: SizeUnit.SqFt },
    price: 0,
    facing: '',
    description: '',
    amenities: [],
    location: { googleMapsLink: '' },
    media: { youtubeLink: '', images: [] },
    contact: { type: ContactType.Default }
  });

  // --- Auth & Effects ---

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadStats();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPassword = getEnv('VITE_ADMIN_PASSWORD');
    
    if (password === envPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  // --- User Management Logic ---

  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize input: Remove non-digits, take last 10
    const cleanNumber = searchMobile.replace(/\D/g, '').slice(-10);

    if (cleanNumber.length !== 10) {
      alert("Please enter a valid mobile number (at least 10 digits)");
      return;
    }
    
    setUserLoading(true);
    try {
      // Fetch Limit Info using the raw input (API handles sanitization/matching)
      const limit = await getUserLimit(cleanNumber);
      
      // If no limit exists, we create a temporary "Free" object so the admin can still assign tiers
      // We use the 'cleanNumber' for display and subsequent updates
      const displayLimit = limit || { 
        mobile: cleanNumber, 
        max_posts: 1, 
        tier_name: 'Free' 
      };
      setUserLimit(displayLimit);
      
      // Fetch Active Ads
      const ads = await fetchMyProperties(cleanNumber);
      setUserAds(ads);
    } catch (e) {
      console.error(e);
      alert("Error fetching user data");
    } finally {
      setUserLoading(false);
    }
  };

  const handleAssignTier = async (tier: { name: string, limit: number }) => {
    if (!userLimit || !userLimit.mobile) return;
    
    // Ensure we send the clean number or the existing DB ID (mobile)
    if (!confirm(`Assign ${tier.name} Plan (${tier.limit} posts) to ${userLimit.mobile}?`)) return;
    
    const success = await updateUserLimit(userLimit.mobile, tier.name, tier.limit);
    if (success) {
      setUserLimit({ ...userLimit, max_posts: tier.limit, tier_name: tier.name });
      alert("Plan updated successfully!");
    } else {
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleDeleteUserAd = async (id: string) => {
    if (!confirm("Delete this user's ad?")) return;
    if (!userLimit) return;
    
    await deleteProperty(id, 'ADMIN'); // Using 'ADMIN' as bypass key
    // Refresh ads
    const cleanNumber = userLimit.mobile.replace(/\D/g, '').slice(-10);
    const ads = await fetchMyProperties(cleanNumber);
    setUserAds(ads);
  };

  // --- Post Property Logic ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sizeValue') {
      setFormData(prev => ({ ...prev, size: { ...prev.size, value: Number(value) } }));
    } else if (name === 'sizeUnit') {
      setFormData(prev => ({ ...prev, size: { ...prev.size, unit: value as SizeUnit } }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, price: Number(value) }));
    } else if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    } else if (name.startsWith('media.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, media: { ...prev.media, [field]: value } }));
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const remainingSlots = 10 - formData.media.images.length;
      if (files.length > remainingSlots) {
        alert(`Limit 10 images. You can add ${remainingSlots} more.`);
        return;
      }
      setUploading(true);
      setUploadProgress({ current: 0, total: files.length });
      try {
        const newImageUrls = await processAndUploadImages(files, (current, total) => setUploadProgress({ current, total }));
        setFormData(prev => ({ ...prev, media: { ...prev.media, images: [...prev.media.images, ...newImageUrls] } }));
      } catch (error) {
        alert("Upload failed.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({ ...prev, media: { ...prev.media, images: prev.media.images.filter((_, index) => index !== indexToRemove) } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });
    try {
      const result = await saveProperty(formData, true);
      if (result.success) {
        setStatus({ type: 'success', msg: result.message });
        setFormData(prev => ({ ...prev, title: '', price: 0, description: '', media: { ...prev.media, images: [] } }));
      } else {
        setStatus({ type: 'error', msg: result.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-slate-900 text-white p-2 rounded hover:bg-slate-700">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Admin Panel</h1>
        
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setActiveTab('dashboard')} 
             className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'dashboard' ? 'bg-gold text-slate-900' : 'text-slate-400 hover:text-white'}`}
           >
             Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('users')} 
             className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'users' ? 'bg-gold text-slate-900' : 'text-slate-400 hover:text-white'}`}
           >
             User Management
           </button>
           <button 
             onClick={() => setActiveTab('post')} 
             className={`px-4 py-2 rounded text-sm font-bold transition-colors ${activeTab === 'post' ? 'bg-gold text-slate-900' : 'text-slate-400 hover:text-white'}`}
           >
             Post Property
           </button>
           <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 text-sm text-red-400 hover:text-red-300 font-medium">
             Logout
           </button>
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total Active Ads</h3>
               <div className="text-4xl font-bold text-white">{stats.totalAds}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Posted Today</h3>
               <div className="text-4xl font-bold text-gold">{stats.todaysAds}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
               <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Top Location</h3>
               <div className="text-4xl font-bold text-white truncate">
                 {stats.topAreas.length > 0 ? stats.topAreas[0].area : 'N/A'}
               </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
             <div className="p-4 border-b border-slate-700 bg-slate-900/50">
               <h3 className="text-white font-bold">Listing Distribution by Area</h3>
             </div>
             <table className="w-full text-left">
               <thead className="bg-slate-900 text-slate-400 text-xs uppercase">
                 <tr>
                   <th className="p-4">Area</th>
                   <th className="p-4">Count</th>
                   <th className="p-4">Percentage</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700 text-slate-300 text-sm">
                 {stats.topAreas.map((area, i) => (
                   <tr key={i} className="hover:bg-slate-700/50">
                     <td className="p-4 font-medium text-white">{area.area}</td>
                     <td className="p-4">{area.count}</td>
                     <td className="p-4 text-slate-500">
                       {Math.round((area.count / (stats.totalAds || 1)) * 100)}%
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="animate-fade-in space-y-8">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
             <h2 className="text-xl font-bold text-white mb-4">Search User</h2>
             <form onSubmit={handleUserSearch} className="flex gap-4">
               <div className="flex-1 relative">
                 <IconSearch className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                 <input 
                   type="tel" 
                   value={searchMobile} 
                   onChange={(e) => setSearchMobile(e.target.value)} 
                   placeholder="Enter Mobile Number (e.g. 9876543210 or +91...)"
                   maxLength={15}
                   className="w-full pl-10 p-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-gold outline-none"
                 />
               </div>
               <button type="submit" disabled={userLoading} className="btn-primary rounded-lg px-8">
                 {userLoading ? '...' : 'Check Status'}
               </button>
             </form>
             {searchMobile.replace(/\D/g, '').length === 10 && (
                <p className="text-xs text-slate-500 mt-2 pl-1">
                    Searching for: <span className="text-gold font-mono">{searchMobile.replace(/\D/g, '').slice(-10)}</span>
                </p>
             )}
           </div>

           {userLimit && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               {/* Permissions Card */}
               <div className="md:col-span-1 space-y-6">
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <IconUser className="w-32 h-32 text-white" />
                   </div>
                   <h3 className="text-slate-400 text-sm font-bold uppercase mb-4">User Permissions</h3>
                   <div className="mb-4">
                     <div className="text-3xl font-bold text-white mb-1">{userLimit.tier_name} Plan</div>
                     <div className="text-slate-400 text-sm">Limit: {userLimit.max_posts} Active Listings</div>
                     <div className="text-xs text-slate-500 mt-1 font-mono">{userLimit.mobile}</div>
                   </div>
                   <div className="mb-6">
                      <div className="text-sm text-slate-400 mb-1">Current Usage</div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-gold h-full" style={{ width: `${Math.min((userAds.length / userLimit.max_posts) * 100, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-slate-500">
                        <span>{userAds.length} Active</span>
                        <span>{userLimit.max_posts} Allowed</span>
                      </div>
                   </div>

                   <h4 className="text-white font-bold text-sm mb-3">Change Plan:</h4>
                   <div className="grid grid-cols-2 gap-2">
                     {TIER_PLANS.map(plan => (
                       <button 
                         key={plan.name}
                         onClick={() => handleAssignTier(plan)}
                         className={`text-xs font-bold py-2 rounded border transition-colors ${userLimit.tier_name === plan.name ? 'bg-gold text-slate-900 border-gold' : 'bg-transparent text-slate-300 border-slate-600 hover:border-white'}`}
                       >
                         {plan.name} ({plan.limit})
                       </button>
                     ))}
                   </div>
                 </div>
               </div>

               {/* Active Listings Card */}
               <div className="md:col-span-2">
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 min-h-[400px]">
                   <h3 className="text-white font-bold mb-4 flex justify-between items-center">
                     <span>Active Listings ({userAds.length})</span>
                     <button onClick={handleUserSearch} className="text-xs text-gold hover:underline">Refresh</button>
                   </h3>
                   
                   {userAds.length === 0 ? (
                     <div className="text-slate-500 text-center py-10">
                       <p className="mb-2">No active ads found for this user.</p>
                     </div>
                   ) : (
                     <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                       {userAds.map(ad => (
                         <div key={ad.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex gap-4 items-start">
                           <img src={ad.media.images[0] || 'https://via.placeholder.com/100'} className="w-20 h-20 object-cover rounded bg-slate-800" alt={ad.title} />
                           <div className="flex-1">
                             <h4 className="text-white font-bold text-sm line-clamp-1">{ad.title}</h4>
                             <div className="text-xs text-slate-400 mt-1">{ad.area} • {ad.propertyType} • <PriceFormatter price={ad.price} /></div>
                             <div className="text-xs text-slate-500 mt-2">Posted: {new Date(ad.created_at).toLocaleDateString()}</div>
                           </div>
                           <button onClick={() => handleDeleteUserAd(ad.id)} className="text-red-500 hover:text-red-400 p-2">
                             <IconX className="w-5 h-5" />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </div>

             </div>
           )}
        </div>
      )}

      {/* POST PROPERTY TAB */}
      {activeTab === 'post' && (
        <div className="animate-fade-in max-w-3xl mx-auto">
          {status.msg && (
            <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-slate-900">
            {/* ... Keep existing form fields, but render inputs nicely ... */}
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Admin Post Title" />
            </div>

            {/* Area & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                <select name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded">
                  {Object.values(Area).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-2 border rounded">
                  {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Price & Size */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
               </div>
               <div className="flex gap-2">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                   <input type="number" name="sizeValue" value={formData.size.value} onChange={handleChange} className="w-full p-2 border rounded" />
                 </div>
                 <div className="w-20">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                   <select name="sizeUnit" value={formData.size.unit} onChange={handleChange} className="w-full p-2 border rounded">
                     {Object.values(SizeUnit).map(u => <option key={u} value={u}>{u}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
              <input required type="url" name="location.googleMapsLink" value={formData.location.googleMapsLink} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            
            {/* Images */}
            <div className="border p-4 rounded bg-gray-50">
               <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 10)</label>
               <input type="file" ref={fileInputRef} onChange={handleFileSelect} multiple accept="image/*" className="hidden" id="admin-img" disabled={uploading || formData.media.images.length >= 10} />
               <div className="grid grid-cols-5 gap-2">
                 {formData.media.images.length < 10 && (
                   <label htmlFor="admin-img" className="aspect-square rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 text-2xl text-gray-400">+</label>
                 )}
                 {formData.media.images.map((url, i) => (
                   <div key={i} className="relative aspect-square">
                     <img src={url} className="w-full h-full object-cover rounded" alt={formData.title} />
                     <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"><IconX className="w-3 h-3" /></button>
                   </div>
                 ))}
               </div>
               {uploading && <p className="text-xs text-blue-600 mt-2">Uploading...</p>}
            </div>

            {/* Contact Toggle */}
            <div className="bg-gray-50 p-4 rounded border">
              <label className="flex items-center gap-2 mb-2">
                <input type="radio" name="contact.type" value={ContactType.Default} checked={formData.contact.type === ContactType.Default} onChange={() => setFormData(p => ({...p, contact: {...p.contact, type: ContactType.Default}}))} />
                <span>Default Admin Contact</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="contact.type" value={ContactType.Custom} checked={formData.contact.type === ContactType.Custom} onChange={() => setFormData(p => ({...p, contact: {...p.contact, type: ContactType.Custom}}))} />
                <span>Custom Contact</span>
              </label>
              {formData.contact.type === ContactType.Custom && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <input placeholder="Name" name="contact.name" onChange={handleChange} className="p-2 border rounded text-sm" />
                  <input placeholder="Phone" name="contact.phone" onChange={handleChange} className="p-2 border rounded text-sm" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || uploading} className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 disabled:opacity-50">
              {loading ? 'Posting...' : 'Post Admin Ad'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;

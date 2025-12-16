
import React, { useState, useRef } from 'react';
import { Area, PropertyType, SizeUnit, ContactType, ListingCategory, AMENITIES_LIST, PropertyData } from '../types';
import { PriceFormatter } from '../components/PriceFormatter';
import { saveProperty } from '../services/api';
import { processAndUploadImages } from '../utils/imageUpload';
import { IconArrowLeft, IconCheck, IconX, IconMenu } from '../components/Icons'; // IconMenu used as placeholder for upload icon
import { Link, navigate } from '../components/Link';
import { SEO } from '../components/SEO';

const PostProperty: React.FC = () => {
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
    media: { youtubeLink: '', images: [] }, // Initialize empty array
    contact: { type: ContactType.Custom, name: '', phone: '', whatsapp: '' }
  });

  const [areaInput, setAreaInput] = useState<string>(Area.Kismatpur);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'sizeValue') {
      setFormData(prev => ({ ...prev, size: { ...prev.size, value: Number(value) } }));
    } else if (name === 'sizeUnit') {
      setFormData(prev => ({ ...prev, size: { ...prev.size, unit: value as SizeUnit } }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, price: Number(value) }));
    } else if (name === 'areaInput') {
       setAreaInput(value);
       const matchedArea = Object.values(Area).find(a => a === value);
       if (matchedArea) {
         setFormData(prev => ({ ...prev, area: matchedArea }));
       }
    } else if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    } else if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else if (name === 'media.youtubeLink') {
      setFormData(prev => ({ ...prev, media: { ...prev.media, youtubeLink: value } }));
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
        alert(`You can only upload ${remainingSlots} more images. Maximum 10 allowed.`);
        return;
      }

      setUploading(true);
      setUploadProgress({ current: 0, total: files.length });

      try {
        const newImageUrls = await processAndUploadImages(files, (current, total) => {
          setUploadProgress({ current, total });
        });

        setFormData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            images: [...prev.media.images, ...newImageUrls]
          }
        }));
      } catch (error) {
        alert("Error uploading images. Please check your connection.");
        console.error(error);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        images: prev.media.images.filter((_, index) => index !== indexToRemove)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    // Validate Area
    const isValidArea = Object.values(Area).includes(areaInput as Area);
    if (!isValidArea) {
        setStatus({ type: 'error', msg: "Please select a valid locality from the list." });
        setLoading(false);
        return;
    }

    // Validate Mobile
    if(!formData.contact.phone || formData.contact.phone.length !== 10) {
       setStatus({ type: 'error', msg: "Please enter a valid 10-digit mobile number." });
       setLoading(false);
       return;
    }

    // Validate Images
    if (formData.media.images.length === 0) {
      setStatus({ type: 'error', msg: "Please upload at least one image." });
      setLoading(false);
      return;
    }

    try {
      const cleanData = {
        ...formData,
        area: areaInput as Area,
      };

      const result = await saveProperty(cleanData, false);
      if (result.success) {
        setStatus({ type: 'success', msg: result.message });
        setTimeout(() => navigate('/manage-ads'), 2000);
      } else {
        setStatus({ type: 'error', msg: result.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const sortedAreas = Object.values(Area).sort();

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <SEO 
        title="Post Free Property Ad - Rajendranagar.online"
        description="Sell or Rent your property for free in Rajendra Nagar. No brokerage, direct listing."
      />

      <Link href="/" className="flex items-center gap-1 text-slate-400 hover:text-white mb-6 text-sm">
        <IconArrowLeft /> Back to Home
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Post Your Ad (Free)</h1>
      </div>

      <div className="bg-blue-900/20 border border-blue-800 p-4 rounded-lg mb-6 text-sm text-blue-200">
        <p className="flex items-start gap-2">
          <span className="font-bold">Note:</span> 
          <span>You can post 1 free ad every 60 days. Listings automatically expire after 60 days.</span>
        </p>
      </div>

      {status.msg && (
        <div className={`p-4 mb-6 rounded border ${status.type === 'success' ? 'bg-green-900/30 border-green-800 text-green-200' : 'bg-red-900/30 border-red-800 text-red-200'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
        
        {/* Listing Type & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-slate-300 mb-2">I want to</label>
             <div className="flex gap-4">
               <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.listingCategory === ListingCategory.Sale ? 'bg-gold text-slate-900 border-gold font-bold shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-gold/50'}`}>
                 <input type="radio" name="listingCategory" value={ListingCategory.Sale} checked={formData.listingCategory === ListingCategory.Sale} onChange={() => setFormData(prev => ({...prev, listingCategory: ListingCategory.Sale}))} className="hidden" />
                 Sell
               </label>
               <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${formData.listingCategory === ListingCategory.Rent ? 'bg-gold text-slate-900 border-gold font-bold shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-gold/50'}`}>
                 <input type="radio" name="listingCategory" value={ListingCategory.Rent} checked={formData.listingCategory === ListingCategory.Rent} onChange={() => setFormData(prev => ({...prev, listingCategory: ListingCategory.Rent}))} className="hidden" />
                 Rent / Lease
               </label>
             </div>
           </div>
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Property Type</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none">
              {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Title & Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Ad Title</label>
            <input
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 3BHK Flat for Sale in Attapur"
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Locality (Searchable)</label>
            <input 
              list="area-options" 
              name="areaInput" 
              value={areaInput} 
              onChange={handleChange} 
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
              placeholder="Search Locality..."
            />
            <datalist id="area-options">
              {sortedAreas.map(a => <option key={a} value={a} />)}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {formData.listingCategory === ListingCategory.Rent ? 'Monthly Rent' : 'Price'} (Numbers only)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="number"
                required
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
              />
              {formData.price > 0 && <div className="text-right"><PriceFormatter price={formData.price} /></div>}
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Size Value</label>
              <input
                type="number"
                required
                name="sizeValue"
                value={formData.size.value || ''}
                onChange={handleChange}
                placeholder="1500"
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Unit</label>
              <select name="sizeUnit" value={formData.size.unit} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none">
                {Object.values(SizeUnit).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-300 mb-1">Facing</label>
           <input
             name="facing"
             value={formData.facing}
             onChange={handleChange}
             placeholder="e.g. East"
             className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
           />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea
            required
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AMENITIES_LIST.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 text-sm cursor-pointer text-slate-400 hover:text-white">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded border-slate-600 bg-slate-700 text-gold focus:ring-gold"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Google Maps Link (Required)</label>
            <input
              required
              type="url"
              name="location.googleMapsLink"
              value={formData.location.googleMapsLink}
              onChange={handleChange}
              placeholder="https://maps.google.com/..."
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none"
            />
        </div>

        {/* Image Upload Section */}
        <div className="border border-slate-700 p-4 rounded-xl bg-slate-800/50">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Property Images (Max 10)
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Upload clear images. We automatically convert them to WebP for fast loading.
          </p>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*"
            className="hidden"
            id="image-upload"
            disabled={uploading || formData.media.images.length >= 10}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
             {/* Upload Button */}
             {formData.media.images.length < 10 && (
               <label 
                 htmlFor="image-upload"
                 className={`aspect-square rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-slate-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <span className="text-3xl text-slate-500 mb-1">+</span>
                 <span className="text-xs text-slate-400">Add Photo</span>
               </label>
             )}

             {/* Previews */}
             {formData.media.images.map((url, idx) => (
               <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                 <img src={url} alt={`Property ${idx + 1}`} className="w-full h-full object-cover" />
                 <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <IconX className="w-3 h-3" />
                 </button>
               </div>
             ))}
          </div>

          {uploading && (
             <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
               <div 
                 className="bg-gold h-2.5 rounded-full transition-all duration-300" 
                 style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
               ></div>
               <p className="text-xs text-center mt-1 text-slate-400">
                 Converting & Uploading {uploadProgress.current}/{uploadProgress.total}...
               </p>
             </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Your Contact Details</h3>
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input 
                  required
                  placeholder="Your Name" 
                  name="contact.name" 
                  value={formData.contact.name}
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none" 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mobile Number (Unique ID)</label>
                <input 
                  required
                  type="tel"
                  placeholder="10 digit mobile number" 
                  name="contact.phone" 
                  value={formData.contact.phone}
                  onChange={handleChange} 
                  maxLength={10}
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none" 
                />
                <p className="text-xs text-slate-500 mt-1">This number will be used to manage your ad.</p>
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp (Optional)</label>
                <input 
                   type="tel"
                  placeholder="WhatsApp Number" 
                  name="contact.whatsapp" 
                  value={formData.contact.whatsapp}
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-gold outline-none" 
                />
             </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full btn-primary py-4 rounded-xl text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Post Ad Now'}
        </button>
      </form>
    </div>
  );
};

export default PostProperty;

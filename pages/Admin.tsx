import React, { useState } from 'react';
import { Area, PropertyType, SizeUnit, ContactType, AMENITIES_LIST, PropertyData } from '../types';
import { PriceFormatter } from '../components/PriceFormatter';
import { saveProperty } from '../services/api';

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  // Form State
  const [formData, setFormData] = useState<PropertyData>({
    title: '',
    area: Area.Kismatpur,
    propertyType: PropertyType.Apartment,
    size: { value: 0, unit: SizeUnit.SqFt },
    price: 0,
    facing: '',
    description: '',
    amenities: [],
    location: { googleMapsLink: '' },
    media: { youtubeLink: '', images: ['', '', '', ''] },
    contact: { type: ContactType.Default }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Neeharsh@123') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

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

  const handleImageUrlChange = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.media.images];
      newImages[index] = value;
      return {
        ...prev,
        media: { ...prev.media, images: newImages }
      };
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    try {
      // Filter out empty strings from images before saving
      const cleanData = {
        ...formData,
        media: {
          ...formData.media,
          images: formData.media.images.filter(url => url.trim() !== '')
        }
      };

      const result = await saveProperty(cleanData, password);
      if (result.success) {
        setStatus({ type: 'success', msg: result.message });
        // Reset form
        setFormData(prev => ({ 
          ...prev, 
          title: '', 
          price: 0, 
          description: '', 
          media: { ...prev.media, images: ['', '', '', ''] } 
        }));
      } else {
        setStatus({ type: 'error', msg: result.message });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

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
          <button type="submit" className="w-full bg-slate-800 text-white p-2 rounded hover:bg-slate-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Add New Property</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm text-red-500 hover:underline">Logout</button>
      </div>

      {status.msg && (
        <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Luxury 3BHK Villa in Kismatpur"
            className="w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Area & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <select name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded bg-white">
              {Object.values(Area).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-2 border rounded bg-white">
              {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Size & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
              <input
                type="number"
                required
                name="sizeValue"
                value={formData.size.value || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="sizeUnit" value={formData.size.unit} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                {Object.values(SizeUnit).map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Numbers only)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <PriceFormatter price={formData.price} />
            </div>
          </div>
        </div>

        {/* Facing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
          <input
            name="facing"
            value={formData.facing}
            onChange={handleChange}
            placeholder="e.g. East, North-East"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {AMENITIES_LIST.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
            <input
              required
              type="url"
              name="location.googleMapsLink"
              value={formData.location.googleMapsLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Link (Optional)</label>
            <input
              type="url"
              name="media.youtubeLink"
              value={formData.media.youtubeLink || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Images URLs */}
        <div className="border p-4 rounded bg-gray-50 border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs (WebP preferred)</label>
          <div className="grid grid-cols-1 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Image URL {index + 1}</label>
                <input
                  type="url"
                  placeholder={`https://example.com/image${index + 1}.webp`}
                  value={formData.media.images[index] || ''}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Enter direct URLs for up to 4 images.</p>
        </div>

        {/* Contact Info */}
        <div className="bg-gray-50 p-4 rounded border">
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Info</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="contact.type"
                value={ContactType.Default}
                checked={formData.contact.type === ContactType.Default}
                onChange={() => setFormData(prev => ({ ...prev, contact: { ...prev.contact, type: ContactType.Default } }))}
              />
              <span>Default (Admin)</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="radio"
                name="contact.type"
                value={ContactType.Custom}
                checked={formData.contact.type === ContactType.Custom}
                onChange={() => setFormData(prev => ({ ...prev, contact: { ...prev.contact, type: ContactType.Custom } }))}
              />
              <span>Custom Contact</span>
            </label>
          </div>

          {formData.contact.type === ContactType.Custom && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="Name" name="contact.name" onChange={handleChange} className="p-2 border rounded text-sm" />
              <input placeholder="Phone" name="contact.phone" onChange={handleChange} className="p-2 border rounded text-sm" />
              <input placeholder="WhatsApp" name="contact.whatsapp" onChange={handleChange} className="p-2 border rounded text-sm" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving Property...' : 'Publish Property'}
        </button>
      </form>
    </div>
  );
};

export default Admin;
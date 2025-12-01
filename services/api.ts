import { PropertyData, Property, Area, PropertyType, SizeUnit, ContactType } from '../types';

// New Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_7bgSODR4868R9hXeGoHWDUsBT8dDmSmrhB-nWU82C2QwQzPhL7F7ZDmmCEKzBx1tdw/exec";

console.log(`API Service initialized. Backend: Google Sheets.`);

// Adapter: Transform Google Sheets (Flat) Response -> App (Structured) Property
const transformToProperty = (data: any): Property => {
  // 1. Handle Images (img1..img4 columns -> media.images array)
  const images: string[] = [];
  if (data.img1) images.push(data.img1);
  if (data.img2) images.push(data.img2);
  if (data.img3) images.push(data.img3);
  if (data.img4) images.push(data.img4);
  // Fallback if 'images' is already an array
  if (Array.isArray(data.images)) images.push(...data.images);

  // 2. Handle Amenities (JSON string -> Array)
  let amenities: string[] = [];
  if (Array.isArray(data.amenities)) {
    amenities = data.amenities;
  } else if (typeof data.amenities === 'string') {
    try {
      amenities = JSON.parse(data.amenities);
    } catch (e) {
      amenities = [];
    }
  }

  // 3. Handle Contact (Flattened fields -> Object)
  // Check if custom contact details exist
  const hasCustomContact = !!(data.contact_name || (data.contact && data.contact.name));
  
  const contact = {
    type: hasCustomContact ? ContactType.Custom : ContactType.Default,
    name: data.contact_name || (data.contact ? data.contact.name : ''),
    phone: data.contact_phone || (data.contact ? data.contact.phone : ''),
    whatsapp: data.contact_whatsapp || (data.contact ? data.contact.whatsapp : '')
  };

  return {
    id: data.id ? String(data.id) : '',
    title: data.title || '',
    area: (data.area as Area) || Area.Kismatpur,
    propertyType: (data.type as PropertyType) || (data.propertyType as PropertyType) || PropertyType.Apartment,
    size: {
      value: Number(data.size_value || (data.size ? data.size.value : 0)),
      unit: (data.size_unit || (data.size ? data.size.unit : SizeUnit.SqFt)) as SizeUnit
    },
    price: Number(data.price || 0),
    facing: data.facing || '',
    description: data.description || '',
    amenities: amenities,
    location: {
      googleMapsLink: data.google_map || (data.location ? data.location.googleMapsLink : '')
    },
    media: {
      youtubeLink: data.youtube || (data.media ? data.media.youtubeLink : ''),
      images: images.filter(url => url && url.trim() !== '') // Clean empty strings
    },
    contact: contact,
    created_at: data.timestamp || new Date().toISOString()
  };
};

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    // Expecting array of objects
    return Array.isArray(data) ? data.map(transformToProperty) : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const fetchPropertiesByArea = async (area: string): Promise<Property[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?area=${encodeURIComponent(area)}`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return Array.isArray(data) ? data.map(transformToProperty) : [];
  } catch (error) {
    console.error("Fetch area error:", error);
    return [];
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?id=${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.error || !data.id) return null;
    return transformToProperty(data);
  } catch (error) {
    console.error("Fetch ID error:", error);
    return null;
  }
};

export const saveProperty = async (data: PropertyData, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Construct Payload matching the Google Script expectations
    const payload = {
      password: password, // For auth
      title: data.title,
      area: data.area,
      propertyType: data.propertyType,
      price: data.price,
      size: data.size, // { value, unit }
      facing: data.facing,
      description: data.description,
      amenities: data.amenities, // Array
      google_map: data.location.googleMapsLink,
      youtube: data.media.youtubeLink || "",
      images: data.media.images.filter(i => i), // Array of strings
      contact: {
        name: data.contact.name || "",
        phone: data.contact.phone || "",
        whatsapp: data.contact.whatsapp || ""
      },
      featured: false
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Check for success key or id (depends on script response)
    if (result.status === 'success' || result.id) {
      return { success: true, message: "Property saved successfully!" };
    } else {
      throw new Error(result.message || "Failed to save");
    }
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
};
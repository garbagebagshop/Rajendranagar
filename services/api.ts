
import { PropertyData, Property, Area, PropertyType, SizeUnit, ContactType, ListingCategory, UserLimit, DashboardStats } from '../types';
import { createClient } from "@libsql/client";
import { getEnv } from '../utils/env';

// --- Configuration ---

const TURSO_URL = getEnv('VITE_TURSO_URL');
const TURSO_AUTH_TOKEN = getEnv('VITE_TURSO_AUTH_TOKEN');

if (!TURSO_URL || !TURSO_AUTH_TOKEN) {
  console.warn("Database credentials missing. Please check .env file.");
}

// Initialize LibSQL Client
// Use a safe fallback url to prevent client creation crash, though queries will fail if auth is missing.
const client = createClient({
  url: TURSO_URL || "libsql://placeholder-url.turso.io", 
  authToken: TURSO_AUTH_TOKEN,
});

console.log(`API Service initialized.`);

// --- Type Definitions ---

// Helper to map SQL row to Application Property Object
const rowToProperty = (row: any): Property => {
  // 1. Handle Images (Support both new JSON format and old individual columns)
  let images: string[] = [];
  
  if (row.images) {
    // New Format: JSON Array
    try {
      images = JSON.parse(row.images);
    } catch (e) {
      images = [];
    }
  } else {
    // Legacy Format: Fixed columns
    if (row.img1) images.push(row.img1 as string);
    if (row.img2) images.push(row.img2 as string);
    if (row.img3) images.push(row.img3 as string);
    if (row.img4) images.push(row.img4 as string);
  }

  // 2. Handle Amenities (JSON string -> Array)
  let amenities: string[] = [];
  if (typeof row.amenities === 'string') {
    try {
      amenities = JSON.parse(row.amenities);
    } catch (e) {
      amenities = [];
    }
  }

  // 3. Handle Contact
  const hasCustomContact = !!(row.contact_name);

  return {
    id: String(row.id),
    title: row.title as string,
    area: (row.area as Area) || Area.Kismatpur,
    propertyType: (row.type as PropertyType) || PropertyType.Apartment,
    listingCategory: (row.listing_category as ListingCategory) || ListingCategory.Sale,
    size: {
      value: Number(row.size),
      unit: (row.unit as SizeUnit) || SizeUnit.SqFt
    },
    price: Number(row.price),
    facing: row.facing as string || '',
    description: row.description as string || '',
    amenities: amenities,
    location: {
      googleMapsLink: row.google_map as string || ''
    },
    media: {
      youtubeLink: row.youtube as string || '',
      images: images
    },
    contact: {
      type: hasCustomContact ? ContactType.Custom : ContactType.Default,
      name: row.contact_name as string || '',
      phone: row.contact_phone as string || '',
      whatsapp: row.contact_whatsapp as string || ''
    },
    featured: String(row.featured || 0),
    created_at: row.created_at as string || new Date().toISOString()
  };
};

// --- Database Setup ---

let dbInitPromise: Promise<void> | null = null;

const ensureTableExists = async () => {
  try {
    // Properties Table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        title TEXT,
        area TEXT,
        type TEXT,
        listing_category TEXT DEFAULT 'Sale',
        price INTEGER,
        size INTEGER,
        unit TEXT,
        facing TEXT,
        description TEXT,
        amenities TEXT,
        google_map TEXT,
        youtube TEXT,
        images TEXT,
        img1 TEXT,
        img2 TEXT,
        img3 TEXT,
        img4 TEXT,
        contact_name TEXT,
        contact_phone TEXT,
        contact_whatsapp TEXT,
        featured INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User Limits Table (For Permissions)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_limits (
        mobile TEXT PRIMARY KEY,
        max_posts INTEGER DEFAULT 1,
        tier_name TEXT DEFAULT 'Free',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Migrations
    try { await client.execute("ALTER TABLE properties ADD COLUMN listing_category TEXT DEFAULT 'Sale'"); } catch (e) {}
    try { await client.execute("ALTER TABLE properties ADD COLUMN images TEXT"); } catch (e) {}

    console.log("Database schema verified.");
  } catch (e) {
    console.error("Error creating table:", e);
    // Don't re-throw to avoid killing the app if DB is down, just log
  }
};

const ensureInitialized = () => {
  if (!dbInitPromise) {
    dbInitPromise = ensureTableExists();
  }
  return dbInitPromise;
};

// --- API Functions ---

// Cache keys
const CACHE_KEY_PROPERTIES = 'rn_properties_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Expiry Logic: 60 Days
const EXIGENCY_DAYS = 60;
const getExpiryDateStr = () => {
  const date = new Date();
  date.setDate(date.getDate() - EXIGENCY_DAYS);
  return date.toISOString();
};

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PROPERTIES);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        fetchFreshProperties().catch(console.error); 
        return data.map((p: any) => ({...p, created_at: p.created_at})); 
      }
    }
    return await fetchFreshProperties();
  } catch (error) {
    console.error("Fetch properties error:", error);
    return [];
  }
};

const fetchFreshProperties = async (): Promise<Property[]> => {
  try {
    await ensureInitialized();
    const result = await client.execute({
      sql: "SELECT * FROM properties WHERE created_at > ? ORDER BY created_at DESC",
      args: [getExpiryDateStr()]
    });
    const properties = result.rows.map(rowToProperty);
    
    localStorage.setItem(CACHE_KEY_PROPERTIES, JSON.stringify({
      data: properties,
      timestamp: Date.now()
    }));
    
    return properties;
  } catch(e) {
    console.error("SQL Fetch Error:", e);
    return [];
  }
};

export const fetchPropertiesByArea = async (area: string): Promise<Property[]> => {
  try {
    await ensureInitialized();
    const result = await client.execute({
      sql: "SELECT * FROM properties WHERE area = ? AND created_at > ? ORDER BY created_at DESC",
      args: [area, getExpiryDateStr()]
    });
    return result.rows.map(rowToProperty);
  } catch (error) {
    console.error("Fetch area error:", error);
    return [];
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    await ensureInitialized();
    const result = await client.execute({
      sql: "SELECT * FROM properties WHERE id = ?",
      args: [id]
    });
    
    if (result.rows.length === 0) return null;
    return rowToProperty(result.rows[0]);
  } catch (error) {
    console.error("Fetch ID error:", error);
    return null;
  }
};

export const fetchMyProperties = async (mobile: string): Promise<Property[]> => {
  try {
    await ensureInitialized();
    // Clean input to just digits, take last 10
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    
    // Robust search
    const result = await client.execute({
      sql: "SELECT * FROM properties WHERE REPLACE(REPLACE(REPLACE(contact_phone, ' ', ''), '-', ''), '+', '') LIKE ? ORDER BY created_at DESC",
      args: [`%${cleanMobile}`]
    });
    return result.rows.map(rowToProperty);
  } catch (error) {
    console.error("Fetch my properties error:", error);
    return [];
  }
}

export const deleteProperty = async (id: string, mobile: string): Promise<boolean> => {
  try {
    await ensureInitialized();
    // Allow admin (mobile='ADMIN') to delete or owner
    let sql = "DELETE FROM properties WHERE id = ? AND contact_phone = ?";
    let args = [id, mobile];

    if (mobile === 'ADMIN') {
        sql = "DELETE FROM properties WHERE id = ?";
        args = [id];
    }

    const result = await client.execute({ sql, args });
    localStorage.removeItem(CACHE_KEY_PROPERTIES);
    return result.rowsAffected > 0;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

// --- Admin / Permission Functions ---

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    await ensureInitialized();
    
    const totalResult = await client.execute({
      sql: "SELECT count(*) as count FROM properties WHERE created_at > ?",
      args: [getExpiryDateStr()]
    });
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayResult = await client.execute({
       sql: "SELECT count(*) as count FROM properties WHERE created_at LIKE ?",
       args: [`${todayStr}%`]
    });

    const areaResult = await client.execute({
      sql: "SELECT area, count(*) as count FROM properties WHERE created_at > ? GROUP BY area ORDER BY count DESC LIMIT 5",
      args: [getExpiryDateStr()]
    });

    return {
      totalAds: Number(totalResult.rows[0].count),
      todaysAds: Number(todayResult.rows[0].count),
      topAreas: areaResult.rows.map(row => ({ area: row.area as string, count: Number(row.count) }))
    };

  } catch (e) {
    console.error("Stats Error", e);
    return { totalAds: 0, todaysAds: 0, topAreas: [] };
  }
};

export const getUserLimit = async (mobileInput: string): Promise<UserLimit | null> => {
  try {
    await ensureInitialized();
    const cleanMobile = mobileInput.replace(/\D/g, '').slice(-10);
    
    const result = await client.execute({
      sql: "SELECT * FROM user_limits WHERE REPLACE(REPLACE(REPLACE(mobile, ' ', ''), '-', ''), '+', '') LIKE ?",
      args: [`%${cleanMobile}`]
    });
    
    if (result.rows.length === 0) return null;
    
    return {
      mobile: String(result.rows[0].mobile),
      max_posts: Number(result.rows[0].max_posts),
      tier_name: String(result.rows[0].tier_name)
    };
  } catch (e) {
    return null;
  }
};

export const updateUserLimit = async (mobileInput: string, tierName: string, maxPosts: number): Promise<boolean> => {
  try {
    await ensureInitialized();
    const cleanMobile = mobileInput.replace(/\D/g, '').slice(-10);

    const existing = await client.execute({
       sql: "SELECT mobile FROM user_limits WHERE REPLACE(REPLACE(REPLACE(mobile, ' ', ''), '-', ''), '+', '') LIKE ?",
       args: [`%${cleanMobile}`]
    });

    let targetMobile = cleanMobile;
    let sql = "";
    let args: any[] = [];

    if (existing.rows.length > 0) {
      targetMobile = existing.rows[0].mobile as string;
      sql = "UPDATE user_limits SET tier_name = ?, max_posts = ?, updated_at = CURRENT_TIMESTAMP WHERE mobile = ?";
      args = [tierName, maxPosts, targetMobile];
    } else {
      sql = "INSERT INTO user_limits (mobile, tier_name, max_posts, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
      args = [targetMobile, tierName, maxPosts];
    }

    await client.execute({ sql, args });
    return true;
  } catch (e) {
    console.error("Update Limit Error", e);
    return false;
  }
};

export const saveProperty = async (data: PropertyData, isAdmin: boolean = false): Promise<{ success: boolean; message: string }> => {
  try {
    await ensureInitialized();

    const mobileRaw = data.contact.phone || '';
    const mobile = mobileRaw.replace(/\D/g, '').slice(-10);

    if (!isAdmin) {
      if (!mobile || mobile.length < 10) {
        return { success: false, message: "Valid 10-digit mobile number required." };
      }

      const userLimit = await getUserLimit(mobile);
      
      const activeAdsResult = await client.execute({
        sql: "SELECT count(*) as count FROM properties WHERE REPLACE(REPLACE(REPLACE(contact_phone, ' ', ''), '-', ''), '+', '') LIKE ? AND created_at > ?",
        args: [`%${mobile}`, getExpiryDateStr()]
      });
      const activeAds = Number(activeAdsResult.rows[0].count);

      if (userLimit) {
        if (activeAds >= userLimit.max_posts) {
           return { success: false, message: `Limit Reached: Your ${userLimit.tier_name} plan allows ${userLimit.max_posts} active ads. You have ${activeAds}.` };
        }
      } else {
        if (activeAds >= 1) {
          return { success: false, message: "Free Limit Reached: You have already posted a free listing. Limit is 1 listing per 60 days." };
        }
      }
    }

    const id = crypto.randomUUID();
    const amenitiesJson = JSON.stringify(data.amenities);
    const imagesJson = JSON.stringify(data.media.images);
    const saveMobile = isAdmin ? (mobile || 'ADMIN') : mobile;

    const args = {
      id: id,
      title: data.title,
      area: data.area,
      type: data.propertyType,
      listing_category: data.listingCategory,
      price: data.price,
      size: data.size.value,
      unit: data.size.unit,
      facing: data.facing,
      description: data.description,
      amenities: amenitiesJson,
      google_map: data.location.googleMapsLink,
      youtube: data.media.youtubeLink || '',
      images: imagesJson,
      contact_name: data.contact.name || '',
      contact_phone: saveMobile,
      contact_whatsapp: data.contact.whatsapp || saveMobile,
      featured: 0
    };

    await client.execute({
      sql: `INSERT INTO properties (
        id, title, area, type, listing_category, price, size, unit, facing, description, amenities, 
        google_map, youtube, images, 
        contact_name, contact_phone, contact_whatsapp, featured
      ) VALUES (
        :id, :title, :area, :type, :listing_category, :price, :size, :unit, :facing, :description, :amenities,
        :google_map, :youtube, :images,
        :contact_name, :contact_phone, :contact_whatsapp, :featured
      )`,
      args: args
    });

    localStorage.removeItem(CACHE_KEY_PROPERTIES);
    return { success: true, message: "Property saved successfully!" };

  } catch (error) {
    console.error("Save error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
};

import { PropertyData, Property, Area, PropertyType, SizeUnit, ContactType } from '../types';
import { createClient } from "@libsql/client";

// --- Configuration ---

// Turso Credentials
// Note: In a production React app built with Vite/Webpack, we would use import.meta.env or process.env.
// Since this is a direct ES module browser setup, we use hardcoded values or injected globals.
const TURSO_URL = "libsql://rajendranagar-properties-vercel-icfg-fctpkxnw9kfbyxywrghysj9s.aws-ap-south-1.turso.io";
const TURSO_AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjQ2NTM3NzYsImlkIjoiOGNkYTZlYzYtZmMyZS00MzlhLThhOTMtZGEzYWVmM2FiNzE4IiwicmlkIjoiMzdkY2U2MDktMDc4Zi00NjQzLTllZDUtZjUwYjYxYWRkNzY1In0.ylfxxJmZYVxHjx-3S1ZtKIR_ajhlOSBOJR7V6dgb5zzp0cKpiKA1tIkHLvw60F6JoY-W-pxYqLodYdVvIFWTDg";

// Initialize LibSQL Client
const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN,
});

console.log(`API Service initialized. Backend: Turso (SQLite).`);

// --- Type Definitions ---

// Helper to map SQL row to Application Property Object
const rowToProperty = (row: any): Property => {
  // 1. Handle Images
  const images: string[] = [];
  if (row.img1) images.push(row.img1 as string);
  if (row.img2) images.push(row.img2 as string);
  if (row.img3) images.push(row.img3 as string);
  if (row.img4) images.push(row.img4 as string);

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
    created_at: row.created_at as string || new Date().toISOString()
  };
};

// --- Database Setup ---

let dbInitPromise: Promise<void> | null = null;

const ensureTableExists = async () => {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        title TEXT,
        area TEXT,
        type TEXT,
        price INTEGER,
        size INTEGER,
        unit TEXT,
        facing TEXT,
        description TEXT,
        amenities TEXT,
        google_map TEXT,
        youtube TEXT,
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
    console.log("Database schema verified.");
  } catch (e) {
    console.error("Error creating table:", e);
    throw e; // Re-throw to ensure we know initialization failed
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

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    // 1. Try Cache First (for speed <100ms)
    const cached = localStorage.getItem(CACHE_KEY_PROPERTIES);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        // Return cached data immediately, then fetch fresh in background
        fetchFreshProperties().catch(console.error); 
        return data.map((p: any) => ({...p, created_at: p.created_at})); 
      }
    }

    // 2. Fetch Fresh
    return await fetchFreshProperties();

  } catch (error) {
    console.error("Fetch properties error:", error);
    return [];
  }
};

const fetchFreshProperties = async (): Promise<Property[]> => {
  try {
    await ensureInitialized(); // Ensure DB is ready
    const result = await client.execute("SELECT * FROM properties ORDER BY created_at DESC");
    const properties = result.rows.map(rowToProperty);
    
    // Update Cache
    localStorage.setItem(CACHE_KEY_PROPERTIES, JSON.stringify({
      data: properties,
      timestamp: Date.now()
    }));
    
    return properties;
  } catch(e) {
    console.error("SQL Fetch Error:", e);
    throw e;
  }
};

export const fetchPropertiesByArea = async (area: string): Promise<Property[]> => {
  try {
    await ensureInitialized(); // Ensure DB is ready
    const result = await client.execute({
      sql: "SELECT * FROM properties WHERE area = ? ORDER BY created_at DESC",
      args: [area]
    });
    return result.rows.map(rowToProperty);
  } catch (error) {
    console.error("Fetch area error:", error);
    return [];
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    await ensureInitialized(); // Ensure DB is ready
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

export const saveProperty = async (data: PropertyData, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    await ensureInitialized(); // Ensure DB is ready

    const id = crypto.randomUUID();
    const amenitiesJson = JSON.stringify(data.amenities);
    
    const args = {
      id: id,
      title: data.title,
      area: data.area,
      type: data.propertyType,
      price: data.price,
      size: data.size.value,
      unit: data.size.unit,
      facing: data.facing,
      description: data.description,
      amenities: amenitiesJson,
      google_map: data.location.googleMapsLink,
      youtube: data.media.youtubeLink || '',
      img1: data.media.images[0] || '',
      img2: data.media.images[1] || '',
      img3: data.media.images[2] || '',
      img4: data.media.images[3] || '',
      contact_name: data.contact.name || '',
      contact_phone: data.contact.phone || '',
      contact_whatsapp: data.contact.whatsapp || '',
      featured: 0
    };

    await client.execute({
      sql: `INSERT INTO properties (
        id, title, area, type, price, size, unit, facing, description, amenities, 
        google_map, youtube, img1, img2, img3, img4, 
        contact_name, contact_phone, contact_whatsapp, featured
      ) VALUES (
        :id, :title, :area, :type, :price, :size, :unit, :facing, :description, :amenities,
        :google_map, :youtube, :img1, :img2, :img3, :img4,
        :contact_name, :contact_phone, :contact_whatsapp, :featured
      )`,
      args: args
    });

    // Invalidate Cache
    localStorage.removeItem(CACHE_KEY_PROPERTIES);

    return { success: true, message: "Property saved successfully to Turso!" };

  } catch (error) {
    console.error("Save error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
};
import { PropertyData, Property } from '../types';

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSVnGX1dmmR8rzbYGLaGqVFXqR2-5cCKr1t4ZhnhRpXdDyKi58NHleqpuuPjA-VuDHHA/exec";

console.log(`API Service initialized. Using Google Sheets Backend.`);

export const saveProperty = async (data: PropertyData, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Send data to Google Apps Script
    // We use no-cors if simple POST fails, but standard JSON POST usually works if GAS handles OPTIONS or we use text/plain
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', 
      },
      body: JSON.stringify({
        action: 'create',
        password: password,
        data: data
      }),
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return { success: true, message: "Property saved successfully!" };
  } catch (error) {
    console.error("Failed to save property", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProperties`);
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch error details:", error);
    return [];
  }
};

// Aliased to match generic requirements if needed, but keeping descriptive name
export const fetchPropertiesByArea = async (area: string): Promise<Property[]> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProperties&area=${encodeURIComponent(area)}`);
    if (!response.ok) throw new Error(`Failed to fetch area properties: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch area error:", error);
    return [];
  }
};

export const fetchPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getProperty&id=${id}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch property: ${response.status}`);
    }
    const data = await response.json();
    // GAS script returns {error: "Not found"} if missing
    if (data.error) return null;
    return data;
  } catch (error) {
    console.error("Fetch ID error:", error);
    return null;
  }
};
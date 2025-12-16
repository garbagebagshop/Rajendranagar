
import { getEnv } from './env';

// Utility to convert image to WebP and resize on client side
const MAX_WIDTH = 1280;
const QUALITY = 0.8;

// Config: Worker URL from Env Variables
const WORKER_URL = getEnv('VITE_WORKER_URL');

export const processAndUploadImages = async (
  files: File[], 
  onProgress: (uploadedCount: number, total: number) => void
): Promise<string[]> => {
  const uploadedUrls: string[] = [];
  let completed = 0;

  if (!WORKER_URL) {
    alert("Configuration Error: VITE_WORKER_URL is missing in .env file.");
    return [];
  }

  for (const file of files) {
    try {
      // 1. Convert to WebP
      const webpBlob = await convertToWebP(file);
      
      // 2. Upload to Cloudflare R2 via Worker
      const url = await uploadToWorker(webpBlob);
      uploadedUrls.push(url);
    } catch (error) {
      console.error(`Failed to process ${file.name}`, error);
      alert(`Upload Failed: Please check your internet connection or Worker configuration.`);
    } finally {
      completed++;
      onProgress(completed, files.length);
    }
  }

  return uploadedUrls;
};

const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize logic
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("WebP conversion failed"));
      }, 'image/webp', QUALITY);
    };

    img.onerror = (e) => reject(e);
  });
};

const uploadToWorker = async (blob: Blob): Promise<string> => {
  if (!WORKER_URL) throw new Error("Worker URL not defined");

  const response = await fetch(WORKER_URL, {
    method: 'PUT',
    body: blob,
    headers: {
      'Content-Type': 'image/webp'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Upload failed: ${errText}`);
  }

  const data = await response.json();
  return data.url;
};

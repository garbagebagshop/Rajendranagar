
export const getEnv = (key: string): string => {
  // 1. Try import.meta.env (Vite standard)
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const val = import.meta.env[key];
      if (val !== undefined && val !== null) return String(val);
    }
  } catch (e) {
    // Ignore errors accessing import.meta
  }

  // 2. Try process.env (Webpack / Node / Standard Create React App)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      const val = process.env[key];
      if (val !== undefined && val !== null) return String(val);
    }
  } catch (e) {
    // Ignore
  }

  // Return empty string if not found, rather than undefined
  return '';
};

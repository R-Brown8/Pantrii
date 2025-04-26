// Simple in-memory cache for demonstration
// For production, replace with AsyncStorage or persistent storage
const cache = {};

export async function getCached(key) {
  return cache[key] || null;
}

export async function setCached(key, value) {
  cache[key] = value;
}

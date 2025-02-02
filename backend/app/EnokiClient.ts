import { EnokiClient } from "@mysten/enoki";

if (!process.env.ENOKI_SECRET_KEY) {
  throw new Error('ENOKI_SECRET_KEY environment variable is not set');
}

console.log('🔑 Initializing Enoki client with secret key...');
console.log('Secret key exists:', !!process.env.ENOKI_SECRET_KEY);
console.log('Secret key length:', process.env.ENOKI_SECRET_KEY.length);
console.log('Secret key prefix:', process.env.ENOKI_SECRET_KEY.substring(0, 20));

export const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_SECRET_KEY,
});

console.log('✅ Enoki client initialized');
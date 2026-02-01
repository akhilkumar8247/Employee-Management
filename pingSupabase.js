import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // load .env

// Ping Supabase every 12 hours
setInterval(async () => {
  try {
    const res = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/departments`, {
      headers: {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
      }
    });
    console.log('Pinged Supabase - Status:', res.status);
  } catch (err) {
    console.error('Supabase ping failed:', err);
  }
}, 12 * 60 * 60 * 1000); // every 12 hours

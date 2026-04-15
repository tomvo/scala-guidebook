import fetch from 'node-fetch';
import Papa from 'papaparse';
import fs from 'fs/promises';
import path from 'path';

// URL of the published Google Sheets CSV
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSn74tS8Vv1mDl9TGnzrh2Z8znZQmcqgPYkJBnpwrhMlypfae99w3WtVLlo1ywWrTju6jklsXcxxg0c/pub?gid=0&single=true&output=csv';

const JSON_OUTPUT = './src/data/restaurants.json';
const GEOCODE_CACHE = './src/data/geocode-cache.json';

// Rate-limited geocoding via Nominatim (1 request per second)
async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AgriturismoscalaGuide/1.0' },
  });
  const data = await res.json();
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadGeocodeCache() {
  try {
    const raw = await fs.readFile(GEOCODE_CACHE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function saveGeocodeCache(cache) {
  await fs.mkdir(path.dirname(GEOCODE_CACHE), { recursive: true });
  await fs.writeFile(GEOCODE_CACHE, JSON.stringify(cache, null, 2));
}

async function main() {
  console.log('Fetching restaurant data...');
  const response = await fetch(CSV_URL);
  const csv = await response.text();
  const { data } = Papa.parse(csv, { header: true });

  const cache = await loadGeocodeCache();
  let cacheUpdated = false;

  const restaurants = [];
  let currentCategory = 'food';

  for (const entry of data) {
    const name = (entry.Name || '').trim();
    if (!name) continue;

    // Detect category markers (section headers without address/description)
    if ((name.toLowerCase().includes('drinks') || name.toLowerCase().includes('wine')) && !entry.Address && !entry.Description) {
      currentCategory = 'drinks';
      continue;
    }

    const address = (entry.Address || '').trim();
    const url = entry.URL || '#';
    const price = (entry.Price || '').trim();
    const description = (entry.Description || '').trim();
    const notes = (entry.Notes || '').trim();

    // Check for explicit Latitude/Longitude columns first
    let lat = entry.Latitude ? parseFloat(entry.Latitude) : null;
    let lng = entry.Longitude ? parseFloat(entry.Longitude) : null;

    // Geocode if no explicit coords and we have an address
    if ((!lat || !lng) && address) {
      if (cache[address]) {
        lat = cache[address].lat;
        lng = cache[address].lng;
      } else {
        console.log(`  Geocoding: ${address}`);
        const coords = await geocodeAddress(address);
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
          cache[address] = coords;
          cacheUpdated = true;
        } else {
          console.log(`  ⚠ Could not geocode: ${address}`);
          cache[address] = { lat: null, lng: null };
          cacheUpdated = true;
        }
        await sleep(1100); // Nominatim rate limit
      }
    }

    restaurants.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, ''),
      name,
      address,
      url,
      price,
      description,
      notes,
      category: currentCategory,
      lat: lat || null,
      lng: lng || null,
    });
  }

  if (cacheUpdated) {
    await saveGeocodeCache(cache);
    console.log('✅ Geocode cache updated');
  }

  // Save JSON for MapListings component
  await fs.mkdir(path.dirname(JSON_OUTPUT), { recursive: true });
  await fs.writeFile(JSON_OUTPUT, JSON.stringify(restaurants, null, 2));
  console.log(`✅ Saved ${restaurants.length} restaurants to ${JSON_OUTPUT}`);
}

main().catch(err => {
  console.error('❌ Error:', err);
});

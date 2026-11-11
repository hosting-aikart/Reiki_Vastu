/**
 * Live location for the checkout's delivery section.
 *
 * 1. getCurrentLocation() asks the browser for the device's position. The
 *    browser shows its own permission prompt; nothing happens without consent.
 *    It only works on HTTPS pages (and localhost).
 * 2. lookupAddress() turns the coordinates into a street address using
 *    OpenStreetMap's Nominatim service, so the form can be pre-filled.
 *    Their usage policy asks for light use (one request at a time) and
 *    attribution, which the checkout shows.
 */

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse';

/** Human-readable reasons for the browser's geolocation error codes. */
const GEOLOCATION_ERRORS = {
  1: 'Location access was blocked. You can allow it in your browser settings, or type your address below.',
  2: 'Your location could not be found right now. Please type your address below.',
  3: 'Finding your location took too long. Please try again or type your address below.'
};

export function isLocationSupported() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator && window.isSecureContext;
}

/**
 * Resolves with { latitude, longitude, accuracyMeters, capturedAt }.
 * Rejects with an Error whose message is safe to show the customer.
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!isLocationSupported()) {
      reject(new Error('Your browser cannot share your location here. Please type your address below.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          accuracyMeters: Number.isFinite(position.coords.accuracy) ? Math.round(position.coords.accuracy) : null,
          capturedAt: new Date(position.timestamp || Date.now()).toISOString()
        }),
      (error) => reject(new Error(GEOLOCATION_ERRORS[error.code] || GEOLOCATION_ERRORS[2])),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}

/**
 * Best-effort address for the coordinates, in the checkout form's field names.
 * Resolves with null if the lookup fails; the customer can always type it.
 */
export async function lookupAddress({ latitude, longitude }) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: '1',
    'accept-language': 'en'
  });

  try {
    const res = await fetch(`${NOMINATIM_REVERSE_URL}?${params}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const { address } = await res.json();
    if (!address) return null;

    const pincode = String(address.postcode || '').replace(/\s/g, '');
    return {
      line1: [address.house_number, address.road || address.pedestrian || address.residential].filter(Boolean).join(' '),
      line2: address.neighbourhood || address.suburb || address.quarter || '',
      city: address.city || address.town || address.village || address.city_district || address.county || '',
      state: address.state || '',
      pincode: /^[1-9]\d{5}$/.test(pincode) ? pincode : ''
    };
  } catch {
    return null;
  }
}

export function googleMapsUrl({ latitude, longitude }) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

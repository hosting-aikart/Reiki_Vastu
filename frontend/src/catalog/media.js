// Images uploaded in the admin panel are stored by the backend and saved in
// content as "/api/media/<id>". The backend may live on another domain
// (VITE_API_URL), so those addresses are completed here before display.
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export function resolveMediaUrl(url) {
  if (typeof url !== 'string' || !url) return url || null;
  return url.startsWith('/api/media/') ? `${API_BASE_URL}${url}` : url;
}

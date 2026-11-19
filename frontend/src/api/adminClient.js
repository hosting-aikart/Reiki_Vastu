/**
 * Administrative API Client for Reiki & Vaastu World.
 * Sends credentials (httpOnly cookie) with every request.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    credentials: 'include', // Ensures the admin_token cookie is transmitted
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        code: data?.error?.code || 'ERROR',
        message: data?.error?.message || 'A server error occurred. Please try again.',
        fields: data?.error?.fields || null
      };
    }

    return {
      success: true,
      status: res.status,
      data: data?.data,
      message: data?.message
    };
  } catch (err) {
    return {
      success: false,
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Failed to connect to the backend server. Please verify your connection.'
    };
  }
}

// ── Auth API ────────────────────────────────────────────────
export async function adminLogin(credentials) {
  return request('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export async function adminLogout() {
  return request('/api/admin/auth/logout', {
    method: 'POST'
  });
}

export async function getAdminProfile() {
  return request('/api/admin/auth/me');
}

// ── Overview / Stats API ────────────────────────────────────
export async function getOverviewStats() {
  return request('/api/admin/overview/stats');
}

// ── Enquiries API ───────────────────────────────────────────
export async function listEnquiries(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.location && params.location !== 'all') query.append('location', params.location);
  if (params.search) query.append('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/api/admin/enquiries${qs}`);
}

export async function getEnquiryById(id) {
  return request(`/api/admin/enquiries/${id}`);
}

export async function updateEnquiryStatus(id, status) {
  return request(`/api/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function addEnquiryNote(id, content) {
  return request(`/api/admin/enquiries/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ content })
  });
}

export async function setFollowUpDate(id, followUpDate) {
  return request(`/api/admin/enquiries/${id}/followup`, {
    method: 'PATCH',
    body: JSON.stringify({ followUpDate })
  });
}

export async function deleteEnquiry(id) {
  return request(`/api/admin/enquiries/${id}`, {
    method: 'DELETE'
  });
}

// ── Testimonials API ────────────────────────────────────────
export async function listTestimonials(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.status && params.status !== 'all') query.append('status', params.status);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/api/admin/testimonials${qs}`);
}

export async function moderateTestimonial(id, payload) {
  return request(`/api/admin/testimonials/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function toggleFeaturedTestimonial(id) {
  return request(`/api/admin/testimonials/${id}/featured`, {
    method: 'PATCH'
  });
}

export async function deleteTestimonial(id) {
  return request(`/api/admin/testimonials/${id}`, {
    method: 'DELETE'
  });
}

// ── Payments API ────────────────────────────────────────────
export async function listPayments(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request(`/api/admin/payments${qs}`);
}

export async function deletePayment(id) {
  return request(`/api/admin/payments/${id}`, { method: 'DELETE' });
}

export async function recheckPayment(id) {
  return request(`/api/admin/payments/${id}/recheck`, {
    method: 'POST'
  });
}

// ── Products & Pricing API ──────────────────────────────────
export async function listAdminProducts() {
  return request('/api/admin/products');
}

export async function updateAdminProductPrice(id, payload) {
  return request(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export async function resetAdminProductPrice(id) {
  return request(`/api/admin/products/${encodeURIComponent(id)}/override`, {
    method: 'DELETE'
  });
}

// ── Website content: products, events, courses ─────────────
// kind: 'product' | 'event' | 'course'
export async function listCatalogItems(kind) {
  return request(`/api/admin/catalog/${kind}`);
}

/** Saves an item's full details. isNew: refuse to overwrite an existing item. */
export async function saveCatalogItem(kind, itemId, { data, privateData, isNew = false }) {
  return request(`/api/admin/catalog/${kind}/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    body: JSON.stringify({ data, privateData, isNew })
  });
}

export async function deleteCatalogItem(kind, itemId) {
  return request(`/api/admin/catalog/${kind}/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
}

export async function restoreCatalogItem(kind, itemId) {
  return request(`/api/admin/catalog/${kind}/${encodeURIComponent(itemId)}/restore`, { method: 'POST' });
}

/** Built-in items only: discard all admin changes. */
export async function resetCatalogItem(kind, itemId) {
  return request(`/api/admin/catalog/${kind}/${encodeURIComponent(itemId)}/reset`, { method: 'POST' });
}

export async function getEventRegistrationSummary() {
  return request('/api/admin/events/registrations/summary');
}

export async function listEventRegistrations(eventId) {
  return request(`/api/admin/events/${encodeURIComponent(eventId)}/registrations`);
}

// ── Image upload ────────────────────────────────────────────
const MAX_IMAGE_SIDE = 1600;

/**
 * Shrinks a photo to at most 1600 px on its longest side before upload, so
 * phone photos (often 5–10 MB) upload quickly and pages stay fast.
 * Returns { blob, width, height }.
 */
async function prepareImage(file) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error('This file is not an image this browser can read. Please use a JPEG, PNG or WebP photo.');
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();
  const toBlob = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  // WebP keeps transparency and is small; browsers that can't make WebP give PNG, so fall back to JPEG
  let blob = await toBlob('image/webp', 0.86);
  if (!blob || blob.type !== 'image/webp') blob = await toBlob('image/jpeg', 0.88);
  if (!blob) throw new Error('Could not process this image.');
  return { blob, width, height };
}

/** Uploads one image file. Returns { success, data: { url, width, height } } or { success: false, message }. */
export async function uploadImage(file) {
  let prepared;
  try {
    prepared = await prepareImage(file);
  } catch (err) {
    return { success: false, message: err.message };
  }
  const query = `?width=${prepared.width}&height=${prepared.height}`;
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/media${query}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': prepared.blob.type },
      body: prepared.blob
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, message: data?.error?.message || 'Upload failed. Please try again.' };
    }
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: 'Upload failed: could not reach the server.' };
  }
}

export default {
  listCatalogItems,
  saveCatalogItem,
  deleteCatalogItem,
  restoreCatalogItem,
  resetCatalogItem,
  getEventRegistrationSummary,
  listEventRegistrations,
  uploadImage,
  listPayments,
  recheckPayment,
  deletePayment,
  listAdminProducts,
  updateAdminProductPrice,
  resetAdminProductPrice,
  adminLogin,
  adminLogout,
  getAdminProfile,
  getOverviewStats,
  listEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  setFollowUpDate,
  deleteEnquiry,
  listTestimonials,
  moderateTestimonial,
  toggleFeaturedTestimonial,
  deleteTestimonial
};

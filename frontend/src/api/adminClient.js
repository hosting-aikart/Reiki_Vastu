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

export default {
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

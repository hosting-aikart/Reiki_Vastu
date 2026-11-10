/**
 * API client for Reiki & Vaastu World frontend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function submitEnquiry(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    }

    if (res.status === 422 && data?.error) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message: data.error.message || 'Validation failed. Please review your entries.',
        fields: data.error.fields || {}
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        code: 'RATE_LIMITED',
        message: data?.error?.message || 'Too many submissions. Please wait a few minutes before trying again.'
      };
    }

    return {
      success: false,
      code: 'SERVER_ERROR',
      message: data?.message || data?.error?.message || 'Server error occurred. Please try again or call our center directly.'
    };
  } catch {
    return {
      success: false,
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to the server. Please check your connection or contact our helpline directly at 8446656677.'
    };
  }
}

export async function fetchApprovedTestimonials(limit = 20) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/testimonials?limit=${encodeURIComponent(limit)}`);
    const data = await res.json().catch(() => null);

    if (res.ok && data?.success && Array.isArray(data.data)) {
      return {
        success: true,
        data: data.data
      };
    }

    return {
      success: false,
      data: []
    };
  } catch {
    return {
      success: false,
      data: []
    };
  }
}

export async function submitTestimonial(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return {
        success: true,
        message:
          data.message ||
          'Thank you for sharing your experience! Your story will be featured after verification.'
      };
    }

    if (res.status === 422 && data?.error) {
      return {
        success: false,
        code: 'VALIDATION_ERROR',
        message: data.error.message || 'Validation failed. Please review your entries.',
        fields: data.error.fields || {}
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        code: 'RATE_LIMITED',
        message:
          data?.error?.message ||
          'Too many submissions. Please wait a few minutes before trying again.'
      };
    }

    return {
      success: false,
      code: 'SERVER_ERROR',
      message:
        data?.message ||
        data?.error?.message ||
        'Server error occurred. Please try again later.'
    };
  } catch {
    return {
      success: false,
      code: 'NETWORK_ERROR',
      message:
        'Unable to connect to the server. Please check your connection and try again.'
    };
  }
}

export default {
  submitEnquiry,
  fetchApprovedTestimonials,
  submitTestimonial
};

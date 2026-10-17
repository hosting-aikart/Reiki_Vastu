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

export default {
  submitEnquiry
};

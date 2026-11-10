/**
 * Payment API client.
 *
 * Note what is NOT sent: no amount and no price. The browser names a product
 * and a quantity; the server calculates the amount from its own catalog.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return { success: true, status: res.status, data: data.data };
    }

    return {
      success: false,
      status: res.status,
      code: data?.error?.code || 'SERVER_ERROR',
      message: data?.error?.message || 'Something went wrong. Please try again.',
      fields: data?.error?.fields || null
    };
  } catch {
    return {
      success: false,
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Please check your connection and try again.'
    };
  }
}

export function getProducts() {
  return request('/api/products');
}

/**
 * Starts a payment. `customer` holds the delivery details:
 * { name, phone, email, address: { line1, line2, city, state, pincode } }.
 */
export function createPaymentOrder({ productId, quantity, idempotencyKey, customer }) {
  return request('/api/payments/orders', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, idempotencyKey, customer })
  });
}

/**
 * Forwards Checkout's success response to the server for verification.
 * The browser reports what Razorpay told it; the server decides what it means.
 */
export function verifyPayment({ statusToken, checkoutResponse }) {
  return request('/api/payments/verify', {
    method: 'POST',
    body: JSON.stringify({
      statusToken,
      razorpay_order_id: checkoutResponse.razorpay_order_id,
      razorpay_payment_id: checkoutResponse.razorpay_payment_id,
      razorpay_signature: checkoutResponse.razorpay_signature
    })
  });
}

export function getPaymentStatus(statusToken) {
  return request(`/api/payments/${encodeURIComponent(statusToken)}/status`, { cache: 'no-store' });
}

export default {
  getProducts,
  createPaymentOrder,
  verifyPayment,
  getPaymentStatus
};

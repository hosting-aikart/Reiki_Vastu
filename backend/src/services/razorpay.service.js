import Razorpay from 'razorpay';
import env from '../config/env.js';

// The SDK sets no request timeout, so without this a hung connection would hang the customer's request.
const REQUEST_TIMEOUT_MS = 10000;

let client = null;
let isTestMock = false;
let clientKey = null;

/**
 * Builds the client on first use (or when credentials change). The SDK throws
 * without a key, so building it at import time would stop the whole site from starting.
 */
function getClient() {
  const currentKey = `${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`;
  if (!client || (!isTestMock && clientKey !== currentKey)) {
    client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET
    });
    clientKey = currentKey;
  }
  return client;
}

/**
 * For testing purposes: allows injecting a mock client so tests never reach Razorpay.
 */
export function setTestRazorpayClient(mockClient) {
  client = mockClient;
  isTestMock = Boolean(mockClient);
}

/**
 * A safe, predictable failure from Razorpay.
 *
 * The SDK rejects with a plain object ({ statusCode, error }) rather than an
 * Error, and raises a TypeError when there is no HTTP response at all. Both
 * are converted here so that neither reaches the central error handler, which
 * would otherwise relay Razorpay's status code to the customer.
 */
export class RazorpayError extends Error {
  constructor(message, { code, statusCode = null } = {}) {
    super(message);
    this.name = 'RazorpayError';
    this.code = code;
    this.providerStatusCode = statusCode;
  }
}

function toRazorpayError(err) {
  if (err instanceof RazorpayError) {
    return err;
  }
  if (err?.statusCode) {
    return new RazorpayError(err.error?.description || 'Razorpay rejected the request.', {
      code: err.error?.code || 'RAZORPAY_API_ERROR',
      statusCode: err.statusCode
    });
  }
  return new RazorpayError('Could not reach Razorpay.', { code: 'RAZORPAY_NETWORK_ERROR' });
}

function withTimeout(promise, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new RazorpayError('Timed out waiting for Razorpay.', { code: 'RAZORPAY_TIMEOUT' }));
    }, timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Creates a Razorpay order. Always rejects with a RazorpayError on failure.
 */
export async function createRazorpayOrder(params, timeoutMs = REQUEST_TIMEOUT_MS) {
  try {
    return await withTimeout(getClient().orders.create(params), timeoutMs);
  } catch (err) {
    throw toRazorpayError(err);
  }
}

/**
 * Fetches every payment attempt made against an order (successful and failed).
 * This is Razorpay's own record, so it is the authority on what happened.
 */
export async function fetchOrderPayments(orderId, timeoutMs = REQUEST_TIMEOUT_MS) {
  try {
    const result = await withTimeout(getClient().orders.fetchPayments(orderId), timeoutMs);
    return result?.items || [];
  } catch (err) {
    throw toRazorpayError(err);
  }
}

export default {
  createRazorpayOrder,
  fetchOrderPayments,
  setTestRazorpayClient,
  RazorpayError
};

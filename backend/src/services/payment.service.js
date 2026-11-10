import crypto from 'crypto';
import env, { isPaymentConfigured, isPaymentTestMode } from '../config/env.js';
import { CURRENCY, findProduct } from '../config/products.js';
import Payment, { PAYMENT_STATUS } from '../models/Payment.js';
import { createRazorpayOrder } from './razorpay.service.js';
import logger from '../utils/logger.js';

const DUPLICATE_KEY_ERROR = 11000;

/**
 * An expected failure with a message that is safe to show the customer.
 * The central error handler reads statusCode and code from it.
 */
export class PaymentError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'PaymentError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

/** Format: RVP-YYMMDD-XXXXXXXX. Doubles as Razorpay's `receipt`, which must be unique. */
function generatePaymentReference() {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `RVP-${date}-${suffix}`;
}

function assertPaymentsAvailable() {
  if (!isPaymentConfigured()) {
    throw new PaymentError(503, 'PAYMENTS_UNCONFIGURED', 'Online payments are not available at the moment.');
  }
  if (!isPaymentTestMode()) {
    logger.error('Payment refused: RAZORPAY_KEY_ID is not a Test Mode key.');
    throw new PaymentError(503, 'PAYMENTS_TEST_MODE_ONLY', 'Online payments are not available at the moment.');
  }
}

/**
 * The server's own price calculation. The browser's only inputs are which
 * product and how many; nothing it sends can affect the amount.
 */
function priceOrder(productId, quantity) {
  const product = findProduct(productId);

  if (!product) {
    throw new PaymentError(404, 'PRODUCT_NOT_FOUND', 'This product does not exist.');
  }
  if (!product.available) {
    throw new PaymentError(409, 'PRODUCT_UNAVAILABLE', 'This product is currently unavailable.');
  }
  if (quantity > product.maxQuantity) {
    throw new PaymentError(422, 'QUANTITY_LIMIT_EXCEEDED', `You can buy at most ${product.maxQuantity} of this product.`);
  }

  return { product, amountPaise: product.unitPricePaise * quantity };
}

/** Only what Checkout needs. Never includes the key secret or the idempotency key. */
function toCheckoutResponse(payment) {
  return {
    reference: payment.reference,
    statusToken: payment.statusToken,
    status: payment.status,
    razorpayOrderId: payment.razorpayOrderId,
    razorpayKeyId: env.RAZORPAY_KEY_ID,
    amountPaise: payment.amountPaise,
    currency: payment.currency,
    product: {
      id: payment.product.id,
      name: payment.product.name,
      unitPricePaise: payment.product.unitPricePaise,
      isPlaceholder: payment.product.isPlaceholder
    },
    quantity: payment.quantity
  };
}

/**
 * Answers a repeated request: the same key must give the same order, so a
 * double click or network retry cannot create a second payable order.
 */
function sameCustomer(stored, submitted) {
  const fields = (c) => [c?.name, c?.phone, c?.email, c?.address?.line1, c?.address?.line2 || '', c?.address?.city, c?.address?.state, c?.address?.pincode];
  return JSON.stringify(fields(stored)) === JSON.stringify(fields(submitted));
}

function resolveRepeatedRequest(existing, { productId, quantity, customer }) {
  if (existing.product.id !== productId || existing.quantity !== quantity || !sameCustomer(existing.customer, customer)) {
    throw new PaymentError(409, 'IDEMPOTENCY_KEY_REUSED', 'This checkout was already started with different details.');
  }

  switch (existing.status) {
    case PAYMENT_STATUS.PENDING:
    case PAYMENT_STATUS.FAILED:
      return toCheckoutResponse(existing);
    case PAYMENT_STATUS.PAID:
      throw new PaymentError(409, 'PAYMENT_ALREADY_COMPLETED', 'This payment has already been completed.');
    case PAYMENT_STATUS.ORDER_FAILED:
      throw new PaymentError(409, 'ORDER_CREATION_FAILED', 'This checkout could not be started. Please try again.');
    default: // CREATED: the first request is still talking to Razorpay
      throw new PaymentError(409, 'ORDER_IN_PROGRESS', 'This checkout is already being prepared.');
  }
}

/**
 * Saves the payment record. Returns null if a concurrent request with the same
 * key won the race; the unique index makes that a clean, detectable outcome.
 */
async function saveNewPayment(fields) {
  try {
    return await Payment.create(fields);
  } catch (err) {
    if (err.code === DUPLICATE_KEY_ERROR && err.keyPattern?.idempotencyKey) {
      return null;
    }
    throw err;
  }
}

/**
 * Records that Razorpay refused the order. Failing to record this is not
 * fatal: the record simply stays CREATED, which still means "never payable".
 */
async function markOrderFailed(payment, razorpayError) {
  try {
    await Payment.transition(payment._id, PAYMENT_STATUS.ORDER_FAILED, {
      failedAt: new Date(),
      failure: { code: razorpayError.code, description: razorpayError.message }
    });
  } catch (err) {
    logger.error(`Could not mark payment ${payment.reference} as ORDER_FAILED:`, err);
  }
}

/**
 * Creates a payment record and its Razorpay order.
 *
 * The record is written first so that every Razorpay order we create can be
 * traced back to a record, even if a later step fails.
 *
 * Returns { payment, created }. `created` is false for a repeated request.
 */
export async function createPaymentOrder({ productId, quantity, idempotencyKey, customer }) {
  assertPaymentsAvailable();

  const { product, amountPaise } = priceOrder(productId, quantity);

  const existing = await Payment.findOne({ idempotencyKey });
  if (existing) {
    return { payment: resolveRepeatedRequest(existing, { productId, quantity, customer }), created: false };
  }

  const payment = await saveNewPayment({
    reference: generatePaymentReference(),
    statusToken: crypto.randomUUID(),
    idempotencyKey,
    product: {
      id: product.id,
      name: product.name,
      unitPricePaise: product.unitPricePaise,
      isPlaceholder: product.isPlaceholder
    },
    quantity,
    amountPaise,
    currency: CURRENCY,
    customer
  });

  if (!payment) {
    const winner = await Payment.findOne({ idempotencyKey });
    return { payment: resolveRepeatedRequest(winner, { productId, quantity, customer }), created: false };
  }

  let order;
  try {
    order = await createRazorpayOrder({
      amount: amountPaise,
      currency: CURRENCY,
      receipt: payment.reference,
      notes: {
        paymentReference: payment.reference,
        productId: product.id,
        quantity: String(quantity)
      }
    });
  } catch (err) {
    logger.error(`Razorpay order creation failed for ${payment.reference} [${err.code}]:`, err);
    await markOrderFailed(payment, err);
    throw new PaymentError(502, 'PAYMENT_PROVIDER_ERROR', 'We could not start the payment. You have not been charged. Please try again.');
  }

  // If this write fails, the error reaches the customer before Checkout opens.
  // The order exists at Razorpay, but its id was never shared, so nobody can pay it.
  const updated = await Payment.transition(payment._id, PAYMENT_STATUS.PENDING, {
    razorpayOrderId: order.id,
    orderCreatedAt: new Date()
  });

  if (!updated) {
    throw new Error(`Payment ${payment.reference} was not in a state that allows PENDING.`);
  }

  logger.info(`Payment order created: ${updated.reference} [${updated.razorpayOrderId}]`);

  return { payment: toCheckoutResponse(updated), created: true };
}

export default {
  createPaymentOrder,
  PaymentError
};

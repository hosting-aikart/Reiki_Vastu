import mongoose from 'mongoose';
import { z } from 'zod';
import Payment, { PAYMENT_STATUS } from '../models/Payment.js';
import { reconcilePayment } from '../services/paymentConfirmation.service.js';
import { RazorpayError } from '../services/razorpay.service.js';
import logger from '../utils/logger.js';

// Everything an administrator needs to fulfil and investigate an order.
// Internal-only fields (statusToken, idempotencyKey) are never sent.
const ADMIN_FIELDS = [
  'reference',
  'status',
  'product',
  'quantity',
  'amountPaise',
  'currency',
  'customer',
  'razorpayCustomer',
  'razorpayOrderId',
  'razorpayPaymentId',
  'confirmedVia',
  'verification.signatureVerified',
  'review',
  'failure',
  'notification',
  'createdAt',
  'orderCreatedAt',
  'paidAt',
  'failedAt',
  'updatedAt'
].join(' ');

// Query strings are validated, so a filter like ?status[$ne]=PAID can't
// become a MongoDB operator.
const listQuerySchema = z.object({
  status: z.enum(['all', ...Object.values(PAYMENT_STATUS)]).optional().default('all'),
  search: z.string().trim().max(100).optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function listPayments(req, res, next) {
  try {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payment filter.' }
      });
    }
    const { status, search, page, limit } = parsed.data;

    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }
    if (search) {
      const pattern = { $regex: escapeRegex(search), $options: 'i' };
      filter.$or = [
        { reference: pattern },
        { 'customer.name': pattern },
        { 'customer.phone': pattern },
        { 'customer.email': pattern },
        { razorpayOrderId: pattern },
        { razorpayPaymentId: pattern }
      ];
    }

    const [payments, total, statusCounts] = await Promise.all([
      Payment.find(filter)
        .select(ADMIN_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Payment.countDocuments(filter),
      Payment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);

    const counts = Object.fromEntries(Object.values(PAYMENT_STATUS).map((s) => [s, 0]));
    for (const { _id, count } of statusCounts) {
      counts[_id] = count;
    }

    res.status(200).json({
      success: true,
      data: {
        payments,
        counts,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Asks Razorpay for the order's latest state and updates the record, e.g. for
 * a payment left PENDING because the customer closed the browser and no
 * webhook arrived.
 */
export async function recheckPayment(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Payment not found.' } });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Payment not found.' } });
    }

    let updated;
    try {
      updated = await reconcilePayment(payment, 'reconciliation');
    } catch (err) {
      if (!(err instanceof RazorpayError)) throw err;
      logger.warn(`Admin re-check could not reach Razorpay for ${payment.reference} [${err.code}].`);
      return res.status(502).json({
        success: false,
        error: { code: 'PAYMENT_PROVIDER_ERROR', message: 'Could not reach Razorpay. Please try again shortly.' }
      });
    }

    const fresh = await Payment.findById(updated._id).select(ADMIN_FIELDS).lean();
    logger.info(`Payment ${payment.reference} re-checked by ${req.admin.name}: ${payment.status} -> ${fresh.status}`);

    res.status(200).json({
      success: true,
      data: { payment: fresh },
      message:
        fresh.status === payment.status
          ? `Razorpay reports no change. Status is still ${fresh.status}.`
          : `Status updated from ${payment.status} to ${fresh.status}.`
    });
  } catch (err) {
    next(err);
  }
}

export default {
  listPayments,
  recheckPayment
};

import { createPaymentOrder } from '../services/payment.service.js';
import { getPaymentStatus, verifyCheckoutPayment } from '../services/paymentConfirmation.service.js';
import { statusTokenSchema } from '../validators/payment.schema.js';

export async function createOrder(req, res, next) {
  try {
    const { payment, created } = await createPaymentOrder(req.body);

    res.status(created ? 201 : 200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { payment, confirmationDelayed } = await verifyCheckoutPayment(req.body);

    // 202 Accepted: the callback was genuine, but Razorpay has not confirmed capture yet
    res.status(confirmationDelayed ? 202 : 200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
}

export async function getStatus(req, res, next) {
  try {
    const parsed = statusTokenSchema.safeParse(req.params.statusToken);
    if (!parsed.success) {
      return res.status(404).json({
        success: false,
        error: { code: 'PAYMENT_NOT_FOUND', message: 'Payment not found.' }
      });
    }

    const payment = await getPaymentStatus(parsed.data);

    res.set('Cache-Control', 'no-store'); // a status must never be served stale from a cache
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (err) {
    next(err);
  }
}

export default {
  createOrder,
  verifyPayment,
  getStatus
};

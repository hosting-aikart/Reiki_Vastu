import { isPaymentConfigured, isPaymentTestMode } from '../config/env.js';
import { CURRENCY, PRICES_CONFIRMED, PRODUCTS, syncProductPricesFromDB } from '../config/products.js';

export async function listProducts(req, res, next) {
  try {
    await syncProductPricesFromDB();

    const products = PRODUCTS.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      unitPricePaise: product.unitPricePaise,
      originalPricePaise: product.originalPricePaise,
      currency: CURRENCY,
      maxQuantity: product.maxQuantity,
      available: product.available,
      isPlaceholder: product.isPlaceholder
    }));

    res.status(200).json({
      success: true,
      data: {
        products,
        paymentsEnabled: isPaymentConfigured(),
        testMode: isPaymentTestMode(),
        pricesConfirmed: PRICES_CONFIRMED
      }
    });
  } catch (err) {
    next(err);
  }
}

export default {
  listProducts
};

import { isPaymentConfigured, isPaymentTestMode } from '../config/env.js';
import { CURRENCY, PRODUCTS } from '../config/products.js';

export function listProducts(req, res) {
  const products = PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    unitPricePaise: product.unitPricePaise,
    currency: CURRENCY,
    maxQuantity: product.maxQuantity,
    available: product.available,
    isPlaceholder: product.isPlaceholder
  }));

  res.status(200).json({
    success: true,
    data: {
      products,
      paymentsEnabled: isPaymentConfigured() && isPaymentTestMode()
    }
  });
}

export default {
  listProducts
};

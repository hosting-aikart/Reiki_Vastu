import ProductPrice from '../models/ProductPrice.js';
import {
  CURRENCY,
  PRODUCTS,
  findProduct,
  applyProductOverride,
  resetProductToDefault,
  syncProductPricesFromDB
} from '../config/products.js';
import logger from '../utils/logger.js';

function formatAdminProduct(product) {
  const isCustomized =
    product.unitPricePaise !== product.defaultUnitPricePaise ||
    product.originalPricePaise !== product.defaultOriginalPricePaise ||
    product.available !== product.defaultAvailable;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    unitPricePaise: product.unitPricePaise,
    originalPricePaise: product.originalPricePaise,
    defaultUnitPricePaise: product.defaultUnitPricePaise,
    defaultOriginalPricePaise: product.defaultOriginalPricePaise,
    available: product.available,
    defaultAvailable: product.defaultAvailable,
    maxQuantity: product.maxQuantity,
    currency: CURRENCY,
    isCustomized,
    updatedAt: product.updatedAt
  };
}

export async function listAdminProducts(req, res, next) {
  try {
    await syncProductPricesFromDB();

    res.status(200).json({
      success: true,
      data: {
        products: PRODUCTS.map(formatAdminProduct)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProductPrice(req, res, next) {
  try {
    const { id } = req.params;
    const product = findProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found.'
        }
      });
    }

    const { unitPricePaise, originalPricePaise, available } = req.body;
    const nextOriginalPrice =
      originalPricePaise === undefined ? product.originalPricePaise : originalPricePaise;
    const nextAvailable =
      typeof available === 'boolean' ? available : product.available;

    const saved = await ProductPrice.findOneAndUpdate(
      { productId: product.id },
      {
        $set: {
          unitPricePaise,
          originalPricePaise: nextOriginalPrice,
          available: nextAvailable,
          updatedBy: req.admin?.email || null
        }
      },
      { upsert: true, new: true, runValidators: true }
    );

    const updated = applyProductOverride(product.id, saved);
    logger.info(
      `Admin updated product "${product.id}" price to ${unitPricePaise} paise (available=${nextAvailable})`
    );

    res.status(200).json({
      success: true,
      message: `Updated pricing for ${product.name}`,
      data: {
        product: formatAdminProduct(updated)
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function resetProductPrice(req, res, next) {
  try {
    const { id } = req.params;
    const product = findProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found.'
        }
      });
    }

    await ProductPrice.deleteOne({ productId: product.id });
    const restored = resetProductToDefault(product.id);
    logger.info(`Admin reset product "${product.id}" pricing to default (${restored.unitPricePaise} paise)`);

    res.status(200).json({
      success: true,
      message: `Reset ${product.name} to default price`,
      data: {
        product: formatAdminProduct(restored)
      }
    });
  } catch (err) {
    next(err);
  }
}

export default {
  listAdminProducts,
  updateProductPrice,
  resetProductPrice
};

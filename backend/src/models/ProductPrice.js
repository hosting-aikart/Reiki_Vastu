import mongoose from 'mongoose';

const productPriceSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    unitPricePaise: {
      type: Number,
      required: true,
      min: 100,
      validate: {
        validator: Number.isInteger,
        message: 'unitPricePaise must be an integer in paise (at least 100)'
      }
    },
    originalPricePaise: {
      type: Number,
      default: null,
      validate: {
        validator: (val) => val === null || (Number.isInteger(val) && val >= 100),
        message: 'originalPricePaise must be null or an integer in paise (at least 100)'
      }
    },
    available: {
      type: Boolean,
      default: true
    },
    updatedBy: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const ProductPrice = mongoose.models.ProductPrice || mongoose.model('ProductPrice', productPriceSchema);

export default ProductPrice;

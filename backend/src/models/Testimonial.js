import mongoose from 'mongoose';
import { STORY_SERVICES, keysOf } from '@reiki-vastu/shared';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    serviceKey: {
      type: String,
      required: true,
      enum: keysOf(STORY_SERVICES)
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    story: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    reviewedBy: {
      type: String,
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    adminNote: {
      type: String,
      maxlength: 500,
      default: null
    },
    notification: {
      adminEmailSent: { type: Boolean, default: false },
      lastError: { type: String, default: null }
    }
  },
  {
    timestamps: true
  }
);

testimonialSchema.index({ status: 1, featured: -1, createdAt: -1 });

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;

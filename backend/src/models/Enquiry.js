import mongoose from 'mongoose';
import {
  LOCATIONS,
  CONSULTATION_SERVICES,
  TIME_SLOTS,
  COURSES,
  keysOf
} from '@reiki-vastu/shared';

const enquirySchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ['consultation', 'contact', 'course'],
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },
    location: {
      type: String,
      required: true,
      enum: keysOf(LOCATIONS)
    },
    // Consultation-specific fields
    serviceKey: {
      type: String,
      enum: [...keysOf(CONSULTATION_SERVICES), null],
      default: null
    },
    preferredDate: {
      type: String, // 'YYYY-MM-DD'
      default: null
    },
    preferredSlot: {
      type: String,
      enum: [...keysOf(TIME_SLOTS), null],
      default: null
    },
    // Course-specific fields
    courseId: {
      type: String,
      enum: [...keysOf(COURSES), null],
      default: null
    },
    // Shared notes/queries
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'contacted', 'confirmed', 'completed', 'cancelled', 'spam'],
      default: 'new',
      index: true
    },
    // Admin follow-up & internal workflow fields
    notes: [
      {
        content: { type: String, required: true, trim: true, maxlength: 1000 },
        authorName: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    followUpDate: {
      type: Date,
      default: null,
      index: true
    },
    assignedTo: {
      type: String,
      trim: true,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    notification: {
      adminEmailSent: { type: Boolean, default: false },
      lastError: { type: String, default: null }
    },
    meta: {
      sourcePage: { type: String, default: '' },
      userAgent: { type: String, default: '' },
      ipHash: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ type: 1, createdAt: -1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;

import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String },
    categories: [{ type: String }],
    pricing_model: { type: String, enum: ['Free', 'Freemium', 'Paid'], default: 'Free' },
    price: { type: Number, default: null },
    rating: { type: Number, default: 4.8 },
    runnable: { type: Boolean, default: true },
    logo_url: { type: String, default: '/logo/reiki-vastu-mark.svg' },
    bannerGradient: { type: String, default: 'linear-gradient(120deg, #4dd0e1 0%, #00acc1 50%, #4dd0e1 100%)' }
  },
  { timestamps: true }
);

export default mongoose.model('Agent', AgentSchema);

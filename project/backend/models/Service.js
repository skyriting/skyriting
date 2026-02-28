import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // URL-friendly identifier
  subtitle: { type: String },
  description: { type: String, required: true },
  
  // Display Settings
  icon: { type: String, default: 'Plane' }, // Icon name from lucide-react
  imageUrl: { type: String }, // Service image URL
  images: [{ type: String }], // Additional images array
  order: { type: Number, default: 0 }, // Display order
  
  // Content
  features: [{ type: String }], // Array of feature descriptions
  deliverables: [{ type: String }], // Array of deliverables (e.g., "Industry research and analysis")
  benefits: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
  }],
  tagline: { type: String }, // e.g., "Taking you the extra mile"
  
  // Status
  isActive: { type: Boolean, default: true },
  showInNavigation: { type: Boolean, default: true }, // Show in Solutions dropdown
  
  // SEO
  metaTitle: { type: String },
  metaDescription: { type: String },
  
  // Admin tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, {
  timestamps: true,
});

// Create slug from title if not provided
serviceSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Service', serviceSchema);

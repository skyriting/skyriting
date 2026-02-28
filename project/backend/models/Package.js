import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  // Basic Information
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  tagline: { type: String }, // e.g., "Taking you the extra mile"
  
  // Display Settings
  imageUrl: { type: String },
  order: { type: Number, default: 0 },
  
  // Package Details
  packageIncludes: [{ type: String }], // Array of included items
  tourHighlights: [{ 
    icon: { type: String }, // Icon name
    text: { type: String, required: true }
  }],
  
  // Duration Options
  durationOptions: [{
    name: { type: String, required: true }, // e.g., "5N 6D", "2N 3D"
    duration: { type: String }, // e.g., "6 Days"
    days: { type: Number }, // Number of days
    nights: { type: Number }, // Number of nights
    price: { type: Number }, // Price per seat
    pricePerSeat: { type: Number }, // Price per seat (alternative field)
    currency: { type: String, default: 'INR' },
    maxPax: { type: Number },
    description: { type: String },
    availableDates: [{ type: String }], // Array of available dates (YYYY-MM-DD format)
  }],
  
  // Itinerary
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true }, // e.g., "Day 1: Arrival at Dehradun"
    description: { type: String, required: true },
    activities: [{ type: String }], // Optional activities list
    accommodation: { type: String }, // Accommodation details
    meals: { type: String }, // Meal details
  }],
  
  // Pricing
  startingPrice: { type: Number },
  currency: { type: String, default: 'INR' },
  priceNote: { type: String }, // e.g., "Starting from ₹ 2,00,000/-"
  
  // Booking Details
  dateFlexibility: { type: String, default: 'Flexible' },
  personCapacity: { type: String }, // e.g., "6 pax or less"
  
  // Package Types (for dropdown in forms)
  packageTypes: [{ type: String }], // e.g., ['engagement', 'wedding', 'conference', 'group', 'gateways', 'celebrity', 'sports']
  
  // Status
  isActive: { type: Boolean, default: true },
  showInNavigation: { type: Boolean, default: true },
  
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
packageSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Package', packageSchema);

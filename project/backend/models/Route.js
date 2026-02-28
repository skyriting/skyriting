import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  origin: { type: String, required: true }, // Airport code
  destination: { type: String, required: true }, // Airport code
  originCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  distance_km: { type: Number, required: true },
  estimatedTime_hours: { type: Number, required: true },
  routeName: { type: String }, // e.g., "Mumbai to Delhi"
  isPopular: { type: Boolean, default: false },
  bookingCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

// Compound index for fast lookups
routeSchema.index({ origin: 1, destination: 1 }, { unique: true });

export default mongoose.model('Route', routeSchema);

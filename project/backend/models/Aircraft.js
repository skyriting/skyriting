import mongoose from 'mongoose';

const aircraftSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  tailNumber: { type: String, unique: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Light', 'Mid', 'Super Mid', 'Large', 'Airliner', 'Helicopter', 'Turboprop']
  },
  type: { 
    type: String, 
    required: true,
    enum: ['Light', 'Mid', 'Super Mid', 'Large', 'Airliner', 'Helicopter', 'Turboprop']
  },
  manufacturer: { type: String, required: true },
  model: { type: String },
  
  // Pricing
  hourly_rate: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  commissionPercentage: { type: Number, default: 0, min: 0, max: 100 }, // Commission for this specific aircraft
  
  // Operating Costs (for transparent pricing)
  operatingCosts: {
    hourlyOperatingCost: { type: Number, required: true },
    fuelCostPerKm: { type: Number, default: 0 },
    crewExpensePerHour: { type: Number, default: 0 },
  },
  
  // Specifications
  specs: {
    seats: { type: Number, required: true },
    passenger_capacity: { type: Number, required: true },
    baggage: { type: String },
    baggageCapacity: { type: String }, // e.g., "74 CUFT."
    base: { type: String },
    pilots: { type: Number, default: 2 },
    speed: { type: Number, required: true },
    cruise_speed: { type: Number, required: true },
    range_km: { type: Number, required: true },
    flightAttendant: { type: Boolean, default: false },
    yearOfManufacture: { type: Number }, // YOM
    cabinHeight: { type: String }, // e.g., "4.9 FT"
    cabinWidth: { type: String }, // e.g., "4.1 FT"
    cabinLength: { type: String }, // e.g., "13.7 FT"
    lavatory: { type: Number, default: 0 }, // Number of lavatories
    flyingRange: { type: String }, // e.g., "1450 NM"
  },
  
  // Legacy fields for compatibility
  passenger_capacity: { type: Number, required: true },
  range_km: { type: Number, required: true },
  cruise_speed: { type: Number, required: true },
  
  // Media
  image_url: { type: String },
  images: [{ type: String }],
  interiorPhotos: [{ type: String }], // Array of interior photo URLs
  rangeMapImage: { type: String }, // Range map image URL
  description: { type: String },
  
  // Amenities
  amenities: [{ type: String }],
  
  // Availability
  available: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Sync specs.passenger_capacity with passenger_capacity
aircraftSchema.pre('save', function(next) {
  if (this.specs && this.specs.seats) {
    this.passenger_capacity = this.specs.seats;
  }
  if (this.specs && this.specs.speed) {
    this.cruise_speed = this.specs.speed;
  }
  next();
});

export default mongoose.model('Aircraft', aircraftSchema);

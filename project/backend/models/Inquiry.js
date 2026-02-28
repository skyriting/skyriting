import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  enquiry_type: { type: String, default: 'charter' },
  aircraft_type: { type: String, required: true },
  trip_type: { 
    type: String, 
    required: true, 
    enum: ['one-way', 'round-trip', 'multi-trip'] 
  },
  
  // Single leg fields (for one-way and round-trip)
  departure_city: { type: String },
  arrival_city: { type: String },
  departure_date: { type: Date },
  departure_time: { type: String },
  return_date: { type: Date },
  return_time: { type: String },
  
  // Multi-leg support
  legs: [{
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    paxCount: { type: Number, required: true },
    distance: { type: Number },
  }],
  
  passenger_count: { type: Number, required: true },
  
  // Customer Information
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  message: { type: String },
  
  // User reference (if logged in)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Status tracking
  status: { 
    type: String, 
    default: 'new', 
    enum: ['new', 'sourcing', 'quoted', 'converted', 'cancelled'] 
  },
  
  // Pricing
  estimated_cost: { type: Number },
  estimated_cost_breakdown: {
    baseFlyingCost: { type: Number },
    fuelSurcharge: { type: Number },
    airportFees: { type: Number },
    crewExpenses: { type: Number },
    subtotal: { type: Number },
    marginAmount: { type: Number },
    taxAmount: { type: Number },
    totalCost: { type: Number },
    currency: { type: String, default: 'USD' },
  },
  
  // Admin tracking
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  notes: { type: String },
}, {
  timestamps: true
});

export default mongoose.model('Inquiry', inquirySchema);

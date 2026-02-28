import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingNumber: { type: String, required: true, unique: true },
  quoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', required: true },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aircraftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft', required: true },
  
  // Flight Details
  flightDetails: {
    tripType: { type: String, required: true },
    legs: [{
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      departureDate: { type: Date, required: true },
      departureTime: { type: String, required: true },
      arrivalDate: { type: Date },
      arrivalTime: { type: String },
      distance: { type: Number },
      flightHours: { type: Number },
    }],
    passengerCount: { type: Number, required: true },
  },
  
  // Pricing
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'partial', 'paid', 'refunded'], 
    default: 'pending' 
  },
  paymentHistory: [{
    amount: { type: Number },
    date: { type: Date },
    method: { type: String },
    transactionId: { type: String },
  }],
  
  // Booking Status
  status: { 
    type: String, 
    enum: ['confirmed', 'scheduled', 'in-progress', 'completed', 'cancelled'], 
    default: 'confirmed' 
  },
  
  // Rescheduling
  rescheduleHistory: [{
    requestedDate: { type: Date },
    originalDate: { type: Date },
    newDate: { type: Date },
    reason: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
    processedAt: { type: Date },
  }],
  
  // Additional Info
  specialRequests: { type: String },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  
  // Admin tracking
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  notes: { type: String },
}, {
  timestamps: true
});

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK-${Date.now().toString().slice(-8)}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);

import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  quoteNumber: { type: String, required: true, unique: true },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aircraftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft', required: true },
  
  // Pricing Breakdown
  pricing: {
    baseFlyingCost: { type: Number, required: true },
    fuelSurcharge: { type: Number, default: 0 },
    airportFees: { type: Number, default: 0 },
    crewExpenses: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    marginAmount: { type: Number, default: 0 },
    marginPercentage: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
  },
  
  // Leg Details
  legs: [{
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: Date, required: true },
    departureTime: { type: String, required: true },
    distance: { type: Number },
    flightHours: { type: Number },
    legCost: { type: Number },
  }],
  
  // Quote Details
  validUntil: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'accepted', 'declined', 'expired'], 
    default: 'pending' 
  },
  terms: { type: String },
  notes: { type: String },
  
  // Admin tracking
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  sentAt: { type: Date },
  acceptedAt: { type: Date },
}, {
  timestamps: true
});

// Generate quote number before saving
quoteSchema.pre('save', async function(next) {
  if (!this.quoteNumber) {
    const count = await mongoose.model('Quote').countDocuments();
    this.quoteNumber = `SKY-${Date.now().toString().slice(-8)}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Quote', quoteSchema);

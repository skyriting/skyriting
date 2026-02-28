import mongoose from 'mongoose';

const pricingRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  
  // Margin Configuration
  marginPercentage: { type: Number, default: 0, min: 0, max: 100 },
  marginByAircraftType: {
    Light: { type: Number, default: 0 },
    Mid: { type: Number, default: 0 },
    'Super Mid': { type: Number, default: 0 },
    Large: { type: Number, default: 0 },
    Airliner: { type: Number, default: 0 },
    Helicopter: { type: Number, default: 0 },
  },
  
  // Tax Configuration
  taxRate: { type: Number, default: 0, min: 0, max: 100 },
  taxName: { type: String, default: 'Tax' },
  
  // Fee Structure
  fees: {
    fuelSurchargePerKm: { type: Number, default: 0 },
    airportFeePerLeg: { type: Number, default: 0 },
    groundHandling: { type: Number, default: 0 },
    crewExpensePerHour: { type: Number, default: 0 },
  },
  
  // Multi-leg Rules
  multiLegRules: {
    maxLegs: { type: Number, default: 10 },
    minLayoverHours: { type: Number, default: 1 },
    multiLegDiscount: { type: Number, default: 0 }, // Percentage discount for multi-leg
    applyDiscountAfterLegs: { type: Number, default: 3 }, // Apply discount after N legs
  },
  
  // Currency Settings
  defaultCurrency: { type: String, default: 'USD' },
  supportedCurrencies: [{ type: String }],
  exchangeRates: { type: mongoose.Schema.Types.Mixed, default: {} },
  
  // Buffer Configuration
  flightTimeBuffer: { type: Number, default: 0.5 }, // Hours buffer for flight time calculation
  
  // Applied to
  appliesTo: {
    allAircraft: { type: Boolean, default: true },
    aircraftTypes: [{ type: String }],
    specificAircraft: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aircraft' }],
  },
  
  // Validity
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
}, {
  timestamps: true
});

export default mongoose.model('PricingRule', pricingRuleSchema);

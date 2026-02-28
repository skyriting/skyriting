import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  city_name: { type: String, required: true },
  state: { type: String, required: true },
  airport_name: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  popular: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model('Airport', airportSchema);

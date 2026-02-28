import mongoose from 'mongoose';

const careerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  resume: { type: String }, // URL or link to resume
  coverLetter: { type: String },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
    default: 'new',
  },
  adminNotes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, {
  timestamps: true,
});

export default mongoose.model('CareerApplication', careerApplicationSchema);

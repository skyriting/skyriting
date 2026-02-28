import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'archived'],
    default: 'new',
  },
  adminNotes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, {
  timestamps: true,
});

export default mongoose.model('ContactInquiry', contactInquirySchema);

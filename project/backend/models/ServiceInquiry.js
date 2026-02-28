import mongoose from 'mongoose';

const serviceInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  serviceName: { type: String, required: true },
  serviceSlug: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'converted', 'archived'],
    default: 'new',
  },
  adminNotes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, {
  timestamps: true,
});

export default mongoose.model('ServiceInquiry', serviceInquirySchema);

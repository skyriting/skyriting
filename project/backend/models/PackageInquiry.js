import mongoose from 'mongoose';

const packageInquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  packageName: { type: String, required: true },
  packageSlug: { type: String, required: true },
  selectedPackage: { type: String }, // Duration option selected
  selectedPackageType: { type: String }, // Package type (engagement, wedding, etc.)
  selectedDate: { type: String },
  message: { type: String },
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

export default mongoose.model('PackageInquiry', packageInquirySchema);

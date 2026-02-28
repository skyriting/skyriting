import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  imageUrl: { type: String }, // Base64 or URL
  category: { 
    type: String, 
    enum: ['News', 'Media', 'Press Release', 'Blog', 'Industry Insights'],
    default: 'News'
  },
  author: { type: String, default: 'Skyriting Team' },
  publishedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }],
  viewCount: { type: Number, default: 0 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
}, {
  timestamps: true,
});

// Create slug from title if not provided
articleSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Article', articleSchema);

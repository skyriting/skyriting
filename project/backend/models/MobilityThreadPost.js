import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userPhoto: { type: String }, // Base64 image
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

const mobilityThreadPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userPhoto: { type: String }, // Base64 image
  content: { type: String, required: true },
  images: [{ type: String }], // Array of base64 images
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export default mongoose.model('MobilityThreadPost', mobilityThreadPostSchema);

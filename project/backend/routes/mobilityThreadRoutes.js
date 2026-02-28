import express from 'express';
import MobilityThreadPost from '../models/MobilityThreadPost.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (public, but shows user info if logged in)
router.get('/', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await MobilityThreadPost.find({ isActive: true })
      .populate('userId', 'name email profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await MobilityThreadPost.countDocuments({ isActive: true });
    
    res.json({ 
      posts, 
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await MobilityThreadPost.findById(req.params.id)
      .populate('userId', 'name email profilePhoto')
      .populate('comments.userId', 'name email profilePhoto');
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post (authenticated)
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { content, images } = req.body;
    const user = req.user;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const post = new MobilityThreadPost({
      userId: user._id,
      userName: user.name || user.email,
      userPhoto: user.profilePhoto,
      content: content.trim(),
      images: images || [],
    });
    
    await post.save();
    
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike post (authenticated)
router.post('/:id/like', authenticateUser, async (req, res) => {
  try {
    const post = await MobilityThreadPost.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.json({ 
      post, 
      isLiked: !isLiked,
      likeCount: post.likes.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment (authenticated)
router.post('/:id/comment', authenticateUser, async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    const post = await MobilityThreadPost.findById(req.params.id);
    
    if (!post || !post.isActive) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push({
      userId: user._id,
      userName: user.name || user.email,
      userPhoto: user.profilePhoto,
      content: content.trim(),
    });
    
    await post.save();
    
    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete own post (authenticated)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const post = await MobilityThreadPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    post.isActive = false;
    await post.save();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

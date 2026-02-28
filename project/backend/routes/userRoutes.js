import express from 'express';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Quote from '../models/Quote.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Get user profile (authenticated)
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile (authenticated)
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { name, phone, profilePhoto } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profilePhoto) user.profilePhoto = profilePhoto; // Base64 image
    
    await user.save();
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user bookings (authenticated)
router.get('/bookings', authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('aircraftId', 'name manufacturer model image_url')
      .sort({ createdAt: -1 });
    
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user quotes (authenticated)
router.get('/quotes', authenticateUser, async (req, res) => {
  try {
    const quotes = await Quote.find({ userId: req.user._id })
      .populate('aircraftId', 'name manufacturer model image_url')
      .populate('inquiryId')
      .sort({ createdAt: -1 });
    
    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

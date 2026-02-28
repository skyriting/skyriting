import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { sendAdminNotification } from '../utils/emailService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all inquiries (admin only - add auth middleware later)
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    
    if (email) {
      query.customer_email = email;
    }
    
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single inquiry
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create inquiry
router.post('/', optionalAuth, async (req, res) => {
  try {
    const inquiryData = {
      ...req.body,
      userId: req.user?._id,
    };
    
    // Normalize trip type
    if (inquiryData.trip_type) {
      inquiryData.trip_type = inquiryData.trip_type.replace('_', '-');
    }
    
    // Handle multi-leg trips
    if (inquiryData.trip_type === 'multi-trip' && !inquiryData.legs) {
      // Convert single leg to legs array if needed
      if (inquiryData.departure_city && inquiryData.arrival_city) {
        inquiryData.legs = [{
          origin: inquiryData.departure_city,
          destination: inquiryData.arrival_city,
          departureDate: inquiryData.departure_date,
          departureTime: inquiryData.departure_time || '00:00',
          paxCount: inquiryData.passenger_count || 1,
        }];
      }
    }
    
    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();
    
    // Send admin notification
    try {
      await sendAdminNotification({ inquiry: inquiry.toObject() });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update inquiry status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

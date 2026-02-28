import express from 'express';
import { sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Create helicopter inquiry
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, country, message } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const inquiryData = {
      fullName,
      email,
      phone: phone || '',
      country: country || 'India',
      message: message || '',
      type: 'helicopter-inquiry',
      timestamp: new Date(),
    };

    // Send admin notification
    try {
      await sendAdminNotification(inquiryData, 'helicopter-inquiry');
    } catch (emailError) {
      console.error('Failed to send helicopter inquiry notification:', emailError);
    }

    res.status(201).json({ 
      message: 'Helicopter inquiry submitted successfully. We will contact you shortly.',
      inquiry: inquiryData 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

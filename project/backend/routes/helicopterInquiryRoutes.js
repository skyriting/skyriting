import express from 'express';
import { sendAdminNotification } from '../utils/emailService.js';

import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Create helicopter inquiry
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, country, message } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const inquiry = new Inquiry({
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone || 'N/A',
      message: `${message || 'No message provided.'}\n\nCountry: ${country || 'India'}`,
      enquiry_type: 'helicopter',
      aircraft_type: 'Helicopter',
      trip_type: 'one-way',
      passenger_count: 1,
      departure_city: 'N/A',
      arrival_city: 'N/A',
    });
    
    await inquiry.save();

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

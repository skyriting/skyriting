import express from 'express';
import ContactInquiry from '../models/ContactInquiry.js';
import { sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Create contact inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }

    const inquiry = new ContactInquiry({
      name,
      email,
      phone,
      subject,
      message,
    });

    await inquiry.save();

    // Send admin notification
    try {
      await sendAdminNotification({
        type: 'contact',
        inquiry: inquiry.toObject(),
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Contact inquiry submitted successfully',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
      },
    });
  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    res.status(500).json({ error: 'Failed to submit contact inquiry' });
  }
});

// Get all contact inquiries (admin only - should be protected)
router.get('/', async (req, res) => {
  try {
    const inquiries = await ContactInquiry.find()
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');

    res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch contact inquiries' });
  }
});

// Get single contact inquiry
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch contact inquiry' });
  }
});

// Update contact inquiry status (admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(assignedTo && { assignedTo }),
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Contact inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error updating contact inquiry:', error);
    res.status(500).json({ error: 'Failed to update contact inquiry' });
  }
});

export default router;

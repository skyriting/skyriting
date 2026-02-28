import express from 'express';
import ServiceInquiry from '../models/ServiceInquiry.js';
import { sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Create service inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, serviceName, subject, message } = req.body;

    if (!name || !email || !serviceName || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, serviceName, subject, and message are required' });
    }

    const inquiry = new ServiceInquiry({
      name,
      email,
      phone,
      company,
      serviceName,
      subject,
      message,
    });

    await inquiry.save();

    // Send admin notification
    try {
      await sendAdminNotification({
        type: 'service',
        inquiry: inquiry.toObject(),
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Service inquiry submitted successfully',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        serviceName: inquiry.serviceName,
      },
    });
  } catch (error) {
    console.error('Error creating service inquiry:', error);
    res.status(500).json({ error: 'Failed to submit service inquiry' });
  }
});

// Get all service inquiries (admin only)
router.get('/', async (req, res) => {
  try {
    const inquiries = await ServiceInquiry.find()
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');

    res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching service inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch service inquiries' });
  }
});

// Get single service inquiry
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await ServiceInquiry.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({ error: 'Service inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error fetching service inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch service inquiry' });
  }
});

// Update service inquiry status (admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;

    const inquiry = await ServiceInquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(assignedTo && { assignedTo }),
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Service inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error updating service inquiry:', error);
    res.status(500).json({ error: 'Failed to update service inquiry' });
  }
});

export default router;

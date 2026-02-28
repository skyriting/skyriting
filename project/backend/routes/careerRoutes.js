import express from 'express';
import CareerApplication from '../models/CareerApplication.js';
import { sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Create career application
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, experience, resume, coverLetter } = req.body;

    if (!name || !email || !phone || !position || !experience) {
      return res.status(400).json({ error: 'Name, email, phone, position, and experience are required' });
    }

    const application = new CareerApplication({
      name,
      email,
      phone,
      position,
      experience,
      resume,
      coverLetter,
    });

    await application.save();

    // Send admin notification
    try {
      await sendAdminNotification({
        type: 'career',
        application: application.toObject(),
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Career application submitted successfully',
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        position: application.position,
      },
    });
  } catch (error) {
    console.error('Error creating career application:', error);
    res.status(500).json({ error: 'Failed to submit career application' });
  }
});

// Get all career applications (admin only)
router.get('/', async (req, res) => {
  try {
    const applications = await CareerApplication.find()
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching career applications:', error);
    res.status(500).json({ error: 'Failed to fetch career applications' });
  }
});

// Get single career application
router.get('/:id', async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!application) {
      return res.status(404).json({ error: 'Career application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Error fetching career application:', error);
    res.status(500).json({ error: 'Failed to fetch career application' });
  }
});

// Update career application status (admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;

    const application = await CareerApplication.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(assignedTo && { assignedTo }),
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Career application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Error updating career application:', error);
    res.status(500).json({ error: 'Failed to update career application' });
  }
});

export default router;

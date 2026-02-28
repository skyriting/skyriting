import express from 'express';
import PackageInquiry from '../models/PackageInquiry.js';
import { sendAdminNotification } from '../utils/emailService.js';

const router = express.Router();

// Create package inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, packageName, packageSlug, selectedPackage, selectedPackageType, selectedDate, message } = req.body;

    if (!name || !email || !phone || !packageName || !packageSlug) {
      return res.status(400).json({ error: 'Name, email, phone, packageName, and packageSlug are required' });
    }

    const inquiry = new PackageInquiry({
      name,
      email,
      phone,
      packageName,
      packageSlug,
      selectedPackage,
      selectedPackageType,
      selectedDate,
      message,
    });

    await inquiry.save();

    // Send admin notification
    try {
      await sendAdminNotification({
        type: 'package',
        inquiry: inquiry.toObject(),
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Package inquiry submitted successfully',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        packageName: inquiry.packageName,
      },
    });
  } catch (error) {
    console.error('Error creating package inquiry:', error);
    res.status(500).json({ error: 'Failed to submit package inquiry' });
  }
});

// Get all package inquiries (admin only)
router.get('/', async (req, res) => {
  try {
    const inquiries = await PackageInquiry.find()
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');

    res.json({ inquiries });
  } catch (error) {
    console.error('Error fetching package inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch package inquiries' });
  }
});

// Get single package inquiry
router.get('/:id', async (req, res) => {
  try {
    const inquiry = await PackageInquiry.findById(req.params.id)
      .populate('assignedTo', 'name email');

    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error fetching package inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch package inquiry' });
  }
});

// Update package inquiry status (admin)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminNotes, assignedTo } = req.body;

    const inquiry = await PackageInquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        ...(assignedTo && { assignedTo }),
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    res.json({ inquiry });
  } catch (error) {
    console.error('Error updating package inquiry:', error);
    res.status(500).json({ error: 'Failed to update package inquiry' });
  }
});

export default router;

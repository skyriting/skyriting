import express from 'express';
import Booking from '../models/Booking.js';
import Quote from '../models/Quote.js';
import Inquiry from '../models/Inquiry.js';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create booking from accepted quote
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { quoteId, specialRequests, contactInfo } = req.body;

    if (!quoteId) {
      return res.status(400).json({ error: 'Quote ID is required' });
    }

    const quote = await Quote.findById(quoteId)
      .populate('inquiryId')
      .populate('aircraftId');

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    if (quote.status !== 'accepted') {
      return res.status(400).json({ error: 'Quote must be accepted first' });
    }

    // Verify user owns this quote
    if (quote.userId && quote.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const inquiry = quote.inquiryId;
    const contact = contactInfo || {
      name: inquiry.customer_name || req.user.name,
      email: inquiry.customer_email || req.user.email,
      phone: inquiry.customer_phone || req.user.phone,
    };

    // Determine trip type
    let tripType = 'one-way';
    if (quote.legs.length === 2 && 
        quote.legs[0].destination === quote.legs[1].origin &&
        quote.legs[1].destination === quote.legs[0].origin) {
      tripType = 'round-trip';
    } else if (quote.legs.length > 2) {
      tripType = 'multi-trip';
    }

    // Create booking
    const booking = new Booking({
      quoteId: quote._id,
      inquiryId: inquiry._id,
      userId: req.user._id,
      aircraftId: quote.aircraftId._id,
      flightDetails: {
        tripType,
        legs: quote.legs.map(leg => ({
          origin: leg.origin,
          destination: leg.destination,
          departureDate: leg.departureDate,
          departureTime: leg.departureTime,
          distance: leg.distance,
          flightHours: leg.flightHours,
        })),
        passengerCount: inquiry.passenger_count || 1,
      },
      totalAmount: quote.pricing.totalCost,
      currency: quote.pricing.currency,
      paymentStatus: 'pending',
      status: 'confirmed',
      specialRequests,
      contactInfo: contact,
    });

    await booking.save();

    // Update inquiry status
    inquiry.status = 'converted';
    await inquiry.save();

    res.status(201).json({ booking });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user bookings
router.get('/', authenticateUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('aircraftId', 'name category manufacturer image_url')
      .populate('quoteId', 'quoteNumber')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking details
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('aircraftId')
      .populate('quoteId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify user owns this booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request reschedule
router.post('/:id/reschedule', authenticateUser, async (req, res) => {
  try {
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !reason) {
      return res.status(400).json({ error: 'New date and reason are required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Add reschedule request
    booking.rescheduleHistory.push({
      requestedDate: new Date(),
      originalDate: booking.flightDetails.legs[0]?.departureDate,
      newDate: new Date(newDate),
      reason,
      status: 'pending',
    });

    await booking.save();

    res.json({ 
      message: 'Reschedule request submitted',
      booking 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject reschedule (admin)
router.patch('/:id/reschedule/:requestId', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const request = booking.rescheduleHistory.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ error: 'Reschedule request not found' });
    }

    request.status = status;
    request.adminId = req.admin._id;
    request.processedAt = new Date();

    // If approved, update the booking dates
    if (status === 'approved' && request.newDate) {
      booking.flightDetails.legs[0].departureDate = request.newDate;
      if (request.newTime) {
        booking.flightDetails.legs[0].departureTime = request.newTime;
      }
    }

    await booking.save();

    res.json({ 
      message: `Reschedule request ${status}`,
      booking 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('aircraftId', 'name category')
      .populate('quoteId', 'quoteNumber')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status (admin)
router.patch('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

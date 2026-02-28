import express from 'express';
import Quote from '../models/Quote.js';
import Inquiry from '../models/Inquiry.js';
import Aircraft from '../models/Aircraft.js';
import { calculatePricing } from '../utils/pricingEngine.js';
import { authenticateUser, authenticateAdmin } from '../middleware/auth.js';
import { sendQuoteEmail } from '../utils/emailService.js';

const router = express.Router();

// Generate quote from inquiry
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { inquiryId, aircraftId, notes, terms } = req.body;

    if (!inquiryId || !aircraftId) {
      return res.status(400).json({ error: 'Inquiry ID and Aircraft ID are required' });
    }

    // Get inquiry
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // Get aircraft
    const aircraft = await Aircraft.findById(aircraftId);
    if (!aircraft) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }

    // Prepare legs for pricing
    let legs = [];
    if (inquiry.trip_type === 'multi-trip' && inquiry.legs && inquiry.legs.length > 0) {
      legs = inquiry.legs.map(leg => ({
        origin: leg.origin,
        destination: leg.destination,
        departureDate: leg.departureDate,
        departureTime: leg.departureTime,
        distance: leg.distance,
      }));
    } else {
      // Single leg or round trip
      legs = [{
        origin: inquiry.departure_city,
        destination: inquiry.arrival_city,
        departureDate: inquiry.departure_date,
        departureTime: inquiry.departure_time,
      }];
      
      if (inquiry.trip_type === 'round-trip' && inquiry.return_date) {
        legs.push({
          origin: inquiry.arrival_city,
          destination: inquiry.departure_city,
          departureDate: inquiry.return_date,
          departureTime: inquiry.return_time,
        });
      }
    }

    // Calculate pricing
    const pricingResult = await calculatePricing(aircraft, legs);

    // Set validity (default 7 days)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    // Create quote
    const quote = new Quote({
      inquiryId: inquiry._id,
      userId: inquiry.userId,
      aircraftId: aircraft._id,
      pricing: {
        baseFlyingCost: pricingResult.breakdown.baseFlyingCost,
        fuelSurcharge: pricingResult.breakdown.fuelSurcharge,
        airportFees: pricingResult.breakdown.airportFees,
        crewExpenses: pricingResult.breakdown.crewExpenses,
        subtotal: pricingResult.breakdown.subtotal,
        marginAmount: pricingResult.breakdown.marginAmount,
        marginPercentage: pricingResult.pricingRule.marginPercentage,
        taxAmount: pricingResult.breakdown.taxAmount,
        taxRate: pricingResult.pricingRule.taxRate,
        totalCost: pricingResult.breakdown.totalCost,
        currency: pricingResult.currency,
      },
      legs: pricingResult.legBreakdown.map(leg => ({
        origin: leg.origin,
        destination: leg.destination,
        departureDate: legs.find(l => l.origin === leg.origin && l.destination === leg.destination)?.departureDate,
        departureTime: legs.find(l => l.origin === leg.origin && l.destination === leg.destination)?.departureTime,
        distance: leg.distance,
        flightHours: leg.flightHours,
        legCost: leg.legSubtotal,
      })),
      validUntil,
      terms: terms || 'Standard terms and conditions apply.',
      notes: notes,
      createdBy: req.admin._id,
      status: 'pending',
    });

    await quote.save();

    // Update inquiry status
    inquiry.status = 'quoted';
    await inquiry.save();

    res.status(201).json({ quote });
  } catch (error) {
    console.error('Quote generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get quote details
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('inquiryId')
      .populate('aircraftId')
      .populate('userId', 'name email phone');

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.json({ quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept quote (creates booking)
router.post('/:id/accept', authenticateUser, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    if (quote.status !== 'pending' && quote.status !== 'sent') {
      return res.status(400).json({ error: 'Quote cannot be accepted' });
    }

    if (new Date() > quote.validUntil) {
      return res.status(400).json({ error: 'Quote has expired' });
    }

    // Verify user owns this quote
    if (quote.userId && quote.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create booking (will be handled by booking routes)
    quote.status = 'accepted';
    quote.acceptedAt = new Date();
    await quote.save();

    res.json({ 
      message: 'Quote accepted',
      quote,
      nextStep: 'Create booking via /api/bookings'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's quotes
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    // Verify user can only see their own quotes
    if (req.params.userId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const quotes = await Quote.find({ userId: req.params.userId })
      .populate('aircraftId', 'name category manufacturer image_url')
      .sort({ createdAt: -1 });

    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send quote via email
router.post('/:id/send', authenticateAdmin, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('inquiryId')
      .populate('aircraftId')
      .populate('userId');

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const email = quote.inquiryId?.customer_email || quote.userId?.email;
    if (!email) {
      return res.status(400).json({ error: 'No email address found' });
    }

    // Send email
    await sendQuoteEmail(quote, email);

    // Update quote status
    quote.status = 'sent';
    quote.sentAt = new Date();
    await quote.save();

    res.json({ message: 'Quote sent successfully', quote });
  } catch (error) {
    console.error('Send quote email error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all quotes (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const quotes = await Quote.find(filter)
      .populate('inquiryId', 'customer_name customer_email trip_type')
      .populate('aircraftId', 'name category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ quotes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

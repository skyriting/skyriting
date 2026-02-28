import express from 'express';
import Airport from '../models/Airport.js';

const router = express.Router();

// Get all airports
router.get('/', async (req, res) => {
  try {
    const airports = await Airport.find().sort({ popular: -1, name: 1 });
    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single airport
router.get('/:id', async (req, res) => {
  try {
    const airport = await Airport.findById(req.params.id);
    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }
    res.json(airport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create airport (admin only - add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const airport = new Airport(req.body);
    await airport.save();
    res.status(201).json(airport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update airport
router.put('/:id', async (req, res) => {
  try {
    const airport = await Airport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }
    res.json(airport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete airport
router.delete('/:id', async (req, res) => {
  try {
    const airport = await Airport.findByIdAndDelete(req.params.id);
    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }
    res.json({ message: 'Airport deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

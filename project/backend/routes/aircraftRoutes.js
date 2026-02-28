import express from 'express';
import Aircraft from '../models/Aircraft.js';

const router = express.Router();

// Get all aircraft
router.get('/', async (req, res) => {
  try {
    const aircraft = await Aircraft.find({ available: { $ne: false } })
      .sort({ hourly_rate: 1 });
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single aircraft
router.get('/:id', async (req, res) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create aircraft (admin only - add auth middleware later)
router.post('/', async (req, res) => {
  try {
    const aircraft = new Aircraft(req.body);
    await aircraft.save();
    res.status(201).json(aircraft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update aircraft
router.put('/:id', async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!aircraft) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }
    res.json(aircraft);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete aircraft
router.delete('/:id', async (req, res) => {
  try {
    const aircraft = await Aircraft.findByIdAndDelete(req.params.id);
    if (!aircraft) {
      return res.status(404).json({ error: 'Aircraft not found' });
    }
    res.json({ message: 'Aircraft deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

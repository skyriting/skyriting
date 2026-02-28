import express from 'express';
import Route from '../models/Route.js';

const router = express.Router();

// Get all routes (public) - for dropdowns
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ isPopular: -1, bookingCount: -1, routeName: 1 });
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unique origin cities
router.get('/origins', async (req, res) => {
  try {
    const origins = await Route.distinct('originCity');
    res.json({ cities: origins.sort() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unique destination cities for a given origin
router.get('/destinations/:originCity', async (req, res) => {
  try {
    const destinations = await Route.find({ originCity: req.params.originCity })
      .distinct('destinationCity');
    res.json({ cities: destinations.sort() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

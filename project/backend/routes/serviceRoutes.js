import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

// Get all active services (public route)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-createdBy -updatedBy -metaTitle -metaDescription'); // Exclude admin fields
    
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single service by slug (public route)
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).select('-createdBy -updatedBy');
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

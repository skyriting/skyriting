import express from 'express';
import Package from '../models/Package.js';

const router = express.Router();

// Get all active packages (public route)
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-createdBy -updatedBy -metaTitle -metaDescription');
    
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single package by slug (public route)
router.get('/:slug', async (req, res) => {
  try {
    const packageData = await Package.findOne({ 
      slug: req.params.slug,
      isActive: true 
    }).select('-createdBy -updatedBy');
    
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }
    
    res.json({ package: packageData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

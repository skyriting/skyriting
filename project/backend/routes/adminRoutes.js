import express from 'express';
import PricingRule from '../models/PricingRule.js';
import Inquiry from '../models/Inquiry.js';
import Quote from '../models/Quote.js';
import Booking from '../models/Booking.js';
import Aircraft from '../models/Aircraft.js';
import Route from '../models/Route.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import Article from '../models/Article.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication
router.use(authenticateAdmin);

// Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const [inquiries, quotes, bookings, aircraft] = await Promise.all([
      Inquiry.countDocuments(),
      Quote.countDocuments(),
      Booking.countDocuments(),
      Aircraft.countDocuments({ available: true }),
    ]);

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      stats: {
        totalInquiries: inquiries,
        totalQuotes: quotes,
        totalBookings: bookings,
        availableAircraft: aircraft,
      },
      recentInquiries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pricing Rules CRUD
router.get('/pricing-rules', async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ createdAt: -1 });
    res.json({ rules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pricing-rules', async (req, res) => {
  try {
    const rule = new PricingRule(req.body);
    await rule.save();
    res.status(201).json({ rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/pricing-rules/:id', async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!rule) {
      return res.status(404).json({ error: 'Pricing rule not found' });
    }
    res.json({ rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/pricing-rules/:id', async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Pricing rule not found' });
    }
    res.json({ message: 'Pricing rule deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes CRUD
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json({ routes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/routes', async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json({ route });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ route });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services CRUD
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const service = new Service(serviceData);
    await service.save();
    res.status(201).json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const serviceData = {
      ...req.body,
      updatedBy: req.user._id,
    };
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      serviceData,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Packages CRUD
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1, createdAt: -1 });
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/packages/:id', async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ package: packageData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const packageData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const newPackage = new Package(packageData);
    await newPackage.save();
    res.status(201).json({ package: newPackage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/packages/:id', async (req, res) => {
  try {
    const packageData = {
      ...req.body,
      updatedBy: req.user._id,
    };
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      packageData,
      { new: true, runValidators: true }
    );
    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ package: updatedPackage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/packages/:id', async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ message: 'Package deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Article CRUD Routes
router.get('/articles', async (req, res) => {
  try {
    const { category, featured, limit = 50, page = 1 } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const articles = await Article.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    const total = await Article.countDocuments(query);
    
    res.json({ 
      articles, 
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/articles', async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };
    const newArticle = new Article(articleData);
    await newArticle.save();
    res.status(201).json({ article: newArticle });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/articles/:id', async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      updatedBy: req.user._id,
    };
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      articleData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
     .populate('updatedBy', 'name email');
    
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ article: updatedArticle });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

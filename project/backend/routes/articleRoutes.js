import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// Get all published articles (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;
    const query = { isPublished: true };
    
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
      .select('-createdBy -updatedBy -metaTitle -metaDescription');
    
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

// Get single article by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const article = await Article.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    }).select('-createdBy -updatedBy');
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment view count
    article.viewCount += 1;
    await article.save();
    
    res.json({ article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

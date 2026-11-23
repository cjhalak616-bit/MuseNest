
const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET ALL PUBLISHED ARTICLES
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


router.get(
  '/manage',
  protect,
  authorize('author', 'admin'),
  async (req, res) => {
    try {
      const filter =
        req.user.role === 'admin'
          ? {}
          : { author: req.user._id };

      const articles = await Article.find(filter)
        .populate('author', 'name email')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        articles
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Unable to fetch articles'
      });
    }
  }
);


// GET SINGLE ARTICLE
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findOne({
      _id: req.params.id,
      status: 'published'
    }).populate('author', 'name avatar bio');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    article.views += 1;
    await article.save();

    res.json({
      success: true,
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// CREATE ARTICLE
router.post('/', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const {
      title,
      subtitle,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status,
      readTime
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content and category are required'
      });
    }

    const article = await Article.create({
      title,
      subtitle,
      content,
      excerpt,
      coverImage,
      category,
      tags,
      status: status === 'published' ? 'published' : 'draft',
      readTime,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully!',
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE ARTICLE
router.put('/:id', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      article.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own articles'
      });
    }

    const fields = [
      'title',
      'subtitle',
      'content',
      'excerpt',
      'coverImage',
      'category',
      'tags',
      'status',
      'readTime'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        article[field] = req.body[field];
      }
    });

    await article.save();

    res.json({
      success: true,
      message: 'Article updated successfully!',
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE ARTICLE
router.delete('/:id', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (
      req.user.role !== 'admin' &&
      article.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own articles'
      });
    }

    await article.deleteOne();

    res.json({
      success: true,
      message: 'Article deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

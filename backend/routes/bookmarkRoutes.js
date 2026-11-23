
const express = require('express');
const mongoose = require('mongoose');
const Article = require('../models/Article');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET MY BOOKMARKS
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        match: { status: 'published' },
        populate: {
          path: 'author',
          select: 'name avatar'
        }
      });

    res.json({
      success: true,
      bookmarks: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADD BOOKMARK
router.post('/:articleId', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findOne({
      _id: req.params.articleId,
      status: 'published'
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { bookmarks: article._id }
    });

    res.json({
      success: true,
      message: 'Article bookmarked successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// REMOVE BOOKMARK
router.delete('/:articleId', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.articleId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { bookmarks: req.params.articleId }
    });

    res.json({
      success: true,
      message: 'Bookmark removed successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

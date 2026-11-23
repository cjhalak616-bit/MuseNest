
const express = require('express');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// DASHBOARD STATISTICS
router.get('/stats', protect, authorize('author', 'admin'), async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { author: req.user._id };

    const totalArticles = await Article.countDocuments(filter);

    const publishedArticles = await Article.countDocuments({
      ...filter,
      status: 'published'
    });

    const draftArticles = await Article.countDocuments({
      ...filter,
      status: 'draft'
    });

    const articleIds = await Article.find(filter).distinct('_id');

    const comments = await Comment.countDocuments({
      article: { $in: articleIds }
    });

    const viewsResult = await Article.aggregate([
      { $match: filter },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalArticles,
        publishedArticles,
        draftArticles,
        totalViews: viewsResult[0]?.totalViews || 0,
        totalComments: comments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

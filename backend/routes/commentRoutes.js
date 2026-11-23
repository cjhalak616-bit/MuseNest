
const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET ARTICLE COMMENTS
router.get('/:articleId', async (req, res) => {
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

    const comments = await Comment.find({
      article: req.params.articleId
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADD COMMENT
router.post('/:articleId', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
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

    if (parentComment) {
      const parent = await Comment.findOne({
        _id: parentComment,
        article: article._id
      });

      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      article: article._id,
      user: req.user._id,
      content: content.trim(),
      parentComment: parentComment || null
    });

    await comment.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE COMMENT
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid comment ID'
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete this comment'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

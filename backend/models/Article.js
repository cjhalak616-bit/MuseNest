
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    subtitle: {
      type: String,
      default: ''
    },

    content: {
      type: String,
      required: true
    },

    excerpt: {
      type: String,
      default: ''
    },

    coverImage: {
      type: String,
      default: ''
    },

    category: {
      type: String,
      required: true
    },

    tags: [{
      type: String
    }],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },

    readTime: {
      type: Number,
      default: 1
    },

    views: {
      type: Number,
      default: 0
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema);

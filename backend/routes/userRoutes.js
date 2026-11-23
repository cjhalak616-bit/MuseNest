
const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET MY PROFILE
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      bio: req.user.bio,
      avatar: req.user.avatar
    }
  });
});

// UPDATE MY PROFILE
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty'
        });
      }

      req.user.name = name.trim();
    }

    if (bio !== undefined) req.user.bio = bio;
    if (avatar !== undefined) req.user.avatar = avatar;

    await req.user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        bio: req.user.bio,
        avatar: req.user.avatar
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

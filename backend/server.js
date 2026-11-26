
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const commentRoutes = require('./routes/commentRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: ['http://localhost:5173',
    'https://muse-nest-cms.vercel.app'
  ]
}));

app.use(express.json());

// DATABASE CONNECTION
connectDB();

// HOME ROUTE
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to MuseNest API!'
  });
});

// ALL API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// INVALID ROUTE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MuseNest Server running on port ${PORT}`);
});

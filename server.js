const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const { initializeAdmin } = require('./controllers/adminController');

// Import routes
const heroRoutes = require('./routes/heroRoutes');
const activityRoutes = require('./routes/activityRoutes');
const memberRoutes = require('./routes/memberRoutes');
const donationRoutes = require('./routes/donationRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const weeklyFeeRoutes = require('./routes/weeklyFeeRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadDirs = [
  './uploads',
  './uploads/hero',
  './uploads/activities',
  './uploads/members',
  './uploads/expenses',
  './uploads/experiences',
  './uploads/gallery'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (optional)
try {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ledosportsacademy:iD0xFkdX5IqDXWLK@cluster0.bpaauiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 5000, // Reduce timeout to 5 seconds
    serverSelectionTimeoutMS: 5000 // Reduce server selection timeout
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
} catch (error) {
  console.log('Running without MongoDB connection - frontend only mode');
}

// API Routes
app.use('/api/hero', heroRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/weekly-fees', weeklyFeeRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/admin', adminRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Explicitly serve api.js to ensure it's accessible
app.get('/api.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'api.js'));
});

// Route for the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize default admin account if none exists
  initializeAdmin();
});
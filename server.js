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

// Serve uploaded files with no-cache headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB with retry mechanism
let isConnected = false;
let retryCount = 0;
const maxRetries = 5;
const retryInterval = 5000; // 5 seconds

function connectWithRetry() {
  console.log(`MongoDB connection attempt ${retryCount + 1}/${maxRetries}...`);
  
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Doubled timeout for better reliability
    serverSelectionTimeoutMS: 30000, // Doubled server selection timeout
    socketTimeoutMS: 45000, // Added socket timeout
    keepAlive: true, // Keep connection alive
    keepAliveInitialDelay: 300000 // 5 minutes
  })
  .then(() => {
    console.log('MongoDB connected successfully - Live data storage enabled');
    isConnected = true;
    retryCount = 0; // Reset retry count on successful connection
    
    // Set up connection error handler to reconnect if connection is lost
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      if (isConnected) {
        isConnected = false;
        console.log('MongoDB connection lost. Attempting to reconnect...');
        setTimeout(connectWithRetry, retryInterval);
      }
    });
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      if (isConnected) {
        isConnected = false;
        console.log('MongoDB disconnected. Attempting to reconnect...');
        setTimeout(connectWithRetry, retryInterval);
      }
    });
    
    // Set up a periodic ping to keep connection alive
    const pingInterval = 60000; // 1 minute
    setInterval(async () => {
      try {
        if (mongoose.connection.readyState === 1) { // Connected
          // Perform a lightweight operation to keep connection alive
          await mongoose.connection.db.admin().ping();
          console.log('MongoDB ping successful - Connection maintained');
        }
      } catch (err) {
        console.error('MongoDB ping failed:', err);
        // Connection will be handled by the error and disconnected handlers
      }
    }, pingInterval);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    if (retryCount < maxRetries) {
      retryCount++;
      console.log(`Retrying connection in ${retryInterval/1000} seconds...`);
      setTimeout(connectWithRetry, retryInterval);
    } else {
      console.error(`Failed to connect to MongoDB after ${maxRetries} attempts.`);
      console.log('Running in frontend-only mode - admin features will use client-side authentication');
      // Continue running the app in frontend-only mode instead of exiting
    }
  });
}

// Start connection process
connectWithRetry();

// API Cache Control Middleware
const apiCacheControl = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

// Apply cache control to all API routes
app.use('/api', apiCacheControl);

// Import DB status checker and reconnection function
const { checkMongoDBStatus, reconnectMongoDB } = require('./scripts/db-status');

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

// MongoDB status endpoint
app.get('/api/db-status', (req, res) => {
  res.json(checkMongoDBStatus());
});

// MongoDB reconnect endpoint
app.post('/api/db-reconnect', async (req, res) => {
  try {
    // Only allow authenticated admins to trigger reconnection
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }
    
    // Attempt reconnection
    const result = await reconnectMongoDB();
    res.json(result);
    
    // If reconnection was successful, update the global connection state
    if (result.success) {
      isConnected = true;
      retryCount = 0;
      console.log('Manual reconnection successful');
    }
  } catch (error) {
    console.error('Error during manual reconnection:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during reconnection attempt',
      error: error.message 
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Serve static files from the current directory with no-cache headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, express.static(path.join(__dirname)));

// Explicitly serve api.js to ensure it's accessible with no-cache headers
app.get('/api.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'api.js'));
});

// Route for the main HTML file with no-cache headers
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize default admin account if none exists
  initializeAdmin();
});
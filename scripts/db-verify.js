const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Models to verify
const models = [
  'Activity',
  'Admin',
  'Donation',
  'Expense',
  'Experience',
  'Gallery',
  'HeroSlide',
  'Member',
  'WeeklyFee'
];

// Function to verify MongoDB connection
async function verifyConnection() {
  console.log('Verifying MongoDB connection...');
  console.log(`MongoDB URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):[^@]+@/, '//\\1:****@')}`);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Verify all models
    console.log('\nVerifying models:');
    for (const modelName of models) {
      try {
        const Model = require(`../models/${modelName}`);
        const count = await Model.countDocuments();
        console.log(`✅ ${modelName}: ${count} documents found`);
      } catch (error) {
        console.error(`❌ Error verifying model ${modelName}:`, error.message);
      }
    }
    
    console.log('\nDatabase verification complete!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Please check your connection string and network settings.');
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
    process.exit(0);
  }
}

// Run the verification
verifyConnection();
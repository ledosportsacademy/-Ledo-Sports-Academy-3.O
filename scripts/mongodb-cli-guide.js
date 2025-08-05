/**
 * MongoDB CLI Operations Guide
 * 
 * This script provides examples of MongoDB operations that can be performed
 * directly from the Node.js REPL (Read-Eval-Print Loop).
 * 
 * To use this guide:
 * 1. Start the Node.js REPL by running 'node' in your terminal
 * 2. Load this file with: .load scripts/mongodb-cli-guide.js
 * 3. Follow the examples below to interact with your MongoDB database
 */

// Load required modules
require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Activity = require('../models/Activity');

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('You can now run the example commands below');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

// =====================================================================
// EXAMPLE COMMANDS - Copy and paste these into the Node.js REPL
// =====================================================================

console.log('\n=== MONGODB CLI OPERATIONS GUIDE ===');
console.log('Copy and paste the following commands into the Node.js REPL to execute them:\n');

// Find all members
console.log('// Find all members');
console.log('Member.find().then(members => console.log(members)).catch(err => console.error(err));');

// Find members with specific criteria
console.log('\n// Find active members with role "Player"');
console.log('Member.find({ active: true, role: "Player" }).then(members => console.log(members)).catch(err => console.error(err));');

// Find a single member by ID
console.log('\n// Find a member by ID (replace with an actual ID from your database)');
console.log('Member.findById("60d21b4667d0d8992e610c85").then(member => console.log(member)).catch(err => console.error(err));');

// Create a new member
console.log('\n// Create a new member');
console.log('const newMember = new Member({');
console.log('  name: "CLI Test User",');
console.log('  contact: "cli-test@example.com",');
console.log('  phone: "+1234567890",');
console.log('  joinDate: new Date(),');
console.log('  role: "Player",');
console.log('  active: true');
console.log('});');
console.log('newMember.save().then(member => console.log("Created:", member)).catch(err => console.error(err));');

// Update a member
console.log('\n// Update a member by ID (replace with an actual ID from your database)');
console.log('Member.findByIdAndUpdate(');
console.log('  "60d21b4667d0d8992e610c85",');
console.log('  { role: "Coach", updatedAt: new Date() },');
console.log('  { new: true, runValidators: true }');
console.log(').then(member => console.log("Updated:", member)).catch(err => console.error(err));');

// Delete a member
console.log('\n// Delete a member by ID (replace with an actual ID from your database)');
console.log('Member.findByIdAndDelete("60d21b4667d0d8992e610c85").then(member => console.log("Deleted:", member)).catch(err => console.error(err));');

// Count documents
console.log('\n// Count all members');
console.log('Member.countDocuments().then(count => console.log(`Total members: ${count}`)).catch(err => console.error(err));');

// Count documents with criteria
console.log('\n// Count active coaches');
console.log('Member.countDocuments({ active: true, role: "Coach" }).then(count => console.log(`Active coaches: ${count}`)).catch(err => console.error(err));');

// Aggregation example
console.log('\n// Aggregate members by role');
console.log('Member.aggregate([');
console.log('  { $group: { _id: "$role", count: { $sum: 1 } } },');
console.log('  { $sort: { count: -1 } }');
console.log(']).then(result => console.log(result)).catch(err => console.error(err));');

// Find with projection (selecting specific fields)
console.log('\n// Find members with projection (only name and role)');
console.log('Member.find({}, "name role").then(members => console.log(members)).catch(err => console.error(err));');

// Find with sorting
console.log('\n// Find members sorted by name');
console.log('Member.find().sort({ name: 1 }).then(members => console.log(members)).catch(err => console.error(err));');

// Find with pagination
console.log('\n// Find members with pagination (page 1, limit 2)');
console.log('const page = 1;');
console.log('const limit = 2;');
console.log('const skip = (page - 1) * limit;');
console.log('Member.find().skip(skip).limit(limit).then(members => console.log(members)).catch(err => console.error(err));');

// Find one document that matches criteria
console.log('\n// Find one member that matches criteria');
console.log('Member.findOne({ role: "Coach" }).then(member => console.log(member)).catch(err => console.error(err));');

// Update many documents
console.log('\n// Update many documents at once');
console.log('Member.updateMany(');
console.log('  { active: false },');
console.log('  { $set: { role: "Inactive" } }');
console.log(').then(result => console.log(`Modified ${result.modifiedCount} documents`)).catch(err => console.error(err));');

// Delete many documents
console.log('\n// Delete many documents at once (BE CAREFUL!)');
console.log('// Uncomment the following code to execute:');
console.log('// Member.deleteMany({ role: "Inactive" })');
console.log('//   .then(result => console.log(`Deleted ${result.deletedCount} documents`))');
console.log('//   .catch(err => console.error(err));');

// Disconnect from MongoDB
console.log('\n// Disconnect from MongoDB when done');
console.log('mongoose.disconnect().then(() => console.log("Disconnected from MongoDB")).catch(err => console.error(err));');

console.log('\n=== END OF GUIDE ===');
console.log('To execute any of these commands, copy and paste them into the Node.js REPL.');
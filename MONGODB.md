# MongoDB Data Operations Guide

## Overview

This guide explains how to work with MongoDB in the Ledo Sports Academy application. The application uses MongoDB Atlas as its database service, providing cloud-based storage for all application data.

## Connection Setup

The application connects to MongoDB using the connection string specified in the `.env` file. The connection is established with retry logic to handle temporary connection issues.

```javascript
// From server.js
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 15000,
  serverSelectionTimeoutMS: 15000
})
```

## Data Models

The application uses the following Mongoose models to interact with MongoDB collections:

1. **Activity** - Sports activities and events
2. **Admin** - Administrator accounts
3. **Donation** - Donation records
4. **Expense** - Expense records
5. **Experience** - User experiences/testimonials
6. **Gallery** - Photo gallery items
7. **HeroSlide** - Homepage hero slider content
8. **Member** - Academy members
9. **WeeklyFee** - Weekly fee records

## Basic CRUD Operations

### Creating Documents

To create a new document in MongoDB, instantiate a model with data and call `save()`:

```javascript
const newMember = new Member({
  name: 'John Doe',
  contact: 'john@example.com',
  phone: '+1234567890',
  joinDate: new Date(),
  role: 'Player',
  image: '/uploads/members/john.jpg'
});

const savedMember = await newMember.save();
console.log('Member created with ID:', savedMember._id);
```

### Reading Documents

To retrieve documents from MongoDB, use the model's query methods:

```javascript
// Find all members
const allMembers = await Member.find();

// Find by ID
const member = await Member.findById('60d21b4667d0d8992e610c85');

// Find with filters
const activeCoaches = await Member.find({
  role: 'Coach',
  active: true
});

// Find with sorting
const membersByName = await Member.find().sort({ name: 1 }); // 1 for ascending, -1 for descending

// Find with pagination
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;
const paginatedMembers = await Member.find().skip(skip).limit(limit);
```

### Updating Documents

To update documents in MongoDB, use the update methods:

```javascript
// Update by ID
const updatedMember = await Member.findByIdAndUpdate(
  '60d21b4667d0d8992e610c85',
  { role: 'Coach', updatedAt: new Date() },
  { new: true, runValidators: true } // Return updated document and run validators
);

// Update many documents
const result = await Member.updateMany(
  { active: false },
  { $set: { role: 'Inactive' } }
);
console.log(`${result.modifiedCount} documents updated`);
```

### Deleting Documents

To delete documents from MongoDB, use the delete methods:

```javascript
// Delete by ID
const deletedMember = await Member.findByIdAndDelete('60d21b4667d0d8992e610c85');

// Delete many documents
const result = await Member.deleteMany({ active: false });
console.log(`${result.deletedCount} documents deleted`);
```

## Advanced Operations

### Aggregation

MongoDB's aggregation framework allows for complex data processing:

```javascript
// Count members by role
const membersByRole = await Member.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Calculate total donations by month
const donationsByMonth = await Donation.aggregate([
  {
    $group: {
      _id: {
        year: { $year: '$date' },
        month: { $month: '$date' }
      },
      total: { $sum: '$amount' }
    }
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } }
]);
```

### Transactions

For operations that require atomicity, use MongoDB transactions:

```javascript
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Operations within the transaction
  const newMember = new Member({ /* member data */ });
  await newMember.save({ session });
  
  const newDonation = new Donation({
    donor: newMember.name,
    amount: 100,
    date: new Date()
  });
  await newDonation.save({ session });
  
  // Commit the transaction
  await session.commitTransaction();
} catch (error) {
  // Abort transaction on error
  await session.abortTransaction();
  throw error;
} finally {
  // End the session
  session.endSession();
}
```

## Database Utilities

The application includes several utility scripts for database operations:

### Database Verification

Verify the MongoDB connection and check all models:

```bash
npm run db:verify
```

### Database Seeding

Populate the database with sample data:

```bash
npm run db:seed
```

### Data Saving Example

Run the data saving example script to see MongoDB operations in action:

```bash
node scripts/save-data-example.js
```

## Database Status Monitoring

The application includes a database status indicator that shows the current connection status. This indicator appears in the bottom-right corner of the application and provides real-time feedback on the database connection state.

Administrators can manually trigger a database reconnection if needed by clicking the "Reconnect Database" button in the status indicator when logged in.

## Troubleshooting

### Connection Issues

If you encounter MongoDB connection issues:

1. Check that your MongoDB Atlas cluster is running and accessible
2. Verify the connection string in the `.env` file
3. Check for network connectivity issues
4. Look for error messages in the server logs
5. Use the database status indicator to monitor connection state

### Data Validation Errors

If you encounter validation errors when saving documents:

1. Check the model schema for required fields and validation rules
2. Ensure all required fields are provided and have the correct data types
3. Check for unique constraints that might be violated

## Best Practices

1. **Use Mongoose Validation**: Define validation rules in your schemas to ensure data integrity
2. **Handle Errors**: Always wrap MongoDB operations in try/catch blocks
3. **Use Indexes**: Create indexes for frequently queried fields to improve performance
4. **Limit Query Results**: Use pagination to limit the number of documents returned
5. **Close Connections**: Always close MongoDB connections when done to free up resources
6. **Use Transactions**: Use transactions for operations that need to be atomic
7. **Monitor Performance**: Keep an eye on query performance and optimize as needed
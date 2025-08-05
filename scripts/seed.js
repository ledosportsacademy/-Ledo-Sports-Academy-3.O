const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load models
const HeroSlide = require('../models/HeroSlide');
const Activity = require('../models/Activity');
const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Expense = require('../models/Expense');
const Experience = require('../models/Experience');
const WeeklyFee = require('../models/WeeklyFee');
const Gallery = require('../models/Gallery');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ledosportsacademy:iD0xFkdX5IqDXWLK@cluster0.bpaauiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const heroSlides = [
  {
    title: 'Welcome to Ledo Sports Academy',
    subtitle: 'Developing Champions Since 2010',
    description: 'Join our community of athletes and experience the best training programs in the region.',
    backgroundImage: '/uploads/hero/hero-1.jpg',
    ctaText: 'Join Now',
    ctaLink: '#contact',
    order: 1
  },
  {
    title: 'Summer Training Camp',
    subtitle: 'Intensive Training for All Ages',
    description: 'Our annual summer camp is now open for registration. Limited spots available!',
    backgroundImage: '/uploads/hero/hero-2.jpg',
    ctaText: 'Register',
    ctaLink: '#activities',
    order: 2
  },
  {
    title: 'Professional Coaching',
    subtitle: 'Learn from the Best',
    description: 'Our coaches have years of experience in professional sports and training.',
    backgroundImage: '/uploads/hero/hero-3.jpg',
    ctaText: 'Meet Our Team',
    ctaLink: '#about',
    order: 3
  }
];

const activities = [
  {
    title: 'Weekly Training Session',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    time: '18:00 - 20:00',
    description: 'Regular training session focusing on fundamentals and team coordination.',
    image: '/uploads/activities/training.jpg',
    status: 'upcoming',
    type: 'training',
    priority: 'medium'
  },
  {
    title: 'Friendly Match vs Eagles',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    time: '15:00 - 17:00',
    description: 'Friendly match against the Eagles team. Come support our players!',
    image: '/uploads/activities/match.jpg',
    status: 'upcoming',
    type: 'match',
    priority: 'high'
  },
  {
    title: 'Annual Sports Day',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    time: '09:00 - 18:00',
    description: 'A day full of sports activities, competitions, and fun for all members and their families.',
    image: '/uploads/activities/sports-day.jpg',
    status: 'completed',
    type: 'event',
    priority: 'high'
  }
];

const members = [
  {
    name: 'John Doe',
    contact: 'john.doe@example.com',
    phone: '+1234567890',
    joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
    role: 'player',
    image: '/uploads/members/john.jpg',
    address: '123 Main St, Anytown, USA',
    emergencyContact: 'Jane Doe, +1987654321',
    dateOfBirth: new Date('1995-05-15'),
    isActive: true
  },
  {
    name: 'Jane Smith',
    contact: 'jane.smith@example.com',
    phone: '+1234567891',
    joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    role: 'coach',
    image: '/uploads/members/jane.jpg',
    address: '456 Oak St, Anytown, USA',
    emergencyContact: 'John Smith, +1987654322',
    dateOfBirth: new Date('1985-10-20'),
    isActive: true
  },
  {
    name: 'Mike Johnson',
    contact: 'mike.johnson@example.com',
    phone: '+1234567892',
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    role: 'player',
    image: '/uploads/members/mike.jpg',
    address: '789 Pine St, Anytown, USA',
    emergencyContact: 'Sarah Johnson, +1987654323',
    dateOfBirth: new Date('1998-03-25'),
    isActive: true
  }
];

const donations = [
  {
    donorName: 'Robert Brown',
    amount: 500,
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    purpose: 'Equipment',
    contactInfo: 'robert.brown@example.com, +1234567893',
    paymentMethod: 'bank transfer',
    notes: 'Annual donation for new equipment',
    receiptNumber: 'DON-2023-001'
  },
  {
    donorName: 'Sarah Williams',
    amount: 1000,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    purpose: 'Facility Improvement',
    contactInfo: 'sarah.williams@example.com, +1234567894',
    paymentMethod: 'check',
    notes: 'Donation for facility renovation',
    receiptNumber: 'DON-2023-002'
  },
  {
    donorName: 'Community Foundation',
    amount: 2500,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    purpose: 'Scholarship',
    contactInfo: 'info@communityfoundation.org, +1234567895',
    paymentMethod: 'bank transfer',
    notes: 'Annual scholarship fund donation',
    receiptNumber: 'DON-2023-003'
  }
];

const expenses = [
  {
    title: 'Equipment Purchase',
    amount: 750,
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    category: 'equipment',
    description: 'Purchase of new training balls and cones',
    paymentMethod: 'credit card',
    approvedBy: 'Jane Smith',
    receiptImage: '/uploads/expenses/receipt-1.jpg',
    notes: 'Annual equipment refresh'
  },
  {
    title: 'Facility Rent',
    amount: 1200,
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    category: 'rent',
    description: 'Monthly rent for training facility',
    paymentMethod: 'bank transfer',
    approvedBy: 'Jane Smith',
    receiptImage: '/uploads/expenses/receipt-2.jpg',
    notes: 'Regular monthly payment'
  },
  {
    title: 'Tournament Registration',
    amount: 500,
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    category: 'event',
    description: 'Registration fee for regional tournament',
    paymentMethod: 'check',
    approvedBy: 'Jane Smith',
    receiptImage: '/uploads/expenses/receipt-3.jpg',
    notes: 'Team registration for 3 age groups'
  }
];

const experiences = [
  {
    title: 'Regional Tournament Victory',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    description: 'Our team won the regional tournament after an intense final match.',
    images: ['/uploads/experiences/tournament-1.jpg', '/uploads/experiences/tournament-2.jpg'],
    category: 'tournament',
    location: 'Regional Sports Complex, Anytown',
    participants: [], // Will be populated with member IDs
    outcome: 'First Place',
    highlights: 'John Doe scored the winning goal in the final minute of the match.'
  },
  {
    title: 'Annual Training Camp',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    description: 'A week-long intensive training camp focusing on skills development and team building.',
    images: ['/uploads/experiences/camp-1.jpg', '/uploads/experiences/camp-2.jpg'],
    category: 'training',
    location: 'Mountain View Resort, Hilltown',
    participants: [], // Will be populated with member IDs
    outcome: 'Successful completion with improved team coordination',
    highlights: 'New training techniques were introduced by Coach Jane Smith.'
  }
];

const gallery = [
  {
    title: 'Team Photo 2023',
    imageUrl: '/uploads/gallery/team-photo.jpg',
    description: 'Official team photo for the 2023 season',
    date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    category: 'team',
    isFeatured: true,
    featuredOrder: 1,
    tags: ['team', 'official', '2023']
  },
  {
    title: 'Training Session',
    imageUrl: '/uploads/gallery/training-session.jpg',
    description: 'Weekly training session focusing on passing drills',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    category: 'training',
    isFeatured: true,
    featuredOrder: 2,
    tags: ['training', 'drills', 'skills']
  },
  {
    title: 'Award Ceremony',
    imageUrl: '/uploads/gallery/award-ceremony.jpg',
    description: 'Annual award ceremony recognizing outstanding achievements',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    category: 'event',
    isFeatured: true,
    featuredOrder: 3,
    tags: ['awards', 'ceremony', 'achievement']
  }
];

// Function to seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await HeroSlide.deleteMany({});
    await Activity.deleteMany({});
    await Member.deleteMany({});
    await Donation.deleteMany({});
    await Expense.deleteMany({});
    await Experience.deleteMany({});
    await WeeklyFee.deleteMany({});
    await Gallery.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert new data
    const insertedMembers = await Member.insertMany(members);
    console.log(`Inserted ${insertedMembers.length} members`);
    
    // Update experiences with member IDs
    experiences.forEach(exp => {
      exp.participants = insertedMembers
        .filter(member => member.role === 'player')
        .map(member => member._id);
    });
    
    // Insert other data
    const insertedHeroSlides = await HeroSlide.insertMany(heroSlides);
    console.log(`Inserted ${insertedHeroSlides.length} hero slides`);
    
    const insertedActivities = await Activity.insertMany(activities);
    console.log(`Inserted ${insertedActivities.length} activities`);
    
    const insertedDonations = await Donation.insertMany(donations);
    console.log(`Inserted ${insertedDonations.length} donations`);
    
    const insertedExpenses = await Expense.insertMany(expenses);
    console.log(`Inserted ${insertedExpenses.length} expenses`);
    
    const insertedExperiences = await Experience.insertMany(experiences);
    console.log(`Inserted ${insertedExperiences.length} experiences`);
    
    const insertedGallery = await Gallery.insertMany(gallery);
    console.log(`Inserted ${insertedGallery.length} gallery items`);
    
    // Create weekly fees for members
    const weeklyFees = [];
    
    for (const member of insertedMembers) {
      // Create weekly fees for the past 4 weeks
      for (let i = 1; i <= 4; i++) {
        const weekStart = new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000));
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        
        const fee = {
          member: member._id,
          weekStartDate: weekStart,
          weekEndDate: weekEnd,
          amount: 50, // Standard weekly fee
          status: i <= 2 ? 'paid' : 'pending', // Older fees are paid, newer are pending
          paymentDate: i <= 2 ? new Date(weekStart.getTime() + (2 * 24 * 60 * 60 * 1000)) : null, // Payment date for paid fees
          paymentMethod: i <= 2 ? 'cash' : null,
          notes: i <= 2 ? 'Regular weekly payment' : '',
          collectedBy: i <= 2 ? 'Jane Smith' : ''
        };
        
        weeklyFees.push(fee);
      }
    }
    
    const insertedWeeklyFees = await WeeklyFee.insertMany(weeklyFees);
    console.log(`Inserted ${insertedWeeklyFees.length} weekly fees`);
    
    console.log('Database seeded successfully');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Create uploads directories if they don't exist
const uploadDirs = [
  '../uploads',
  '../uploads/hero',
  '../uploads/activities',
  '../uploads/members',
  '../uploads/expenses',
  '../uploads/experiences',
  '../uploads/gallery'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }
});

// Run the seed function
seedDatabase();
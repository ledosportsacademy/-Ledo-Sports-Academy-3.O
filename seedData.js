const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeroSlide = require('./models/HeroSlide');
const Activity = require('./models/Activity');
const Member = require('./models/Member');
const Donation = require('./models/Donation');
const Experience = require('./models/Experience');
const Expense = require('./models/Expense');
const WeeklyFee = require('./models/WeeklyFee');

// Load environment variables
dotenv.config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

// Initial data from app.js
const initialData = {
  heroSlides: [
    {
      id: 1,
      title: "Welcome to Ledo Sports Academy",
      subtitle: "Excellence in Sports Training",
      description: "Discover your potential with our world-class training programs and experienced coaches. Join us in building champions of tomorrow.",
      backgroundImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=700&fit=crop",
      ctaText: "Join Our Academy",
      ctaLink: "#members"
    },
    {
      id: 2,
      title: "Championship Winning Team",
      subtitle: "Regional Champions 2024",
      description: "Our dedication to excellence has earned us the regional championship title. Be part of our winning legacy.",
      backgroundImage: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=1200&h=700&fit=crop",
      ctaText: "View Achievements",
      ctaLink: "#experiences"
    },
    {
      id: 3,
      title: "State-of-the-Art Facilities",
      subtitle: "Modern Training Complex",
      description: "Train in our newly renovated facilities equipped with the latest technology and equipment for optimal performance.",
      backgroundImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=700&fit=crop",
      ctaText: "Explore Facilities",
      ctaLink: "#activities"
    },
    {
      id: 4,
      title: "Community Sports Festival",
      subtitle: "Annual Championship Event",
      description: "Join hundreds of participants in our annual community sports festival. Register now for upcoming tournaments.",
      backgroundImage: "https://images.unsplash.com/photo-1555717588-d53f4e5ea81c?w=1200&h=700&fit=crop",
      ctaText: "Register Now",
      ctaLink: "#activities"
    }
  ],
  activities: [
    {
      id: 1,
      title: "Championship League Match vs Eagles FC",
      date: "2025-08-12",
      time: "16:00",
      description: "Ledo Sports Academy vs Eagles FC - Championship League Quarter Final match at home ground.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Annual Sports Day Celebration",
      date: "2025-08-18",
      time: "09:00",
      description: "Join us for our annual sports day with competitions, awards ceremony, and community celebration.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Weekly Training Session",
      date: "2025-08-06",
      time: "17:30",
      description: "Regular training session for all academy members at the main practice field.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Junior Academy Trials",
      date: "2025-08-22",
      time: "14:00",
      description: "Open trials for junior academy program. Ages 8-16 welcome to showcase their talent.",
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Inter-Academy Tournament",
      date: "2025-08-25",
      time: "10:00",
      description: "Regional tournament featuring top sports academies. Multiple matches throughout the day.",
      image: "https://images.unsplash.com/photo-1526232761682-d26e85d9d5c8?w=400&h=300&fit=crop",
      status: "upcoming"
    },
    {
      id: 6,
      title: "Summer Camp Training Concluded",
      date: "2025-07-30",
      time: "18:00",
      description: "Successfully completed our intensive summer training camp with 50+ participants.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
      status: "recent"
    },
    {
      id: 7,
      title: "Regional Championship Victory",
      date: "2025-07-25",
      time: "15:30",
      description: "Our team secured victory in the regional championship finals against City Sports Club.",
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop",
      status: "recent"
    },
    {
      id: 8,
      title: "Community Coaching Workshop",
      date: "2025-07-20",
      time: "10:00",
      description: "Conducted free coaching workshop for local community coaches and young enthusiasts.",
      image: "https://images.unsplash.com/photo-1526232761682-d26e85d9d5c8?w=400&h=300&fit=crop",
      status: "recent"
    }
  ],
  members: [
    {
      id: 1,
      name: "Arjun Sharma",
      contact: "arjun@email.com",
      phone: "+91-9876-543210",
      joinDate: "2023-01-15",
      role: "Team Captain",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Priya Patel",
      contact: "priya@email.com",
      phone: "+91-9876-543211",
      joinDate: "2023-02-20",
      role: "Vice Captain",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332b6d9?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Rohit Kumar",
      contact: "rohit@email.com",
      phone: "+91-9876-543212",
      joinDate: "2023-03-10",
      role: "Senior Player",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Anita Singh",
      contact: "anita@email.com",
      phone: "+91-9876-543213",
      joinDate: "2023-04-05",
      role: "Goalkeeper Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Vikram Gupta",
      contact: "vikram@email.com",
      phone: "+91-9876-543214",
      joinDate: "2023-05-12",
      role: "Defense Specialist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Deepika Rao",
      contact: "deepika@email.com",
      phone: "+91-9876-543215",
      joinDate: "2023-06-18",
      role: "Forward",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "Rahul Verma",
      contact: "rahul@email.com",
      phone: "+91-9876-543216",
      joinDate: "2023-07-22",
      role: "Midfielder",
      image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 8,
      name: "Sneha Joshi",
      contact: "sneha@email.com",
      phone: "+91-9876-543217",
      joinDate: "2023-08-15",
      role: "Junior Trainer",
      image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face"
    }
  ],
  donations: [
    {
      id: 1,
      donorName: "Ledo Foundation Trust",
      amount: 50000,
      date: "2025-07-10",
      purpose: "Infrastructure Development"
    },
    {
      id: 2,
      donorName: "Local Sports Committee",
      amount: 25000,
      date: "2025-07-15",
      purpose: "Equipment Purchase"
    },
    {
      id: 3,
      donorName: "Arjun Sharma",
      amount: 5000,
      date: "2025-07-20",
      purpose: "Youth Development Program"
    },
    {
      id: 4,
      donorName: "City Business Association",
      amount: 15000,
      date: "2025-07-25",
      purpose: "Tournament Participation"
    },
    {
      id: 5,
      donorName: "Anonymous Supporter",
      amount: 8000,
      date: "2025-08-01",
      purpose: "General Academy Operations"
    },
    {
      id: 6,
      donorName: "Parents Association",
      amount: 12000,
      date: "2025-08-02",
      purpose: "New Uniforms and Kit"
    }
  ],
  experiences: [
    {
      id: 1,
      title: "Regional Championship Victory 2024",
      date: "2024-12-20",
      description: "Ledo Sports Academy clinched the regional championship title after defeating three top academies. Our players showcased exceptional skill and teamwork throughout the tournament.",
      image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "New Training Complex Inauguration",
      date: "2024-10-15",
      description: "Official opening of our state-of-the-art training complex with modern facilities, synthetic turf, and advanced training equipment. A milestone achievement for Ledo Sports Academy.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Community Sports Festival Success",
      date: "2024-08-18",
      description: "Organized and hosted the annual community sports festival with over 500 participants from 15 local schools. The event promoted sports culture and healthy competition.",
      image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Academy's 5th Anniversary Celebration",
      date: "2024-06-10",
      description: "Celebrated Ledo Sports Academy's 5th anniversary with a grand ceremony attended by over 400 members, alumni, and supporters. Honored our achievements and future vision.",
      image: "https://images.unsplash.com/photo-1555717588-d53f4e5ea81c?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      title: "First National Tournament Participation",
      date: "2024-04-25",
      description: "Ledo Sports Academy made its debut in the national tournament, reaching the semi-finals. A proud moment that marked our entry into elite-level competition.",
      image: "https://images.unsplash.com/photo-1526232761682-d26e85d9d5c8?w=400&h=300&fit=crop"
    }
  ],
  expenses: [
    {
      id: 1,
      description: "Training Equipment Purchase",
      amount: 15000,
      date: "2025-07-05",
      category: "Equipment",
      vendor: "Sports Pro Equipment Ltd",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 2,
      description: "Monthly Ground Maintenance",
      amount: 8000,
      date: "2025-07-01",
      category: "Maintenance",
      vendor: "Green Fields Services",
      paymentMethod: "Cash"
    },
    {
      id: 3,
      description: "Coach Transportation Allowance",
      amount: 3500,
      date: "2025-07-10",
      category: "Transportation",
      vendor: "Coaching Staff",
      paymentMethod: "UPI"
    },
    {
      id: 4,
      description: "Utility Bills - Electricity",
      amount: 4200,
      date: "2025-07-15",
      category: "Utilities",
      vendor: "State Electricity Board",
      paymentMethod: "Online"
    },
    {
      id: 5,
      description: "Medical Kit and First Aid Supplies",
      amount: 2800,
      date: "2025-07-18",
      category: "Medical",
      vendor: "MedCare Supplies",
      paymentMethod: "Card"
    },
    {
      id: 6,
      description: "Tournament Registration Fees",
      amount: 12000,
      date: "2025-07-22",
      category: "Tournament",
      vendor: "Regional Sports Federation",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 7,
      description: "Marketing and Publicity Materials",
      amount: 5500,
      date: "2025-07-25",
      category: "Marketing",
      vendor: "Creative Print Solutions",
      paymentMethod: "Cash"
    },
    {
      id: 8,
      description: "Insurance Premium",
      amount: 18000,
      date: "2025-07-28",
      category: "Insurance",
      vendor: "National Insurance Co",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 9,
      description: "Refreshments for Training Sessions",
      amount: 3200,
      date: "2025-08-01",
      category: "Food & Beverage",
      vendor: "Local Caterers",
      paymentMethod: "UPI"
    },
    {
      id: 10,
      description: "Office Supplies and Stationery",
      amount: 1800,
      date: "2025-08-02",
      category: "Office",
      vendor: "Office Mart",
      paymentMethod: "Card"
    }
  ],
  weeklyFees: [
    {
      memberId: 1,
      memberName: "Arjun Sharma",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "pending"}
      ]
    },
    {
      memberId: 2,
      memberName: "Priya Patel",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "overdue"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "pending"}
      ]
    },
    {
      memberId: 3,
      memberName: "Rohit Kumar",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "paid"}
      ]
    },
    {
      memberId: 4,
      memberName: "Anita Singh",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "overdue"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "pending"}
      ]
    },
    {
      memberId: 5,
      memberName: "Vikram Gupta",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "overdue"},
        {"date": "2025-08-03", "amount": 20, "status": "pending"}
      ]
    },
    {
      memberId: 6,
      memberName: "Deepika Rao",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "paid"}
      ]
    },
    {
      memberId: 7,
      memberName: "Rahul Verma",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "pending"}
      ]
    },
    {
      memberId: 8,
      memberName: "Sneha Joshi",
      payments: [
        {"date": "2025-07-06", "amount": 20, "status": "paid"},
        {"date": "2025-07-13", "amount": 20, "status": "paid"},
        {"date": "2025-07-20", "amount": 20, "status": "paid"},
        {"date": "2025-07-27", "amount": 20, "status": "paid"},
        {"date": "2025-08-03", "amount": 20, "status": "paid"}
      ]
    }
  ]
};

// Function to seed data
async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas for seeding data');

    // Clear existing data
    await HeroSlide.deleteMany({});
    await Activity.deleteMany({});
    await Member.deleteMany({});
    await Donation.deleteMany({});
    await Experience.deleteMany({});
    await Expense.deleteMany({});
    await WeeklyFee.deleteMany({});
    
    console.log('Cleared existing data');

    // Insert new data
    await HeroSlide.insertMany(initialData.heroSlides);
    await Activity.insertMany(initialData.activities);
    await Member.insertMany(initialData.members);
    await Donation.insertMany(initialData.donations);
    await Experience.insertMany(initialData.experiences);
    await Expense.insertMany(initialData.expenses);
    await WeeklyFee.insertMany(initialData.weeklyFees);
    
    console.log('Data seeded successfully');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedData();
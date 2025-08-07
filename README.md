# Ledo Sports Academy Management System

A full-stack web application for managing Ledo Sports Academy operations, including members, activities, donations, expenses, and more.

## Features

- Hero slides management for the homepage carousel
- Activities management for upcoming and recent events
- Members directory with search functionality
- Donations tracking with total calculation
- Experience/achievements showcase
- Expense tracking with category-wise reporting
- Weekly fee management for academy members

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas

## API Endpoints

### Hero Slides
- `GET /api/hero-slides` - Get all hero slides
- `GET /api/hero-slides/:id` - Get hero slide by ID
- `POST /api/hero-slides` - Create a new hero slide
- `PUT /api/hero-slides/:id` - Update a hero slide
- `DELETE /api/hero-slides/:id` - Delete a hero slide

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/status/:status` - Get activities by status (upcoming/recent)
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create a new activity
- `PUT /api/activities/:id` - Update an activity
- `DELETE /api/activities/:id` - Delete an activity

### Members
- `GET /api/members/search` - Search members by name
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Donations
- `GET /api/donations` - Get all donations
- `GET /api/donations/total` - Get total donation amount
- `GET /api/donations/:id` - Get donation by ID
- `POST /api/donations` - Create a new donation
- `PUT /api/donations/:id` - Update a donation
- `DELETE /api/donations/:id` - Delete a donation

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience by ID
- `POST /api/experiences` - Create a new experience
- `PUT /api/experiences/:id` - Update an experience
- `DELETE /api/experiences/:id` - Delete an experience

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/total` - Get total expense amount
- `GET /api/expenses/by-category` - Get expenses grouped by category
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create a new expense
- `PUT /api/expenses/:id` - Update an expense
- `DELETE /api/expenses/:id` - Delete an expense

### Weekly Fees
- `GET /api/weekly-fees` - Get all weekly fees
- `GET /api/weekly-fees/:memberId` - Get weekly fees by member ID
- `POST /api/weekly-fees` - Create a new weekly fee record
- `PUT /api/weekly-fees/:memberId` - Update a weekly fee record
- `POST /api/weekly-fees/:memberId/payments` - Add a new payment
- `PUT /api/weekly-fees/:memberId/payments/:paymentIndex` - Update payment status
- `DELETE /api/weekly-fees/:memberId` - Delete a weekly fee record

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (if needed)
4. Seed the database with initial data:
   ```
   npm run seed
   ```
5. Start the server:
   ```
   npm start
   ```
   or for development with auto-reload:
   ```
   npm run dev
   ```
6. Access the application at http://localhost:3000

## Database Connection

The application connects to MongoDB Atlas using the following connection string:
```
mongodb+srv://ledosportsacademy:I9R3MjfaSSYFXMKS@cluster0.l6exrot.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
# Ledo Sports Academy Management System

## Overview
This is a full-stack web application for managing Ledo Sports Academy operations, including activities, members, donations, expenses, experiences, weekly fees, and gallery.

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Start the server:
   ```
   npm start
   ```
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile (protected)
- `POST /api/admin` - Create a new admin (super admin only)
- `PUT /api/admin/password` - Update admin password (protected)

### Hero Slides
- `GET /api/hero` - Get all hero slides
- `GET /api/hero/:id` - Get hero slide by ID
- `POST /api/hero` - Create a new hero slide (protected)
- `PUT /api/hero/:id` - Update a hero slide (protected)
- `DELETE /api/hero/:id` - Delete a hero slide (protected)
- `PUT /api/hero/order` - Update hero slides order (protected)

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/recent` - Get recent activities
- `GET /api/activities/upcoming` - Get upcoming activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create a new activity (protected)
- `PUT /api/activities/:id` - Update an activity (protected)
- `DELETE /api/activities/:id` - Delete an activity (protected)
- `PATCH /api/activities/:id/status` - Update activity status (protected)

### Members
- `GET /api/members` - Get all members (protected)
- `GET /api/members/count` - Get total count of active members (protected)
- `GET /api/members/:id` - Get member by ID (protected)
- `POST /api/members` - Create a new member (protected)
- `PUT /api/members/:id` - Update a member (protected)
- `DELETE /api/members/:id` - Delete a member (protected)
- `PATCH /api/members/:id/status` - Update member active status (protected)

### Donations
- `GET /api/donations` - Get all donations (protected)
- `GET /api/donations/stats` - Get donation statistics (protected)
- `GET /api/donations/:id` - Get donation by ID (protected)
- `POST /api/donations` - Create a new donation (protected)
- `PUT /api/donations/:id` - Update a donation (protected)
- `DELETE /api/donations/:id` - Delete a donation (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `GET /api/expenses/stats` - Get expense statistics (protected)
- `GET /api/expenses/:id` - Get expense by ID (protected)
- `POST /api/expenses` - Create a new expense (protected)
- `PUT /api/expenses/:id` - Update an expense (protected)
- `DELETE /api/expenses/:id` - Delete an expense (protected)

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get experience by ID
- `POST /api/experiences` - Create a new experience (protected)
- `PUT /api/experiences/:id` - Update an experience (protected)
- `DELETE /api/experiences/:id` - Delete an experience (protected)
- `POST /api/experiences/:id/images` - Add images to an experience (protected)
- `DELETE /api/experiences/:id/images` - Remove images from an experience (protected)

### Weekly Fees
- `GET /api/weekly-fees` - Get all weekly fees (protected)
- `GET /api/weekly-fees/stats` - Get weekly fee statistics (protected)
- `GET /api/weekly-fees/member/:memberId` - Get weekly fees by member ID (protected)
- `GET /api/weekly-fees/:id` - Get weekly fee by ID (protected)
- `POST /api/weekly-fees` - Create a new weekly fee (protected)
- `POST /api/weekly-fees/batch` - Create weekly fees for all active members (protected)
- `PUT /api/weekly-fees/:id` - Update a weekly fee (protected)
- `DELETE /api/weekly-fees/:id` - Delete a weekly fee (protected)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/featured` - Get featured gallery items
- `GET /api/gallery/:id` - Get gallery item by ID
- `POST /api/gallery` - Create a new gallery item (protected)
- `PUT /api/gallery/:id` - Update a gallery item (protected)
- `DELETE /api/gallery/:id` - Delete a gallery item (protected)
- `PUT /api/gallery/featured/order` - Update featured gallery items order (protected)
- `PATCH /api/gallery/:id/featured` - Toggle featured status of a gallery item (protected)

## File Upload
The application supports image uploads for various entities. Files are stored in the `/uploads` directory with subdirectories for each entity type.

## Default Admin Account
A default admin account is created on first server start:
- Username: `admin`
- Password: `ledosports2024`

It is recommended to change the password after first login.

## License
This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
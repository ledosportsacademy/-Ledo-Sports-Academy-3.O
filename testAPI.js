const axios = require('axios');

// Base URL for API
const API_BASE_URL = 'http://localhost:3000/api';

// Test function to make API requests
async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test Hero Slides API
    console.log('\n--- Testing Hero Slides API ---');
    const heroSlides = await axios.get(`${API_BASE_URL}/hero-slides`);
    console.log(`GET /hero-slides: ${heroSlides.data.length} slides found`);
    
    // Test Activities API
    console.log('\n--- Testing Activities API ---');
    const activities = await axios.get(`${API_BASE_URL}/activities`);
    console.log(`GET /activities: ${activities.data.length} activities found`);
    
    const upcomingActivities = await axios.get(`${API_BASE_URL}/activities/status/upcoming`);
    console.log(`GET /activities/status/upcoming: ${upcomingActivities.data.length} upcoming activities found`);
    
    // Test Members API
    console.log('\n--- Testing Members API ---');
    const members = await axios.get(`${API_BASE_URL}/members`);
    console.log(`GET /members: ${members.data.length} members found`);
    
    // Test search functionality
    const searchResult = await axios.get(`${API_BASE_URL}/members/search?query=ar`);
    console.log(`GET /members/search?query=ar: ${searchResult.data.length} members found`);
    
    // Test Donations API
    console.log('\n--- Testing Donations API ---');
    const donations = await axios.get(`${API_BASE_URL}/donations`);
    console.log(`GET /donations: ${donations.data.length} donations found`);
    
    const totalDonations = await axios.get(`${API_BASE_URL}/donations/total`);
    console.log(`GET /donations/total: Total amount = ${totalDonations.data.total}`);
    
    // Test Experiences API
    console.log('\n--- Testing Experiences API ---');
    const experiences = await axios.get(`${API_BASE_URL}/experiences`);
    console.log(`GET /experiences: ${experiences.data.length} experiences found`);
    
    // Test Expenses API
    console.log('\n--- Testing Expenses API ---');
    const expenses = await axios.get(`${API_BASE_URL}/expenses`);
    console.log(`GET /expenses: ${expenses.data.length} expenses found`);
    
    const totalExpenses = await axios.get(`${API_BASE_URL}/expenses/total`);
    console.log(`GET /expenses/total: Total amount = ${totalExpenses.data.total}`);
    
    const expensesByCategory = await axios.get(`${API_BASE_URL}/expenses/by-category`);
    console.log(`GET /expenses/by-category: ${Object.keys(expensesByCategory.data).length} categories found`);
    
    // Test Weekly Fees API
    console.log('\n--- Testing Weekly Fees API ---');
    const weeklyFees = await axios.get(`${API_BASE_URL}/weekly-fees`);
    console.log(`GET /weekly-fees: ${weeklyFees.data.length} weekly fee records found`);
    
    console.log('\nAPI testing completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run the test
testAPI();
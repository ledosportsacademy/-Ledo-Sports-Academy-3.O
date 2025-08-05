/**
 * MongoDB Examples Runner
 * 
 * This script demonstrates how to run the save-data-example.js script
 * and provides additional guidance on MongoDB operations.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('='.repeat(80));
console.log('MONGODB DATA OPERATIONS EXAMPLE RUNNER');
console.log('='.repeat(80));
console.log('\nThis script will run the save-data-example.js script to demonstrate');
console.log('how to perform various MongoDB operations in the Ledo Sports Academy application.\n');

// Function to run the save-data-example.js script
function runSaveDataExample() {
  console.log('Running save-data-example.js...');
  console.log('-'.repeat(80));
  
  const saveDataPath = path.join(__dirname, 'save-data-example.js');
  const child = spawn('node', [saveDataPath], { stdio: 'inherit' });
  
  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`save-data-example.js exited with code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

// Display additional MongoDB operations information
function displayAdditionalInfo() {
  console.log('\n' + '='.repeat(80));
  console.log('ADDITIONAL MONGODB OPERATIONS');
  console.log('='.repeat(80));
  
  console.log('\n1. QUERYING WITH ADVANCED FILTERS');
  console.log('   const recentMembers = await Member.find({');
  console.log('     joinDate: { $gte: new Date("2023-01-01") },');
  console.log('     role: { $in: ["Player", "Coach"] }');
  console.log('   }).select("name role joinDate").sort({ joinDate: -1 });');
  
  console.log('\n2. USING POPULATE TO FETCH RELATED DOCUMENTS');
  console.log('   // Assuming you have a reference field in your schema');
  console.log('   const activitiesWithCreator = await Activity.find()');
  console.log('     .populate("createdBy", "name role")');
  console.log('     .exec();');
  
  console.log('\n3. USING TRANSACTIONS FOR ATOMIC OPERATIONS');
  console.log('   const session = await mongoose.startSession();');
  console.log('   session.startTransaction();');
  console.log('   try {');
  console.log('     const newMember = new Member({ /* data */ });');
  console.log('     await newMember.save({ session });');
  console.log('     const newDonation = new Donation({ /* data */ });');
  console.log('     await newDonation.save({ session });');
  console.log('     await session.commitTransaction();');
  console.log('   } catch (error) {');
  console.log('     await session.abortTransaction();');
  console.log('     throw error;');
  console.log('   } finally {');
  console.log('     session.endSession();');
  console.log('   }');
  
  console.log('\n4. USING MONGOOSE MIDDLEWARE (HOOKS)');
  console.log('   // In your schema definition:');
  console.log('   MemberSchema.pre("save", function(next) {');
  console.log('     // Do something before saving');
  console.log('     this.updatedAt = new Date();');
  console.log('     next();');
  console.log('   });');
  
  console.log('\n5. USING MONGOOSE VIRTUALS');
  console.log('   // In your schema definition:');
  console.log('   MemberSchema.virtual("fullName").get(function() {');
  console.log('     return `${this.firstName} ${this.lastName}`;');
  console.log('   });');
  
  console.log('\n' + '='.repeat(80));
  console.log('MONGODB RESOURCES');
  console.log('='.repeat(80));
  console.log('\n• Mongoose Documentation: https://mongoosejs.com/docs/');
  console.log('• MongoDB Documentation: https://docs.mongodb.com/');
  console.log('• MongoDB University (Free Courses): https://university.mongodb.com/');
  console.log('\nFor more information, see the MONGODB.md file in the project root.\n');
}

// Main function
async function main() {
  try {
    await runSaveDataExample();
    displayAdditionalInfo();
    console.log('\n✅ Example runner completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Error running examples:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
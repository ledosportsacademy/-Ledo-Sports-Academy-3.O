const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the destination folder based on the route
    let uploadPath = 'uploads/';
    
    if (req.originalUrl.includes('/api/hero')) {
      uploadPath += 'hero/';
    } else if (req.originalUrl.includes('/api/activities')) {
      uploadPath += 'activities/';
    } else if (req.originalUrl.includes('/api/members')) {
      uploadPath += 'members/';
    } else if (req.originalUrl.includes('/api/expenses')) {
      uploadPath += 'expenses/';
    } else if (req.originalUrl.includes('/api/experiences')) {
      uploadPath += 'experiences/';
    } else if (req.originalUrl.includes('/api/gallery')) {
      uploadPath += 'gallery/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export middleware functions for different upload scenarios
module.exports = {
  // Single file upload
  uploadSingle: (fieldName) => upload.single(fieldName),
  
  // Multiple files upload (max 5)
  uploadMultiple: (fieldName) => upload.array(fieldName, 5),
  
  // Multiple fields with different file counts
  uploadFields: (fields) => upload.fields(fields)
};
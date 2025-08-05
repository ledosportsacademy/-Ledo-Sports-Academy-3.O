const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/hero',
    './uploads/activities',
    './uploads/members',
    './uploads/expenses',
    './uploads/experiences',
    './uploads/gallery'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Create upload directories on server start
createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = './uploads';
    
    // Determine upload directory based on route
    if (req.originalUrl.includes('/api/hero')) {
      uploadPath = './uploads/hero';
    } else if (req.originalUrl.includes('/api/activities')) {
      uploadPath = './uploads/activities';
    } else if (req.originalUrl.includes('/api/members')) {
      uploadPath = './uploads/members';
    } else if (req.originalUrl.includes('/api/expenses')) {
      uploadPath = './uploads/expenses';
    } else if (req.originalUrl.includes('/api/experiences')) {
      uploadPath = './uploads/experiences';
    } else if (req.originalUrl.includes('/api/gallery')) {
      uploadPath = './uploads/gallery';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
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

// Middleware for handling file upload errors
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    // An unknown error occurred
    return res.status(500).json({ message: err.message });
  }
  // No error occurred, continue
  next();
};

// Helper function to delete file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  upload,
  handleUploadErrors,
  deleteFile
};
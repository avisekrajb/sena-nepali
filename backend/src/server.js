const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');
const Admin = require('./models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

// CORS configuration - Updated with proper origins
const corsOptions = {
  origin: [
    'https://sena-nepali.onrender.com',
    'https://sena-nepali-backend.onrender.com',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 200,
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware (optional but helpful)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hero', require('./routes/hero'));
app.use('/api/leadership', require('./routes/leadership'));
app.use('/api/central-committee', require('./routes/centralCommittee'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/contact-messages', require('./routes/contactMessages'));
app.use('/api/introduction', require('./routes/introduction'));
app.use('/api/logos', require('./routes/logos'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/interviews', require('./routes/interviews'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/superadmin', require('./routes/superAdmin'));

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 50MB.',
    });
  }

  // Cloudinary error
  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({
      success: false,
      message: 'Error uploading to Cloudinary. Please try again.',
    });
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found. Please check your data.',
    });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== CREATE DEFAULT ADMIN ====================

const createDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'a@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';
    
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        email: adminEmail,
        password: adminPassword,
      });
      console.log(`✅ Default admin created: ${adminEmail}`);
    } else {
      console.log('✅ Default admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

// ==================== CREATE DEFAULT SUPER ADMIN ====================

const createDefaultSuperAdmin = async () => {
  try {
    const SuperAdmin = require('./models/SuperAdmin');
    const superEmail = process.env.SUPER_ADMIN_EMAIL || 'super@gmail.com';
    const superPassword = process.env.SUPER_ADMIN_PASSWORD || 'super123';
    
    const superExists = await SuperAdmin.findOne({ email: superEmail });
    if (!superExists) {
      await SuperAdmin.create({
        email: superEmail,
        password: superPassword,
      });
      console.log(`✅ Default super admin created: ${superEmail}`);
    } else {
      console.log('✅ Default super admin already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default super admin:', error.message);
  }
};

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: ${process.env.API_URL || `http://localhost:${PORT}/api`}`);
  console.log(`✅ Health check: ${process.env.API_URL || `http://localhost:${PORT}`}/api/health`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
  console.log('='.repeat(60));
  
  await createDefaultAdmin();
  await createDefaultSuperAdmin();
});

// ==================== GRACEFUL SHUTDOWN ====================

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

module.exports = app;

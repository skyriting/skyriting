import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import airportRoutes from './routes/airportRoutes.js';
import aircraftRoutes from './routes/aircraftRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import serviceInquiryRoutes from './routes/serviceInquiryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import packageInquiryRoutes from './routes/packageInquiryRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import mobilityThreadRoutes from './routes/mobilityThreadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import helicopterInquiryRoutes from './routes/helicopterInquiryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    // Don't exit in development, allow retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

// API Routes
app.use('/api/airports', airportRoutes);
app.use('/api/aircrafts', aircraftRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/service-inquiry', serviceInquiryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/package-inquiry', packageInquiryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/mobility-thread', mobilityThreadRoutes);
app.use('/api/user', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/helicopter-inquiry', helicopterInquiryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Skyriting API is running' });
});

// Serve static files from the React app in production
// Check if dist folder exists (production build)
const frontendBuildPath = path.join(__dirname, '../dist');
const distExists = fs.existsSync(frontendBuildPath);

if (distExists || process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build
  app.use(express.static(frontendBuildPath));

  // Handle React routing - return all non-API requests to React app
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    // Don't serve index.html for admin routes (they should be handled by React Router)
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Create HTTP server explicitly to attach error handler before listening
const server = http.createServer(app);

// Attach error handler BEFORE calling listen() to catch EADDRINUSE
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    if (process.env.NODE_ENV === 'development') {
      console.error(`   Run: netstat -ano | findstr :${PORT} to find the process ID`);
      console.error(`   Then: taskkill /F /PID <PID> to kill it`);
    }
    // In production (Railway), exit gracefully
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    throw error;
  }
});

// Now call listen() with error handler already attached
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 API available at http://0.0.0.0:${PORT}/api`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production mode enabled`);
  }
});

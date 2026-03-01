import mongoose from 'mongoose';
import AdminUser from '../models/AdminUser.js';

/**
 * Initialize admin user on server startup if it doesn't exist
 * This runs automatically when the server starts
 */
export async function initAdminOnStartup() {
  try {
    // Wait a bit for MongoDB connection to be ready
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Waiting for MongoDB connection...');
      // Wait up to 10 seconds for connection
      let attempts = 0;
      while (mongoose.connection.readyState !== 1 && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  MongoDB not connected, skipping admin initialization');
      return;
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@skyriting.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${ADMIN_EMAIL}`);
      return;
    }

    // Create admin user
    const admin = new AdminUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: 'Skyriting Admin',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully on startup!');
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error initializing admin on startup:', error.message);
    console.error('❌ Error stack:', error.stack);
    // Don't throw - allow server to start even if admin init fails
    // Admin can be created manually later
  }
}

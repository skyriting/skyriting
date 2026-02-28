import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AdminUser from '../models/AdminUser.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://info_db_user:qZIB1wRGhxp9UMdg@cluster0.n2h0xpe.mongodb.net/skyritingdb?appName=Cluster0';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@skyriting.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

async function initAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', ADMIN_EMAIL);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const admin = new AdminUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: 'Skyriting Admin',
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('\n⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    process.exit(1);
  }
}

initAdmin();

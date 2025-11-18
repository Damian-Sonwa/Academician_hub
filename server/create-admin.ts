import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Academicians';

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bys.academy' });
    
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('ℹ️  Admin user already exists!');
        console.log('\n📝 Admin Credentials:');
        console.log('─'.repeat(50));
        console.log('  📧 Email: admin@bys.academy');
        console.log('  🔑 Password: (use existing password or reset it)');
        console.log('─'.repeat(50));
        console.log('\n💡 To reset password, update the user in MongoDB or use the change password feature after logging in.');
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        existingAdmin.password = 'admin123';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role!');
        console.log('\n📝 Admin Credentials:');
        console.log('─'.repeat(50));
        console.log('  📧 Email: admin@bys.academy');
        console.log('  🔑 Password: admin123');
        console.log('─'.repeat(50));
      }
    } else {
      // Create new admin user
      const admin = await User.create({
        name: 'Administrator',
        email: 'admin@bys.academy',
        password: 'admin123',
        role: 'admin',
        level: 1,
        xp: 0,
        badges: ['🛡️ Administrator'],
      });

      console.log('✅ Admin user created successfully!');
      console.log('\n📝 Admin Credentials:');
      console.log('─'.repeat(50));
      console.log('  📧 Email: admin@bys.academy');
      console.log('  🔑 Password: admin123');
      console.log('─'.repeat(50));
      console.log('\n⚠️  IMPORTANT: Change the password after first login for security!');
    }

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();




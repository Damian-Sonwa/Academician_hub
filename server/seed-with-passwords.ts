import mongoose from 'mongoose';
import User from './models/User';

// Use the exact MongoDB URI provided
const MONGODB_URI = 'mongodb+srv://madudamian25_db_user:sopuluchukwu@cluster0.t1jvgmx.mongodb.net/my_elearning?retryWrites=true&w=majority&appName=Cluster0';

const updateUsersWithPasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define user passwords
    const usersToUpdate = [
      { email: 'admin@bys.academy', password: 'admin123' },
      { email: 'sarah@example.com', password: 'teacher123' },
      { email: 'john@example.com', password: 'student123' },
      { email: 'emily@example.com', password: 'student123' },
      { email: 'michael@example.com', password: 'student123' },
    ];

    console.log('🔐 Adding passwords to existing users...');

    for (const userData of usersToUpdate) {
      const user = await User.findOne({ email: userData.email });
      
      if (user) {
        // Update password (will be automatically hashed by pre-save hook)
        user.password = userData.password;
        await user.save();
        console.log(`  ✅ Updated ${userData.email} (password: ${userData.password})`);
      } else {
        console.log(`  ⚠️  User not found: ${userData.email}`);
      }
    }

    console.log('\n🎉 All users updated with passwords!');
    console.log('\n📝 Login Credentials:');
    console.log('─'.repeat(50));
    usersToUpdate.forEach(u => {
      console.log(`  📧 Email: ${u.email}`);
      console.log(`  🔑 Password: ${u.password}`);
      console.log('─'.repeat(50));
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating users:', error);
    process.exit(1);
  }
};

// Run the update function
updateUsersWithPasswords();



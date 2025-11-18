const mongoose = require('mongoose');
require('dotenv').config();

async function verifyConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('✅ Ready state:', mongoose.connection.readyState); // 1 = connected
    
    // Check if users collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:', collections.map(c => c.name).join(', '));
    
    // Check if there are any users
    const User = mongoose.model('User', new mongoose.Schema({}), 'users');
    const userCount = await User.countDocuments();
    console.log('👥 Users in database:', userCount);
    
    if (userCount === 0) {
      console.log('⚠️  No users found! You need to run: npm run seed');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('🔧 Please check:');
    console.error('  1. MongoDB Atlas cluster is running');
    console.error('  2. Your IP is whitelisted in Network Access');
    console.error('  3. Connection string is correct in .env');
    process.exit(1);
  }
}

verifyConnection();


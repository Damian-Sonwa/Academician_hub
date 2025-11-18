import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Academicians';

async function verifyConnection() {
  try {
    console.log('🔌 Verifying MongoDB connection...');
    console.log(`📍 Connecting to: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📚 Collections in database (${collections.length} total):`);
    collections.forEach((col, idx) => {
      console.log(`  ${idx + 1}. ${col.name}`);
    });
    
    // Get collection counts for main collections
    const mainCollections = ['users', 'courses', 'lessons', 'progresses', 'achievements'];
    console.log('\n📊 Collection counts:');
    for (const colName of mainCollections) {
      try {
        const count = await mongoose.connection.db.collection(colName).countDocuments();
        console.log(`  - ${colName}: ${count} documents`);
      } catch (error) {
        console.log(`  - ${colName}: (error reading count)`);
      }
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Verification complete!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Connection error:', error.message);
    if (error.message.includes('authentication')) {
      console.error('💡 Check your MongoDB credentials in .env file');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEOUT')) {
      console.error('💡 Check your network connection and MongoDB Atlas IP whitelist');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Check your MongoDB URI in .env file');
    }
    process.exit(1);
  }
}

verifyConnection();


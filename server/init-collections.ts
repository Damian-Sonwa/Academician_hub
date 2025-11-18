import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import all models to ensure they are registered with mongoose
import './models/User';
import './models/Course';
import './models/Lesson';
import './models/Progress';
import './models/Achievement';
import './models/Notification';
import './models/Subscription';
import './models/Project';
import './models/Message';
import './models/UserAchievement';
import './models/Alphabet';
import './models/Assignment';
import './models/AssignmentSubmission';
import './models/Resource';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Academicians';

/**
 * Initialize MongoDB connection and create all collections
 * This script ensures all collections exist in the database
 */
async function initCollections() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`); // Hide password in logs
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Get all registered models
    const modelNames = Object.keys(mongoose.models);
    console.log(`\n📚 Found ${modelNames.length} registered models:`);
    
    // Initialize collections by creating indexes (this ensures collections exist)
    const collections: string[] = [];
    
    for (const modelName of modelNames) {
      const model = mongoose.models[modelName];
      const collectionName = model.collection.name;
      
      // Create collection if it doesn't exist by creating an index
      try {
        await model.createIndexes();
        collections.push(collectionName);
        console.log(`  ✅ ${collectionName} (from ${modelName} model)`);
      } catch (error: any) {
        console.log(`  ⚠️  ${collectionName} - ${error.message}`);
      }
    }
    
    // List all collections in the database
    console.log('\n📋 All collections in database:');
    const dbCollections = await mongoose.connection.db.listCollections().toArray();
    dbCollections.forEach((col, idx) => {
      const isModelCollection = collections.includes(col.name);
      console.log(`  ${idx + 1}. ${col.name} ${isModelCollection ? '✅' : '📝'}`);
    });
    
    console.log(`\n✅ Successfully initialized ${collections.length} collections`);
    console.log(`📊 Total collections in database: ${dbCollections.length}`);
    
    // Verify connection
    const stats = await mongoose.connection.db.stats();
    console.log(`\n📈 Database Stats:`);
    console.log(`  - Collections: ${stats.collections}`);
    console.log(`  - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error initializing collections:', error.message);
    if (error.message.includes('authentication')) {
      console.error('💡 Tip: Check your MongoDB credentials in .env file');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEOUT')) {
      console.error('💡 Tip: Check your network connection and MongoDB Atlas IP whitelist');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Tip: Check your MongoDB URI in .env file');
    }
    process.exit(1);
  }
}

initCollections();


/**
 * Script to ensure all courses have appropriate subject-specific images
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

const SUBJECT_IMAGES: Record<string, { secondary?: string; advanced?: string; junior?: string }> = {
  Mathematics: {
    secondary: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  },
  Biology: {
    secondary: 'https://images.unsplash.com/photo-1546410531-bb448c177e47?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1536514498804-1085e141197e?w=800&q=80',
  },
  Chemistry: {
    secondary: 'https://images.unsplash.com/photo-1582719478250-c866776b110c?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1594729095022-e2f6d29b8d9f?w=800&q=80',
  },
  Physics: {
    secondary: 'https://images.unsplash.com/photo-1594729095022-e2f6d29b8d9f?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1581092917910-e7b0b2f3b0f0?w=800&q=80',
  },
  English: {
    secondary: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1512820790803-83ca750da1c7?w=800&q=80',
  },
  History: {
    secondary: 'https://images.unsplash.com/photo-1518655048521-a130df29d035?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1517487881594-2787fef5ee47?w=800&q=80',
  },
  Geography: {
    secondary: 'https://images.unsplash.com/photo-1532635241-e020d435e7a2?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1501785888041-af3ba6f60060?w=800&q=80',
  },
  Webdevelopment: {
    secondary: 'https://images.unsplash.com/photo-1521737711867-ee1710707342?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1542831371-29b0f74f94dd?w=800&q=80',
  },
  Python: {
    secondary: 'https://images.unsplash.com/photo-1542831371-29b0f74f94dd?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1521737711867-ee1710707342?w=800&q=80',
  },
  Cybersecurity: {
    secondary: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80',
  },
  French: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  German: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Italian: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Spanish: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Chinese: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Japanese: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Arabic: {
    junior: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    secondary: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
};

async function updateAllImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📚 Total courses: ${allCourses.length}\n`);

    let updatedCount = 0;

    for (const course of allCourses) {
      const subject = course.title.split(' - ')[0];
      const level = course.level.toLowerCase();
      const images = SUBJECT_IMAGES[subject];

      if (images) {
        let expectedImage = '';
        
        if (level === 'junior') {
          expectedImage = images.junior || images.secondary || images.advanced;
        } else if (level === 'secondary') {
          expectedImage = images.secondary || images.intermediate || images.advanced;
        } else if (level === 'advanced') {
          expectedImage = images.advanced || images.secondary;
        }

        if (expectedImage && course.imageUrl !== expectedImage) {
          course.imageUrl = expectedImage;
          await course.save();
          console.log(`  🔄 Updated: ${course.title}`);
          updatedCount++;
        }
      } else {
        // Assign default image if subject not found
        const defaultImage = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80';
        if (!course.imageUrl || course.imageUrl !== defaultImage) {
          course.imageUrl = defaultImage;
          await course.save();
          console.log(`  🔄 Updated (default): ${course.title}`);
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ Updated ${updatedCount} course images\n`);

    // Verify all courses have images
    const finalCourses = await Course.find({}).sort({ title: 1 });
    const coursesWithoutImages = finalCourses.filter(c => !c.imageUrl);
    
    if (coursesWithoutImages.length === 0) {
      console.log('✅ All courses now have images!');
    } else {
      console.log(`⚠️  ${coursesWithoutImages.length} courses still missing images:`);
      coursesWithoutImages.forEach(c => {
        console.log(`  - ${c.title}`);
      });
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

updateAllImages();




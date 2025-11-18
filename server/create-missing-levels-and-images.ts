/**
 * Script to create missing course levels and assign images to all courses
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/Course';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

// Language subjects
const LANGUAGE_SUBJECTS = ['French', 'German', 'Italian', 'Spanish', 'Chinese', 'Japanese', 'Arabic'];

// Academic subjects
const ACADEMIC_SUBJECTS = ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'History', 'Geography', 'Webdevelopment', 'Python', 'Cybersecurity'];

// Image URLs for each subject
const SUBJECT_IMAGES: Record<string, { secondary?: string; advanced?: string; beginner?: string; intermediate?: string }> = {
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
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  German: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Italian: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Spanish: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Chinese: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Japanese: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
  Arabic: {
    beginner: 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
    intermediate: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
    advanced: 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
  },
};

async function createMissingLevelsAndImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const allCourses = await Course.find({}).sort({ title: 1 });
    console.log(`📚 Current courses: ${allCourses.length}\n`);

    let createdCount = 0;
    let updatedCount = 0;

    // Process Academic Subjects
    for (const subject of ACADEMIC_SUBJECTS) {
      const existingCourses = allCourses.filter(c => c.title.startsWith(`${subject} - `));
      const existingLevels = existingCourses.map(c => c.level);
      
      const images = SUBJECT_IMAGES[subject] || {};
      
      // Ensure Secondary level exists
      if (!existingLevels.includes('Secondary')) {
        const course = await Course.create({
          title: `${subject} - Secondary`,
          description: `Comprehensive ${subject.toLowerCase()} course at secondary level.`,
          category: getCategory(subject),
          level: 'Secondary',
          instructor: 'Evolve AI',
          duration: '15 weeks',
          enrolled: 0,
          imageUrl: images.secondary || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
          isPremium: false,
        });
        console.log(`  ✅ Created: ${course.title}`);
        createdCount++;
      } else {
        // Update image if missing
        const course = existingCourses.find(c => c.level === 'Secondary');
        if (course && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = images.secondary || course.imageUrl;
          await course.save();
          console.log(`  🔄 Updated image: ${course.title}`);
          updatedCount++;
        }
      }
      
      // Ensure Advanced level exists
      if (!existingLevels.includes('Advanced')) {
        const course = await Course.create({
          title: `${subject} - Advanced`,
          description: `Advanced ${subject.toLowerCase()} course at university level.`,
          category: getCategory(subject),
          level: 'Advanced',
          instructor: 'Evolve AI',
          duration: '15 weeks',
          enrolled: 0,
          imageUrl: images.advanced || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
          isPremium: false,
        });
        console.log(`  ✅ Created: ${course.title}`);
        createdCount++;
      } else {
        // Update image if missing
        const course = existingCourses.find(c => c.level === 'Advanced');
        if (course && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = images.advanced || course.imageUrl;
          await course.save();
          console.log(`  🔄 Updated image: ${course.title}`);
          updatedCount++;
        }
      }
    }

    // Process Language Subjects
    for (const language of LANGUAGE_SUBJECTS) {
      const existingCourses = allCourses.filter(c => c.title.startsWith(`${language} - `));
      const existingLevels = existingCourses.map(c => c.level);
      
      const images = SUBJECT_IMAGES[language] || {};
      
      // Ensure Beginner level exists (stored as Junior in DB)
      if (!existingLevels.includes('Junior')) {
        const course = await Course.create({
          title: `${language} - Junior`,
          description: `Beginner ${language.toLowerCase()} course for language learners.`,
          category: 'languages',
          level: 'Junior',
          instructor: 'Evolve AI',
          duration: '12 weeks',
          enrolled: 0,
          imageUrl: images.beginner || 'https://images.unsplash.com/photo-1505682634904-d7c805379ce2?w=800&q=80',
          isPremium: false,
        });
        console.log(`  ✅ Created: ${course.title}`);
        createdCount++;
      } else {
        // Update image if missing
        const course = existingCourses.find(c => c.level === 'Junior');
        if (course && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = images.beginner || course.imageUrl;
          await course.save();
          console.log(`  🔄 Updated image: ${course.title}`);
          updatedCount++;
        }
      }
      
      // Ensure Intermediate level exists (stored as Secondary in DB)
      if (!existingLevels.includes('Secondary')) {
        const course = await Course.create({
          title: `${language} - Secondary`,
          description: `Intermediate ${language.toLowerCase()} course for language learners.`,
          category: 'languages',
          level: 'Secondary',
          instructor: 'Evolve AI',
          duration: '12 weeks',
          enrolled: 0,
          imageUrl: images.intermediate || 'https://images.unsplash.com/photo-1546587348-d12660c30c50?w=800&q=80',
          isPremium: false,
        });
        console.log(`  ✅ Created: ${course.title}`);
        createdCount++;
      } else {
        // Update image if missing
        const course = existingCourses.find(c => c.level === 'Secondary');
        if (course && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = images.intermediate || course.imageUrl;
          await course.save();
          console.log(`  🔄 Updated image: ${course.title}`);
          updatedCount++;
        }
      }
      
      // Ensure Advanced level exists
      if (!existingLevels.includes('Advanced')) {
        const course = await Course.create({
          title: `${language} - Advanced`,
          description: `Advanced ${language.toLowerCase()} course for fluent speakers.`,
          category: 'languages',
          level: 'Advanced',
          instructor: 'Evolve AI',
          duration: '12 weeks',
          enrolled: 0,
          imageUrl: images.advanced || 'https://images.unsplash.com/photo-1520085601670-ee14aa5fa3e8?w=800&q=80',
          isPremium: false,
        });
        console.log(`  ✅ Created: ${course.title}`);
        createdCount++;
      } else {
        // Update image if missing
        const course = existingCourses.find(c => c.level === 'Advanced');
        if (course && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = images.advanced || course.imageUrl;
          await course.save();
          console.log(`  🔄 Updated image: ${course.title}`);
          updatedCount++;
        }
      }
    }

    // Update images for all existing courses that might have default/placeholder images
    const allCoursesAfter = await Course.find({}).sort({ title: 1 });
    for (const course of allCoursesAfter) {
      const subject = course.title.split(' - ')[0];
      const level = course.level;
      const images = SUBJECT_IMAGES[subject];
      
      if (images) {
        let expectedImage = '';
        if (LANGUAGE_SUBJECTS.includes(subject)) {
          if (level === 'Junior') expectedImage = images.beginner;
          else if (level === 'Secondary') expectedImage = images.intermediate;
          else if (level === 'Advanced') expectedImage = images.advanced;
        } else {
          if (level === 'Secondary') expectedImage = images.secondary;
          else if (level === 'Advanced') expectedImage = images.advanced;
        }
        
        if (expectedImage && (!course.imageUrl || course.imageUrl.includes('unsplash.com/photo-1501504905252'))) {
          course.imageUrl = expectedImage;
          await course.save();
          if (!updatedCount.toString().includes('Updated')) {
            console.log(`  🔄 Updated image: ${course.title}`);
            updatedCount++;
          }
        }
      }
    }

    console.log(`\n✅ Summary:`);
    console.log(`  - Created ${createdCount} new courses`);
    console.log(`  - Updated ${updatedCount} course images`);

    // Show final structure
    const finalCourses = await Course.find({}).sort({ title: 1 });
    console.log(`\n📊 Final Course Structure (${finalCourses.length} courses):\n`);
    
    const bySubject = new Map<string, any[]>();
    finalCourses.forEach(course => {
      const subject = course.title.split(' - ')[0] || course.title;
      if (!bySubject.has(subject)) {
        bySubject.set(subject, []);
      }
      bySubject.get(subject)!.push(course);
    });
    
    bySubject.forEach((courseList, subject) => {
      console.log(`${subject}:`);
      courseList.forEach(course => {
        const hasImage = course.imageUrl ? '✓' : '✗';
        console.log(`  - ${course.title} (Level: ${course.level}) [Image: ${hasImage}]`);
      });
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected');
  }
}

function getCategory(subject: string): string {
  const categoryMap: Record<string, string> = {
    Mathematics: 'math',
    Biology: 'science',
    Chemistry: 'science',
    Physics: 'science',
    English: 'english',
    History: 'history',
    Geography: 'geography',
    Webdevelopment: 'webdev',
    Python: 'python',
    Cybersecurity: 'cybersecurity',
  };
  return categoryMap[subject] || 'general';
}

createMissingLevelsAndImages();




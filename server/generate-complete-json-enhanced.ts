/**
 * Generate complete JSON files for ALL courses at ALL levels
 * Enhanced version that ensures ALL lessons are generated for each course
 */

import fs from 'fs';
import path from 'path';
import { generateLessonsForCourse } from './utils/lessonGenerator.js';

// All courses from seed.ts - including all cybersecurity courses separately
const allCourses = [
  // Science - Biology
  { name: 'biology', category: 'science', title: 'Introduction to Biology', level: 'Junior' },
  { name: 'biology', category: 'science', title: 'Cell Biology and Genetics', level: 'Secondary' },
  { name: 'biology', category: 'science', title: 'Advanced Molecular Biology', level: 'Advanced' },
  
  // Science - Chemistry
  { name: 'chemistry', category: 'science', title: 'Chemistry Fundamentals', level: 'Junior' },
  { name: 'chemistry', category: 'science', title: 'Organic Chemistry', level: 'Secondary' },
  { name: 'chemistry', category: 'science', title: 'Advanced Biochemistry', level: 'Advanced' },
  
  // Science - Physics
  { name: 'physics', category: 'science', title: 'Physics: Mechanics and Motion', level: 'Junior' },
  { name: 'physics', category: 'science', title: 'Electricity and Magnetism', level: 'Secondary' },
  { name: 'physics', category: 'science', title: 'Quantum Physics', level: 'Advanced' },
  
  // Math
  { name: 'mathematics', category: 'math', title: 'Algebra Essentials', level: 'Junior' },
  { name: 'mathematics', category: 'math', title: 'Geometry and Trigonometry', level: 'Secondary' },
  { name: 'mathematics', category: 'math', title: 'Calculus I: Limits and Derivatives', level: 'Advanced' },
  { name: 'mathematics', category: 'math', title: 'Statistics for Data Science', level: 'Advanced' },
  
  // Languages
  { name: 'spanish', category: 'languages', title: 'Spanish for Beginners', level: 'Junior' },
  { name: 'spanish', category: 'languages', title: 'Intermediate Spanish Conversation', level: 'Secondary' },
  { name: 'french', category: 'languages', title: 'French Fundamentals', level: 'Junior' },
  { name: 'french', category: 'languages', title: 'Advanced French Literature', level: 'Advanced' },
  { name: 'german', category: 'languages', title: 'German Language Basics', level: 'Junior' },
  { name: 'german', category: 'languages', title: 'Business German', level: 'Secondary' },
  { name: 'chinese', category: 'languages', title: 'Mandarin Chinese for Beginners', level: 'Junior' },
  { name: 'japanese', category: 'languages', title: 'Japanese Language & Culture', level: 'Junior' },
  { name: 'arabic', category: 'languages', title: 'Arabic for Travelers', level: 'Junior' },
  { name: 'italian', category: 'languages', title: 'Italian Conversation Practice', level: 'Secondary' },
  
  // Programming
  { name: 'python', category: 'python', title: 'Python Programming Basics', level: 'Junior' },
  { name: 'python', category: 'python', title: 'Advanced Python: Data Science', level: 'Advanced' },
  { name: 'webdevelopment', category: 'webdev', title: 'Web Development Fundamentals', level: 'Junior' },
  { name: 'webdevelopment', category: 'webdev', title: 'Full-Stack JavaScript Development', level: 'Advanced' },
  
  // Cybersecurity - Each course separately
  { name: 'cybersecurity', category: 'cybersecurity', title: 'Introduction to Cybersecurity', level: 'Junior' },
  { name: 'cybersecurity-network', category: 'cybersecurity', title: 'Network Security', level: 'Secondary' },
  { name: 'cybersecurity-webapp', category: 'cybersecurity', title: 'Web Application Security', level: 'Secondary' },
  { name: 'cybersecurity-ethical', category: 'cybersecurity', title: 'Ethical Hacking Basics', level: 'Secondary' },
  { name: 'cybersecurity-forensics', category: 'cybersecurity', title: 'Digital Forensics', level: 'Advanced' },
  { name: 'cybersecurity-pentest', category: 'cybersecurity', title: 'Advanced Penetration Testing', level: 'Advanced' },
  { name: 'cybersecurity-cloud', category: 'cybersecurity', title: 'Cloud Security', level: 'Advanced' },
  
  // Humanities
  { name: 'english', category: 'english', title: 'Creative Writing Workshop', level: 'Junior' },
  { name: 'english', category: 'english', title: 'English Literature: Shakespeare', level: 'Secondary' },
  { name: 'history', category: 'history', title: 'World History: Ancient Civilizations', level: 'Junior' },
  { name: 'history', category: 'history', title: 'Modern World History', level: 'Secondary' },
  { name: 'geography', category: 'geography', title: 'Physical Geography', level: 'Junior' },
  { name: 'geography', category: 'geography', title: 'Human Geography and Culture', level: 'Secondary' },
];

// Map database levels to JSON level names
const levelToJson: Record<string, string> = {
  'Junior': 'beginner',
  'Secondary': 'intermediate',
  'Advanced': 'advanced',
};

// Helper to generate materials from lesson resources
function generateMaterials(lesson: any, category: string, level: string, courseTitle: string): any {
  const materials: any = {
    videos: [],
    textbooks: [],
    labs: [],
  };

  // Extract video URL if present
  if (lesson.videoUrl) {
    materials.videos.push({
      title: lesson.title,
      url: lesson.videoUrl,
    });
  } else {
    materials.videos.push({
      title: `${lesson.title} - Tutorial`,
      url: getVideoUrl(category, lesson.title),
    });
  }

  // Process resources array
  if (lesson.resources && Array.isArray(lesson.resources)) {
    lesson.resources.forEach((resource: string) => {
      const lower = resource.toLowerCase();
      const url = extractUrl(resource);
      
      if (lower.includes('textbook') || lower.includes('book') || lower.includes('pdf') || lower.includes('guide') || lower.includes('reading')) {
        materials.textbooks.push({
          title: cleanResourceTitle(resource),
          url: url || getTextbookUrl(category, lesson.title),
        });
      } else if (lower.includes('video')) {
        if (url) {
          materials.videos.push({
            title: cleanResourceTitle(resource),
            url: url,
          });
        }
      } else {
        materials.labs.push({
          title: cleanResourceTitle(resource),
          url: url || getLabUrl(category, lesson.title),
        });
      }
    });
  }

  // Add default materials if none found
  if (materials.textbooks.length === 0) {
    materials.textbooks.push({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Textbook - ${level} Level`,
      url: getTextbookUrl(category, lesson.title),
    });
  }

  if (materials.labs.length === 0) {
    materials.labs.push({
      title: `${lesson.title} Practice Exercises`,
      url: getLabUrl(category, lesson.title),
    });
  }

  return materials;
}

function cleanResourceTitle(resource: string): string {
  return resource
    .replace(/^(Video|Textbook|Book|PDF|Guide|Reading|Lab|Practice|Quiz|Exercise|Interactive):\s*/i, '')
    .replace(/\s*-\s*https?:\/\/.*$/, '')
    .trim();
}

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

function getVideoUrl(category: string, topic: string): string {
  const categoryVideos: Record<string, string> = {
    science: 'https://youtu.be/dQw4w9WgXcQ',
    math: 'https://youtu.be/dQw4w9WgXcQ',
    languages: 'https://youtu.be/dQw4w9WgXcQ',
    python: 'https://youtu.be/kqtD5dpn9C8',
    webdev: 'https://youtu.be/UB1O30fR-EE',
    cybersecurity: 'https://youtu.be/inWWhr5tnEA',
    english: 'https://youtu.be/wR8CP0qJNWg',
    history: 'https://youtu.be/Yocja_N5s1I',
    geography: 'https://youtu.be/7_pw8duzGUg',
  };
  return categoryVideos[category] || 'https://youtu.be/dQw4w9WgXcQ';
}

function getTextbookUrl(category: string, topic: string): string {
  const categoryUrls: Record<string, string> = {
    science: 'https://openstax.org/details/books/biology-2e',
    math: 'https://openstax.org/books/algebra-and-trigonometry',
    languages: 'https://www.languageguide.org/',
    python: 'https://docs.python.org/3/tutorial/',
    webdev: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    cybersecurity: 'https://owasp.org/www-project-top-ten/',
    english: 'https://owl.purdue.edu/owl/',
    history: 'https://openstax.org/details/books/world-history-volume-1',
    geography: 'https://www.nationalgeographic.org/education/',
  };
  return categoryUrls[category] || 'https://www.example.com/textbook';
}

function getLabUrl(category: string, topic: string): string {
  const categoryUrls: Record<string, string> = {
    science: 'https://phet.colorado.edu/',
    math: 'https://www.desmos.com/calculator',
    languages: 'https://www.languageguide.org/',
    python: 'https://www.practicepython.org/',
    webdev: 'https://codepen.io/',
    cybersecurity: 'https://tryhackme.com/',
    english: 'https://www.writersdigest.com/',
    history: 'https://www.khanacademy.org/humanities/world-history',
    geography: 'https://www.nationalgeographic.org/education/',
  };
  return categoryUrls[category] || 'https://www.example.com/lab';
}

function generateSummary(lesson: any): string {
  let summary = lesson.description || '';
  const content = lesson.content || '';
  
  if (content && content.length > 50) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length > 0) {
      summary += ` ${sentences[0]}.`;
    }
    if (sentences.length > 1 && summary.split(/[.!?]+/).length < 4) {
      summary += ` ${sentences[1]}.`;
    }
  }
  
  const sentenceCount = summary.split(/[.!?]+/).filter(s => s.trim().length > 10).length;
  if (sentenceCount < 3) {
    summary += ` This lesson provides comprehensive coverage of the topic with practical examples and hands-on activities.`;
    summary += ` Students will gain a deep understanding through interactive learning materials and real-world applications.`;
  }
  if (sentenceCount < 4) {
    summary += ` The lesson includes detailed explanations, visual aids, and assessment tools to ensure mastery of the concepts.`;
  }
  
  return summary.trim();
}

// Enhanced: Generate additional lessons for courses that only have 1 lesson
function expandLessons(lessons: any[], category: string, level: string, courseTitle: string): any[] {
  if (lessons.length >= 4) {
    return lessons; // Already has enough lessons
  }

  // For cybersecurity courses with only 1 lesson, add related topics
  if (category === 'cybersecurity' && lessons.length === 1) {
    const mainLesson = lessons[0];
    const additionalLessons: any[] = [];

    if (courseTitle.includes('Network Security')) {
      additionalLessons.push(
        {
          title: 'Firewall Configuration',
          description: 'Learn to configure and manage firewalls effectively.',
          content: 'Master firewall rules, access control lists, and security policies. Understand stateful vs stateless firewalls and how to implement proper network segmentation.',
          duration: 50,
          videoUrl: 'https://youtu.be/2_lswM1S264',
          resources: ['Firewall Configuration Guide', 'ACL Best Practices', 'Lab: Firewall Setup'],
        },
        {
          title: 'Intrusion Detection and Prevention',
          description: 'Implement IDS/IPS systems to monitor and protect networks.',
          content: 'Learn about signature-based and anomaly-based detection. Understand how to configure IDS/IPS rules and respond to security alerts.',
          duration: 55,
          videoUrl: 'https://youtu.be/2_lswM1S264',
          resources: ['IDS/IPS Configuration', 'Alert Management', 'Lab: IDS Setup'],
        },
        {
          title: 'VPN and Secure Communications',
          description: 'Implement VPNs and secure communication channels.',
          content: 'Study VPN protocols (IPSec, SSL/TLS), remote access solutions, and secure tunneling. Learn to configure and troubleshoot VPN connections.',
          duration: 50,
          videoUrl: 'https://youtu.be/2_lswM1S264',
          resources: ['VPN Setup Guide', 'Protocol Comparison', 'Lab: VPN Configuration'],
        }
      );
    } else if (courseTitle.includes('Web Application Security')) {
      additionalLessons.push(
        {
          title: 'SQL Injection Attacks',
          description: 'Understand and defend against SQL injection vulnerabilities.',
          content: 'Learn how SQL injection works, different injection types, and how to prevent them using parameterized queries and input validation.',
          duration: 60,
          videoUrl: 'https://youtu.be/5tJvaYq8jK4',
          resources: ['SQL Injection Guide', 'Prevention Techniques', 'Lab: SQL Injection Practice'],
        },
        {
          title: 'Cross-Site Scripting (XSS)',
          description: 'Master XSS attack vectors and defense mechanisms.',
          content: 'Study reflected, stored, and DOM-based XSS. Learn content security policies, input sanitization, and output encoding to prevent XSS attacks.',
          duration: 55,
          videoUrl: 'https://youtu.be/5tJvaYq8jK4',
          resources: ['XSS Attack Types', 'Defense Strategies', 'Lab: XSS Testing'],
        },
        {
          title: 'Authentication and Session Management',
          description: 'Secure user authentication and session handling.',
          content: 'Learn about secure password storage, multi-factor authentication, session tokens, and common authentication vulnerabilities.',
          duration: 50,
          videoUrl: 'https://youtu.be/5tJvaYq8jK4',
          resources: ['Auth Best Practices', 'Session Security', 'Lab: Auth Implementation'],
        }
      );
    } else if (courseTitle.includes('Ethical Hacking')) {
      additionalLessons.push(
        {
          title: 'Reconnaissance and Information Gathering',
          description: 'Learn passive and active reconnaissance techniques.',
          content: 'Master OSINT tools, network scanning, service enumeration, and footprinting. Understand how attackers gather information before launching attacks.',
          duration: 55,
          videoUrl: 'https://youtu.be/3Kq1MIfTWCE',
          resources: ['Reconnaissance Tools', 'Information Gathering Guide', 'Lab: Network Scanning'],
        },
        {
          title: 'Vulnerability Assessment',
          description: 'Identify and assess security vulnerabilities.',
          content: 'Learn to use vulnerability scanners, interpret scan results, and prioritize vulnerabilities based on risk. Understand CVSS scoring and remediation strategies.',
          duration: 60,
          videoUrl: 'https://youtu.be/3Kq1MIfTWCE',
          resources: ['Vulnerability Scanning', 'CVSS Guide', 'Lab: Vulnerability Assessment'],
        },
        {
          title: 'Exploitation Techniques',
          description: 'Understand how vulnerabilities are exploited.',
          content: 'Study common exploitation methods, payload development, and post-exploitation activities. Learn ethical exploitation in controlled environments.',
          duration: 65,
          videoUrl: 'https://youtu.be/3Kq1MIfTWCE',
          resources: ['Exploitation Framework', 'Payload Development', 'Lab: Controlled Exploitation'],
        }
      );
    } else if (courseTitle.includes('Digital Forensics')) {
      additionalLessons.push(
        {
          title: 'Disk Imaging and Preservation',
          description: 'Create and preserve forensic disk images.',
          content: 'Learn disk imaging techniques, write blockers, hash verification, and chain of custody procedures. Understand different image formats and tools.',
          duration: 60,
          videoUrl: 'https://youtu.be/YcY4iYx0Zxo',
          resources: ['Disk Imaging Tools', 'Chain of Custody', 'Lab: Disk Imaging'],
        },
        {
          title: 'File System Analysis',
          description: 'Analyze file systems to recover evidence.',
          content: 'Study NTFS, ext4, and HFS+ file systems. Learn to recover deleted files, analyze file metadata, and trace file access patterns.',
          duration: 65,
          videoUrl: 'https://youtu.be/YcY4iYx0Zxo',
          resources: ['File System Guide', 'Recovery Techniques', 'Lab: File Analysis'],
        },
        {
          title: 'Timeline Analysis and Reporting',
          description: 'Create timelines and forensic reports.',
          content: 'Learn to build event timelines, correlate evidence, and write comprehensive forensic reports. Understand legal requirements and presentation techniques.',
          duration: 55,
          videoUrl: 'https://youtu.be/YcY4iYx0Zxo',
          resources: ['Timeline Tools', 'Report Writing Guide', 'Lab: Report Creation'],
        }
      );
    } else if (courseTitle.includes('Advanced Penetration Testing') || courseTitle.includes('Penetration Testing')) {
      additionalLessons.push(
        {
          title: 'Privilege Escalation',
          description: 'Escalate privileges in compromised systems.',
          content: 'Learn Windows and Linux privilege escalation techniques, kernel exploits, misconfigurations, and how to maintain elevated access.',
          duration: 70,
          videoUrl: 'https://youtu.be/vz0rUksQ3xk',
          resources: ['Privilege Escalation Guide', 'Exploit Development', 'Lab: Privilege Escalation'],
        },
        {
          title: 'Active Directory Exploitation',
          description: 'Compromise and pivot through AD environments.',
          content: 'Master AD enumeration, Kerberos attacks, lateral movement, and persistence techniques in enterprise environments.',
          duration: 75,
          videoUrl: 'https://youtu.be/vz0rUksQ3xk',
          resources: ['AD Security Guide', 'Lateral Movement', 'Lab: AD Exploitation'],
        },
        {
          title: 'Red Team Operations',
          description: 'Plan and execute red team engagements.',
          content: 'Learn red team methodology, attack simulation, evasion techniques, and how to operate undetected in target environments.',
          duration: 70,
          videoUrl: 'https://youtu.be/vz0rUksQ3xk',
          resources: ['Red Team Framework', 'Evasion Techniques', 'Lab: Red Team Exercise'],
        }
      );
    } else if (courseTitle.includes('Cloud Security')) {
      additionalLessons.push(
        {
          title: 'AWS Security Fundamentals',
          description: 'Secure Amazon Web Services infrastructure.',
          content: 'Learn IAM policies, security groups, VPC configuration, CloudTrail, and AWS security best practices.',
          duration: 65,
          videoUrl: 'https://youtu.be/JIbIYCM48to',
          resources: ['AWS Security Guide', 'IAM Best Practices', 'Lab: AWS Security'],
        },
        {
          title: 'Azure and Google Cloud Security',
          description: 'Secure multi-cloud environments.',
          content: 'Study Azure AD, resource groups, Google Cloud IAM, and cross-cloud security strategies.',
          duration: 60,
          videoUrl: 'https://youtu.be/JIbIYCM48to',
          resources: ['Multi-Cloud Security', 'Cloud Comparison', 'Lab: Cloud Security'],
        },
        {
          title: 'Cloud Incident Response',
          description: 'Respond to security incidents in cloud environments.',
          content: 'Learn cloud-specific incident response procedures, log analysis, and recovery strategies for cloud-based attacks.',
          duration: 55,
          videoUrl: 'https://youtu.be/JIbIYCM48to',
          resources: ['Cloud IR Guide', 'Log Analysis', 'Lab: Incident Response'],
        }
      );
    }

    return [mainLesson, ...additionalLessons];
  }

  return lessons;
}

function generateAllCourseJSON() {
  console.log('🚀 Generating complete JSON files for ALL courses at ALL levels...\n');

  const baseDir = path.join(process.cwd(), 'seed', 'courses');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let totalFiles = 0;
  let totalTopics = 0;
  const processed: Record<string, boolean> = {};

  // Process each course
  for (const course of allCourses) {
    const jsonLevel = levelToJson[course.level];
    const courseKey = `${course.name}-${jsonLevel}`;
    
    if (processed[courseKey]) {
      continue; // Skip duplicates
    }
    processed[courseKey] = true;

    console.log(`📖 ${course.title} (${course.name}/${jsonLevel})`);

    const courseDir = path.join(baseDir, course.name);
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
    }

    // Generate lessons using lessonGenerator
    let generatedLessons = generateLessonsForCourse(
      course.category,
      course.level,
      course.title
    );
    
    // Expand lessons if needed
    generatedLessons = expandLessons(generatedLessons, course.category, course.level, course.title);
    
    if (generatedLessons.length === 0) {
      console.log(`      ⚠️  No lessons generated`);
      continue;
    }

    // Convert to JSON format
    const jsonLessons = generatedLessons.map((lesson) => {
      const materials = generateMaterials(lesson, course.category, course.level, course.title);
      const summary = generateSummary(lesson);

      return {
        title: lesson.title,
        summary: summary,
        materials: materials,
      };
    });

    // Write JSON file
    const jsonFile = path.join(courseDir, `${jsonLevel}.json`);
    
    // If file exists, merge with existing (for courses with multiple entries at same level)
    let existingLessons: any[] = [];
    if (fs.existsSync(jsonFile)) {
      try {
        existingLessons = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Merge lessons, avoiding duplicates
    const mergedLessons = [...existingLessons];
    for (const newLesson of jsonLessons) {
      if (!mergedLessons.find(l => l.title === newLesson.title)) {
        mergedLessons.push(newLesson);
      }
    }

    fs.writeFileSync(jsonFile, JSON.stringify(mergedLessons, null, 2), 'utf-8');
    
    console.log(`      ✅ Generated ${jsonLessons.length} topics (total: ${mergedLessons.length}) → ${jsonLevel}.json`);
    totalFiles++;
    totalTopics += jsonLessons.length;
  }

  console.log('\n🎉 Generation complete!');
  console.log(`📊 Summary:`);
  console.log(`   - JSON files created/updated: ${totalFiles}`);
  console.log(`   - Total topics added: ${totalTopics}`);
  console.log(`   - Location: ${baseDir}`);
}

// Run the generator
generateAllCourseJSON();




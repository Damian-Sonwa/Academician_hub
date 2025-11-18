/**
 * Get topic-specific YouTube videos for lessons
 * Returns relevant educational videos based on lesson title and category
 */

export function getTopicVideo(title: string, category: string): string | undefined {
  const titleLower = title.toLowerCase();
  const categoryLower = category.toLowerCase();

  // CSS Videos
  if (titleLower.includes('css') || titleLower.includes('styling') || titleLower.includes('cascading')) {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=1Rs2ND1ryYc'; // CSS Full Course for Beginners
    }
    if (titleLower.includes('box model') || titleLower.includes('box-model')) {
      return 'https://www.youtube.com/watch?v=rIO5326FgPE'; // CSS Box Model Explained
    }
    if (titleLower.includes('flexbox') || titleLower.includes('flex')) {
      return 'https://www.youtube.com/watch?v=u044iM9xsWU'; // Flexbox in 20 Minutes
    }
    if (titleLower.includes('grid')) {
      return 'https://www.youtube.com/watch?v=9zBsdzdE4sM'; // CSS Grid Layout Crash Course
    }
    if (titleLower.includes('responsive') || titleLower.includes('media query')) {
      return 'https://www.youtube.com/watch?v=srvUrASNdxk'; // Responsive Web Design
    }
    return 'https://www.youtube.com/watch?v=1Rs2ND1ryYc'; // Default CSS video
  }

  // HTML Videos
  if (titleLower.includes('html') || titleLower.includes('markup') || titleLower.includes('hypertext')) {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=kUMe1FH4CHE'; // HTML Full Course
    }
    if (titleLower.includes('form') || titleLower.includes('input')) {
      return 'https://www.youtube.com/watch?v=fNcJu0IZbfE'; // HTML Forms
    }
    if (titleLower.includes('semantic')) {
      return 'https://www.youtube.com/watch?v=kGW8Al_cga4'; // Semantic HTML
    }
    return 'https://www.youtube.com/watch?v=kUMe1FH4CHE'; // Default HTML video
  }

  // JavaScript Videos
  if (titleLower.includes('javascript') || titleLower.includes('js') || titleLower.includes('script')) {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=W6NZfCO5SIk'; // JavaScript for Beginners
    }
    if (titleLower.includes('dom') || titleLower.includes('document object')) {
      return 'https://www.youtube.com/watch?v=0ik6X4DJKCc'; // JavaScript DOM Manipulation
    }
    if (titleLower.includes('function')) {
      return 'https://www.youtube.com/watch?v=N8ap4k_1QEQ'; // JavaScript Functions
    }
    if (titleLower.includes('event') || titleLower.includes('listener')) {
      return 'https://www.youtube.com/watch?v=XFT7REenHYE'; // JavaScript Events
    }
    if (titleLower.includes('async') || titleLower.includes('promise')) {
      return 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs'; // Async JavaScript
    }
    return 'https://www.youtube.com/watch?v=W6NZfCO5SIk'; // Default JavaScript video
  }

  // Python Videos
  if (titleLower.includes('python') || categoryLower === 'python') {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=kqtD5dpn9C8'; // Python for Beginners
    }
    if (titleLower.includes('variable') || titleLower.includes('data type')) {
      return 'https://www.youtube.com/watch?v=khKv-8q7YmY'; // Python Variables
    }
    if (titleLower.includes('function')) {
      return 'https://www.youtube.com/watch?v=9Os0o3wzS_I'; // Python Functions
    }
    if (titleLower.includes('loop') || titleLower.includes('iteration')) {
      return 'https://www.youtube.com/watch?v=OnDr4J2UXSA'; // Python Loops
    }
    if (titleLower.includes('list') || titleLower.includes('array')) {
      return 'https://www.youtube.com/watch?v=tw7ror9x32s'; // Python Lists
    }
    if (titleLower.includes('dictionary') || titleLower.includes('dict')) {
      return 'https://www.youtube.com/watch?v=daefaLgNkw0'; // Python Dictionaries
    }
    return 'https://www.youtube.com/watch?v=kqtD5dpn9C8'; // Default Python video
  }

  // Biology Videos
  if (titleLower.includes('cell') || (categoryLower === 'science' && titleLower.includes('biology'))) {
    if (titleLower.includes('introduction') || titleLower.includes('structure')) {
      return 'https://www.youtube.com/watch?v=URUJD5NEXC8'; // Introduction to Cells
    }
    if (titleLower.includes('organelle')) {
      return 'https://www.youtube.com/watch?v=8IlzKri08kk'; // Cell Organelles
    }
    if (titleLower.includes('mitochondria')) {
      return 'https://www.youtube.com/watch?v=4v-5x7k9zqQ'; // Mitochondria
    }
    return 'https://www.youtube.com/watch?v=URUJD5NEXC8'; // Default Biology video
  }

  // Chemistry Videos
  if (titleLower.includes('atom') || titleLower.includes('molecule') || (categoryLower === 'science' && titleLower.includes('chemistry'))) {
    if (titleLower.includes('introduction') || titleLower.includes('structure')) {
      return 'https://www.youtube.com/watch?v=QnQe0xW_JY4'; // Atomic Structure
    }
    if (titleLower.includes('periodic') || titleLower.includes('table')) {
      return 'https://www.youtube.com/watch?v=0RRVV4Diomg'; // Periodic Table
    }
    if (titleLower.includes('bond') || titleLower.includes('bonding')) {
      return 'https://www.youtube.com/watch?v=QXT4OVM4vXI'; // Chemical Bonding
    }
    return 'https://www.youtube.com/watch?v=QnQe0xW_JY4'; // Default Chemistry video
  }

  // Math Videos
  if (titleLower.includes('equation') || titleLower.includes('formula') || categoryLower === 'math' || categoryLower === 'mathematics') {
    if (titleLower.includes('linear') || titleLower.includes('equation')) {
      return 'https://www.youtube.com/watch?v=Z-ZkmpQBIFo'; // Linear Equations
    }
    if (titleLower.includes('quadratic')) {
      return 'https://www.youtube.com/watch?v=IlNAJl36-10'; // Quadratic Equations
    }
    if (titleLower.includes('algebra')) {
      return 'https://www.youtube.com/watch?v=NybHckSEQBI'; // Algebra Basics
    }
    return 'https://www.youtube.com/watch?v=Z-ZkmpQBIFo'; // Default Math video
  }

  // Language Learning Videos
  if (categoryLower === 'languages' || categoryLower === 'english') {
    if (titleLower.includes('alphabet') || titleLower.includes('basics')) {
      // Language-specific alphabet videos
      if (titleLower.includes('spanish') || title.includes('Spanish')) {
        return 'https://www.youtube.com/watch?v=hsLYD1Jyf3A'; // Spanish Alphabet
      }
      if (titleLower.includes('french') || title.includes('French')) {
        return 'https://www.youtube.com/watch?v=5uDFjklYfbs'; // French Alphabet
      }
      if (titleLower.includes('german') || title.includes('German')) {
        return 'https://www.youtube.com/watch?v=KJbEYPFgZ6Y'; // German Alphabet
      }
      if (titleLower.includes('chinese') || titleLower.includes('mandarin')) {
        return 'https://www.youtube.com/watch?v=YhM1Q6b0hHs'; // Chinese Pinyin
      }
      if (titleLower.includes('japanese')) {
        return 'https://www.youtube.com/watch?v=8IpHIUxhdaI'; // Japanese Hiragana
      }
      return 'https://www.youtube.com/watch?v=z9H7YgR1N2E'; // General Alphabet Learning
    }
    if (titleLower.includes('greeting') || titleLower.includes('introduction')) {
      return 'https://www.youtube.com/watch?v=GcW4x7Skx2Q'; // Basic Greetings
    }
    if (titleLower.includes('grammar') || titleLower.includes('verb')) {
      return 'https://www.youtube.com/watch?v=Y6T3iVx0zNc'; // Grammar Basics
    }
  }

  // Cybersecurity Videos
  if (categoryLower === 'cybersecurity' || titleLower.includes('security') || titleLower.includes('cyber')) {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=inWWhr5tnEA'; // Cybersecurity Basics
    }
    if (titleLower.includes('network') || titleLower.includes('networking')) {
      return 'https://www.youtube.com/watch?v=qiQR5rTSshw'; // Network Security
    }
    if (titleLower.includes('hack') || titleLower.includes('penetration')) {
      return 'https://www.youtube.com/watch?v=3Kq1MIfTWCE'; // Ethical Hacking
    }
    return 'https://www.youtube.com/watch?v=inWWhr5tnEA'; // Default Cybersecurity video
  }

  // Web Development Videos
  if (categoryLower === 'webdev' || titleLower.includes('web development')) {
    if (titleLower.includes('introduction') || titleLower.includes('basics')) {
      return 'https://www.youtube.com/watch?v=zJSY8tbf_ys'; // Web Development Full Course
    }
    if (titleLower.includes('react')) {
      return 'https://www.youtube.com/watch?v=DLX62G4lc44'; // React Tutorial
    }
    if (titleLower.includes('node') || titleLower.includes('backend')) {
      return 'https://www.youtube.com/watch?v=TlB_eWDSMt4'; // Node.js Tutorial
    }
    return 'https://www.youtube.com/watch?v=zJSY8tbf_ys'; // Default Web Dev video
  }

  // History Videos
  if (categoryLower === 'history') {
    if (titleLower.includes('world war') || titleLower.includes('ww')) {
      return 'https://www.youtube.com/watch?v=CdbnOGEs2J8'; // World War History
    }
    if (titleLower.includes('ancient')) {
      return 'https://www.youtube.com/watch?v=yOmOFLbHyfY'; // Ancient History
    }
    return 'https://www.youtube.com/watch?v=xuCn8ux2gbs'; // General History
  }

  // Geography Videos
  if (categoryLower === 'geography') {
    if (titleLower.includes('map') || titleLower.includes('continent')) {
      return 'https://www.youtube.com/watch?v=Z8brpoU_HNI'; // World Geography
    }
    if (titleLower.includes('climate') || titleLower.includes('weather')) {
      return 'https://www.youtube.com/watch?v=YbAWny7FV3w'; // Climate and Weather
    }
    return 'https://www.youtube.com/watch?v=Z8brpoU_HNI'; // Default Geography video
  }

  // Physics Videos
  if (categoryLower === 'science' && titleLower.includes('physics')) {
    if (titleLower.includes('motion') || titleLower.includes('kinematics')) {
      return 'https://www.youtube.com/watch?v=ZM8ECpBuQYE'; // Motion and Kinematics
    }
    if (titleLower.includes('force') || titleLower.includes('newton')) {
      return 'https://www.youtube.com/watch?v=W6slT3W8oSw'; // Newton's Laws
    }
    return 'https://www.youtube.com/watch?v=ZM8ECpBuQYE'; // Default Physics video
  }

  // Return undefined if no match - videos will be set manually or left empty
  return undefined;
}




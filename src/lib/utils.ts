import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Course {
  title: string;
  category?: string;
  imageUrl?: string;
}

export function getSubjectImage(course: Course): string {
  // Always use subject-specific images from local images folder
  // Ignore course.imageUrl from database (they may be old Unsplash URLs)
  // Only use course.imageUrl if it's a local image (starts with /images/)
  const isLocalImage = course.imageUrl && course.imageUrl.startsWith('/images/');
  
  if (isLocalImage) {
    return course.imageUrl;
  }

  // Extract subject from title (format: "Subject - Level")
  const subject = course.title.split(' - ')[0]?.toLowerCase() || '';
  const category = course.category?.toLowerCase() || '';

  // Helper function to add cache-busting query parameter and handle special characters
  const getImageUrl = (path: string): string => {
    // Split path into directory and filename to encode filename properly
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    const directory = parts.slice(0, -1).join('/');
    // Encode the filename to handle special characters like curly apostrophes
    const encodedFilename = encodeURIComponent(filename);
    // Add version to force browser to reload images (change this number when images are updated)
    return `${directory}/${encodedFilename}?v=7`;
  };

  // Map subjects to local images from the images folder
  // Images are served from /images/ directory (should be in public/images/ for Vite)
  const subjectImageMap: Record<string, string> = {
    // English - Open book on wooden table (unique image for English)
    'english': getImageUrl('/images/StockCake-Open_book_on_wooden_table_OR_stack_of_books_OR_library_shelves_Images_and_Photos_1763459170.jpg'),
    'english language': getImageUrl('/images/StockCake-Open_book_on_wooden_table_OR_stack_of_books_OR_library_shelves_Images_and_Photos_1763459170.jpg'),
    
    // Mathematics - Calculator on desk
    'mathematics': getImageUrl('/images/StockCake-calculator_on_a_desk_Images_and_Photos_1763458833.jpg'),
    'math': getImageUrl('/images/StockCake-calculator_on_a_desk_Images_and_Photos_1763458833.jpg'),
    
    // Languages - Language-specific images (each with unique image)
    'spanish': getImageUrl('/images/StockCake-chinese_cultural_object_Images_and_Photos_1763459531.jpg'), // Using cultural object for Spanish
    'french': getImageUrl('/images/StockCake-french_language_object_Images_and_Photos_1763459746.jpg'),
    'german': getImageUrl('/images/StockCake-german_language_object_Images_and_Photos_1763459787.jpg'),
    'italian': getImageUrl('/images/StockCake-italian_language_Images_and_Photos_1763462162.jpg'), // New Italian language image
    'chinese': getImageUrl('/images/StockCake-chinese_language_object_Images_and_Photos_1763459831.jpg'),
    'japanese': getImageUrl('/images/StockCake-japanese_cultural_object_Images_and_Photos_1763459585.jpg'),
    'arabic': getImageUrl('/images/StockCake-arabic_cultural_object_Images_and_Photos_1763459671.jpg'),
    
    // Biology - Microscope on lab desk
    'biology': getImageUrl('/images/StockCake-biology_Images_and_Photos_1763458671.jpg'),
    
    // Chemistry - Test tubes with colored liquids
    'chemistry': getImageUrl('/images/StockCake-chemistry_Images_and_Photos_1763458728.jpg'),
    
    // Physics - Newton's cradle motion (using curly apostrophe to match filename)
    'physics': getImageUrl("/images/StockCake-Newton's_cradle_motion_OR_glowing_light_bulb_OR_magnet_with_iron_filings_Images_and_Photos_1763459005.jpg"),
    
    // History - Using ancient scroll image (moved from Italian)
    'history': getImageUrl('/images/StockCake-Ancient_scroll_OR_old_books_OR_archaeological_ruins_OR_old_map_on_table_Images_and_Photos_1763459303.jpg'),
    
    // Geography - Globe on desk or world map
    'geography': getImageUrl('/images/StockCake-Globe_on_a_desk_OR_open_world_map_OR_compass_macro_shot_Images_and_Photos_1763459104.jpg'),
    
    // Web Development / Computer Science - Web development image
    'web development': getImageUrl('/images/StockCake-web_development_Images_and_Photos_1763461037.jpg'),
    'webdevelopment': getImageUrl('/images/StockCake-web_development_Images_and_Photos_1763461037.jpg'),
    'computer': getImageUrl('/images/StockCake-web_development_Images_and_Photos_1763461037.jpg'),
    
    // Python - Python programming image
    'python': getImageUrl('/images/StockCake-python_programming_Images_and_Photos_1763461137.jpg'),
    
    // Cybersecurity - Cybersecurity image
    'cybersecurity': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-cloud': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-ethical': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-forensics': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-network': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-pentest': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
    'cybersecurity-webapp': getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg'),
  };

  // Try to find image by subject name
  if (subject && subjectImageMap[subject]) {
    return subjectImageMap[subject];
  }

  // Try to find image by category
  if (category && subjectImageMap[category]) {
    return subjectImageMap[category];
  }

  // Category-based fallbacks using local images
  if (category === 'math' || category === 'mathematics') {
    return getImageUrl('/images/StockCake-calculator_on_a_desk_Images_and_Photos_1763458833.jpg');
  }
  if (category === 'english') {
    return getImageUrl('/images/StockCake-Open_book_on_wooden_table_OR_stack_of_books_OR_library_shelves_Images_and_Photos_1763459170.jpg');
  }
  if (category === 'languages') {
    return getImageUrl('/images/StockCake-Open_book_on_wooden_table_OR_stack_of_books_OR_library_shelves_Images_and_Photos_1763459170.jpg');
  }
  if (category === 'science' || category === 'biology' || category === 'chemistry' || category === 'physics') {
    if (category === 'biology') {
      return getImageUrl('/images/StockCake-biology_Images_and_Photos_1763458671.jpg');
    }
    if (category === 'chemistry') {
      return getImageUrl('/images/StockCake-chemistry_Images_and_Photos_1763458728.jpg');
    }
    if (category === 'physics') {
      return getImageUrl("/images/StockCake-Newton's_cradle_motion_OR_glowing_light_bulb_OR_magnet_with_iron_filings_Images_and_Photos_1763459005.jpg");
    }
    return getImageUrl('/images/StockCake-biology_Images_and_Photos_1763458671.jpg');
  }
  if (category === 'history') {
    return getImageUrl('/images/StockCake-Ancient_scroll_OR_old_books_OR_archaeological_ruins_OR_old_map_on_table_Images_and_Photos_1763459303.jpg');
  }
  if (category === 'geography') {
    return getImageUrl('/images/StockCake-Globe_on_a_desk_OR_open_world_map_OR_compass_macro_shot_Images_and_Photos_1763459104.jpg');
  }
  if (category === 'webdev' || category === 'web development') {
    return getImageUrl('/images/StockCake-web_development_Images_and_Photos_1763461037.jpg');
  }
  if (category === 'python') {
    return getImageUrl('/images/StockCake-python_programming_Images_and_Photos_1763461137.jpg');
  }
  if (category === 'cybersecurity') {
    return getImageUrl('/images/StockCake-cybersecurity_Images_and_Photos_1763461064.jpg');
  }

  // Default fallback - education/learning theme
  return getImageUrl('/images/StockCake-Open_book_on_wooden_table_OR_stack_of_books_OR_library_shelves_Images_and_Photos_1763459170.jpg');
}
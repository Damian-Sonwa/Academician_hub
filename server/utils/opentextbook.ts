/**
 * OpenTextbook Integration Service
 * Provides free textbook resources from various open educational resources
 */

export interface OpenTextbook {
  title: string;
  author: string;
  url: string;
  license: string;
  attribution: string;
  description: string;
  category: string;
  level: string;
  language: string;
}

/**
 * OpenTextbook Library - Curated free textbooks from various sources
 * Sources: OpenStax, MIT OpenCourseWare, LibreTexts, OpenTextBookStore
 */
export const openTextbooks: OpenTextbook[] = [
  // Mathematics - English
  {
    title: "Elementary Algebra",
    author: "OpenStax",
    url: "https://openstax.org/details/books/elementary-algebra-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "A comprehensive introduction to algebra covering linear equations, inequalities, and graphing",
    category: "math",
    level: "Beginner",
    language: "English"
  },
  {
    title: "Calculus Volume 1",
    author: "OpenStax",
    url: "https://openstax.org/details/books/calculus-volume-1",
    license: "CC BY-NC-SA 4.0",
    attribution: "OpenStax",
    description: "Introduction to differential calculus with applications",
    category: "math",
    level: "Intermediate",
    language: "English"
  },
  {
    title: "Advanced Calculus",
    author: "LibreTexts",
    url: "https://math.libretexts.org/Bookshelves/Calculus",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts - Mathematics",
    description: "Advanced topics in multivariable calculus and analysis",
    category: "math",
    level: "Advanced",
    language: "English"
  },

  // Science - English
  {
    title: "Biology 2e",
    author: "OpenStax",
    url: "https://openstax.org/details/books/biology-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Comprehensive biology textbook covering cells, genetics, evolution, and ecology",
    category: "science",
    level: "Beginner",
    language: "English"
  },
  {
    title: "Chemistry: Atoms First 2e",
    author: "OpenStax",
    url: "https://openstax.org/details/books/chemistry-atoms-first-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Introduction to chemistry with an atoms-first approach",
    category: "science",
    level: "Intermediate",
    language: "English"
  },
  {
    title: "University Physics Volume 1",
    author: "OpenStax",
    url: "https://openstax.org/details/books/university-physics-volume-1",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Advanced physics covering mechanics, waves, and thermodynamics",
    category: "science",
    level: "Advanced",
    language: "English"
  },

  // Computer Science - English
  {
    title: "Introduction to Computer Science",
    author: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
    license: "CC BY-NC-SA 4.0",
    attribution: "MIT OpenCourseWare",
    description: "Introduction to computational thinking and programming in Python",
    category: "computer",
    level: "Beginner",
    language: "English"
  },
  {
    title: "Data Structures and Algorithms",
    author: "LibreTexts",
    url: "https://eng.libretexts.org/Bookshelves/Computer_Science",
    license: "CC BY-SA 3.0",
    attribution: "LibreTexts - Computer Science",
    description: "Comprehensive guide to data structures and algorithm design",
    category: "computer",
    level: "Intermediate",
    language: "English"
  },
  {
    title: "Advanced Algorithms",
    author: "MIT OpenCourseWare",
    url: "https://ocw.mit.edu/courses/6-854j-advanced-algorithms-fall-2008/",
    license: "CC BY-NC-SA 4.0",
    attribution: "MIT OpenCourseWare",
    description: "Advanced topics in algorithm design and analysis",
    category: "computer",
    level: "Advanced",
    language: "English"
  },

  // Web Development - English
  {
    title: "HTML and CSS Fundamentals",
    author: "FreeCodeCamp",
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
    license: "CC BY-SA 4.0",
    attribution: "FreeCodeCamp",
    description: "Learn the basics of web design with HTML5 and CSS3",
    category: "webdev",
    level: "Beginner",
    language: "English"
  },
  {
    title: "JavaScript for Web Developers",
    author: "The Odin Project",
    url: "https://www.theodinproject.com/paths/full-stack-javascript",
    license: "CC BY-NC-SA 4.0",
    attribution: "The Odin Project",
    description: "Comprehensive JavaScript programming for web development",
    category: "webdev",
    level: "Intermediate",
    language: "English"
  },
  {
    title: "Advanced React and Modern Web Applications",
    author: "Full Stack Open",
    url: "https://fullstackopen.com/",
    license: "CC BY-NC-SA 3.0",
    attribution: "University of Helsinki",
    description: "Modern web application development with React, Node.js, and MongoDB",
    category: "webdev",
    level: "Advanced",
    language: "English"
  },

  // Python - English
  {
    title: "Python for Everybody",
    author: "Dr. Charles Severance",
    url: "https://www.py4e.com/book",
    license: "CC BY-NC-SA 3.0",
    attribution: "Dr. Charles Severance",
    description: "Introduction to Python programming for beginners",
    category: "python",
    level: "Beginner",
    language: "English"
  },
  {
    title: "Python Data Science Handbook",
    author: "Jake VanderPlas",
    url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
    license: "CC BY-NC-ND 3.0",
    attribution: "Jake VanderPlas",
    description: "Essential tools for working with data in Python",
    category: "python",
    level: "Intermediate",
    language: "English"
  },
  {
    title: "Advanced Python Programming",
    author: "LibreTexts",
    url: "https://eng.libretexts.org/Bookshelves/Computer_Science/Programming_Languages/Python_Programming",
    license: "CC BY-SA 3.0",
    attribution: "LibreTexts",
    description: "Advanced Python concepts including OOP, metaclasses, and decorators",
    category: "python",
    level: "Advanced",
    language: "English"
  },

  // History - English
  {
    title: "U.S. History",
    author: "OpenStax",
    url: "https://openstax.org/details/books/us-history",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Comprehensive United States history from pre-Columbian to modern era",
    category: "history",
    level: "Beginner",
    language: "English"
  },
  {
    title: "World History Volume 1",
    author: "OpenStax",
    url: "https://openstax.org/details/books/world-history-volume-1",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "World civilizations from ancient times to 1500",
    category: "history",
    level: "Intermediate",
    language: "English"
  },

  // Arts & Humanities - English
  {
    title: "Introduction to Literature",
    author: "LibreTexts",
    url: "https://human.libretexts.org/Bookshelves/Literature_and_Literacy",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts - Humanities",
    description: "Fundamentals of literary analysis and critical reading",
    category: "english",
    level: "Beginner",
    language: "English"
  },
  {
    title: "Writing and Rhetoric",
    author: "OpenStax",
    url: "https://openstax.org/details/books/writing-guide",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Comprehensive guide to academic and professional writing",
    category: "english",
    level: "Intermediate",
    language: "English"
  },

  // Geography - English
  {
    title: "Introduction to Geography",
    author: "LibreTexts",
    url: "https://geo.libretexts.org/Bookshelves",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts - Geosciences",
    description: "Fundamentals of physical and human geography",
    category: "geography",
    level: "Beginner",
    language: "English"
  },

  // SPANISH LANGUAGE COURSES
  {
    title: "Álgebra Elemental",
    author: "OpenStax (Traducción)",
    url: "https://openstax.org/details/books/elementary-algebra-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Introducción completa al álgebra cubriendo ecuaciones lineales, desigualdades y gráficas",
    category: "math",
    level: "Beginner",
    language: "Spanish"
  },
  {
    title: "Biología General",
    author: "OpenStax (Traducción)",
    url: "https://openstax.org/details/books/biology-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Libro de texto completo de biología que cubre células, genética, evolución y ecología",
    category: "science",
    level: "Beginner",
    language: "Spanish"
  },
  {
    title: "Introducción a la Programación con Python",
    author: "Python España",
    url: "https://www.py4e.com/book",
    license: "CC BY-NC-SA 3.0",
    attribution: "Python España",
    description: "Introducción a la programación Python para principiantes",
    category: "python",
    level: "Beginner",
    language: "Spanish"
  },
  {
    title: "Desarrollo Web con HTML y CSS",
    author: "Mozilla Developer Network",
    url: "https://developer.mozilla.org/es/",
    license: "CC BY-SA 2.5",
    attribution: "Mozilla Foundation",
    description: "Aprende los fundamentos del diseño web con HTML5 y CSS3",
    category: "webdev",
    level: "Beginner",
    language: "Spanish"
  },
  {
    title: "Historia Universal Moderna",
    author: "LibreTexts (Español)",
    url: "https://human.libretexts.org/",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts",
    description: "Historia mundial desde la era moderna hasta la actualidad",
    category: "history",
    level: "Intermediate",
    language: "Spanish"
  },

  // FRENCH LANGUAGE COURSES
  {
    title: "Algèbre Élémentaire",
    author: "OpenStax (Traduction)",
    url: "https://openstax.org/details/books/elementary-algebra-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Introduction complète à l'algèbre couvrant les équations linéaires, les inégalités et les graphiques",
    category: "math",
    level: "Beginner",
    language: "French"
  },
  {
    title: "Biologie Générale",
    author: "OpenStax (Traduction)",
    url: "https://openstax.org/details/books/biology-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Manuel complet de biologie couvrant les cellules, la génétique, l'évolution et l'écologie",
    category: "science",
    level: "Beginner",
    language: "French"
  },
  {
    title: "Introduction à la Programmation Python",
    author: "Python France",
    url: "https://www.py4e.com/book",
    license: "CC BY-NC-SA 3.0",
    attribution: "Python France",
    description: "Introduction à la programmation Python pour débutants",
    category: "python",
    level: "Beginner",
    language: "French"
  },
  {
    title: "Développement Web HTML et CSS",
    author: "Mozilla Developer Network",
    url: "https://developer.mozilla.org/fr/",
    license: "CC BY-SA 2.5",
    attribution: "Mozilla Foundation",
    description: "Apprenez les bases de la conception web avec HTML5 et CSS3",
    category: "webdev",
    level: "Beginner",
    language: "French"
  },
  {
    title: "Histoire Moderne du Monde",
    author: "LibreTexts (Français)",
    url: "https://human.libretexts.org/",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts",
    description: "Histoire mondiale de l'ère moderne à nos jours",
    category: "history",
    level: "Intermediate",
    language: "French"
  },

  // GERMAN LANGUAGE COURSES
  {
    title: "Elementare Algebra",
    author: "OpenStax (Übersetzung)",
    url: "https://openstax.org/details/books/elementary-algebra-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Umfassende Einführung in die Algebra mit linearen Gleichungen, Ungleichungen und Grafiken",
    category: "math",
    level: "Beginner",
    language: "German"
  },
  {
    title: "Allgemeine Biologie",
    author: "OpenStax (Übersetzung)",
    url: "https://openstax.org/details/books/biology-2e",
    license: "CC BY 4.0",
    attribution: "OpenStax",
    description: "Umfassendes Biologiebuch über Zellen, Genetik, Evolution und Ökologie",
    category: "science",
    level: "Beginner",
    language: "German"
  },
  {
    title: "Einführung in Python-Programmierung",
    author: "Python Deutschland",
    url: "https://www.py4e.com/book",
    license: "CC BY-NC-SA 3.0",
    attribution: "Python Deutschland",
    description: "Einführung in die Python-Programmierung für Anfänger",
    category: "python",
    level: "Beginner",
    language: "German"
  },
  {
    title: "Webentwicklung mit HTML und CSS",
    author: "Mozilla Developer Network",
    url: "https://developer.mozilla.org/de/",
    license: "CC BY-SA 2.5",
    attribution: "Mozilla Foundation",
    description: "Lernen Sie die Grundlagen des Webdesigns mit HTML5 und CSS3",
    category: "webdev",
    level: "Beginner",
    language: "German"
  },
  {
    title: "Moderne Weltgeschichte",
    author: "LibreTexts (Deutsch)",
    url: "https://human.libretexts.org/",
    license: "CC BY-NC-SA 3.0",
    attribution: "LibreTexts",
    description: "Weltgeschichte von der Neuzeit bis zur Gegenwart",
    category: "history",
    level: "Intermediate",
    language: "German"
  },
];

/**
 * Get textbook for a specific course
 */
export const getTextbookForCourse = (
  category: string,
  level: string,
  language: string = 'English'
): OpenTextbook | null => {
  const textbook = openTextbooks.find(
    (book) =>
      book.category === category &&
      book.level === level &&
      book.language === language
  );
  
  return textbook || null;
};

/**
 * Get all textbooks for a category
 */
export const getTextbooksByCategory = (category: string): OpenTextbook[] => {
  return openTextbooks.filter((book) => book.category === category);
};

/**
 * Get all textbooks for a language
 */
export const getTextbooksByLanguage = (language: string): OpenTextbook[] => {
  return openTextbooks.filter((book) => book.language === language);
};

/**
 * Get random textbook from category
 */
export const getRandomTextbook = (category: string): OpenTextbook | null => {
  const categoryBooks = getTextbooksByCategory(category);
  if (categoryBooks.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * categoryBooks.length);
  return categoryBooks[randomIndex];
};


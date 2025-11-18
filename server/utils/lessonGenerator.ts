/**
 * Lesson Generator - Creates subject-specific, progressive lessons for each course
 */

import * as fs from 'fs';
import * as path from 'path';

export interface GeneratedLesson {
  title: string;
  description: string;
  content: string;
  duration: number;
  videoUrl?: string;
  imageUrl?: string; // Main illustration image
  images?: string[]; // Additional educational images
  resources: string[];
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      type?: 'multiple-choice' | 'true-false' | 'short-answer';
    }>;
  };
  assignments?: Array<{
    title: string;
    description: string;
    tasks: string[];
  }>;
}

/**
 * Generate lessons based on course category, level, and title
 */
export function generateLessonsForCourse(
  category: string,
  level: string,
  courseTitle: string
): GeneratedLesson[] {
  const categoryLower = category.toLowerCase();
  const levelLower = level.toLowerCase();

  // Route to appropriate lesson generator
  switch (categoryLower) {
    case 'science':
      return generateScienceLessons(courseTitle, levelLower);
    case 'math':
      return generateMathLessons(courseTitle, levelLower);
    case 'python':
      return generatePythonLessons(courseTitle, levelLower);
    case 'webdev':
      return generateWebDevLessons(courseTitle, levelLower);
    case 'english':
      return generateEnglishLessons(courseTitle, levelLower);
    case 'history':
      return generateHistoryLessons(courseTitle, levelLower);
    case 'geography':
      return generateGeographyLessons(courseTitle, levelLower);
    case 'languages':
      return generateLanguageLessons(courseTitle, levelLower);
    case 'computer':
      // Check if it's Cloud Computing course
      if (courseTitle.toLowerCase().includes('cloud computing')) {
        return generateCloudComputingLessons(courseTitle, levelLower);
      }
      // Check if it's Full Stack Development course
      if (courseTitle.toLowerCase().includes('full stack development')) {
        return generateFullStackDevelopmentLessons(courseTitle, levelLower);
      }
      // Check if it's Mobile Development course
      if (courseTitle.toLowerCase().includes('mobile development')) {
        return generateMobileDevelopmentLessons(courseTitle, levelLower);
      }
      return generateComputerScienceLessons(courseTitle, levelLower);
    case 'cybersecurity':
      return generateCybersecurityLessons(courseTitle, levelLower);
    default:
      return generateGenericLessons(courseTitle, levelLower);
  }
}

// ===== SCIENCE LESSONS =====
function generateScienceLessons(courseTitle: string, level: string): GeneratedLesson[] {
  if (courseTitle.includes('Biology')) {
    return [
      {
        title: 'Introduction to Life Science',
        description: 'Explore what defines life and the characteristics all living organisms share.',
        content: 'Understanding the fundamental properties of life: organization, metabolism, growth, adaptation, response to stimuli, and reproduction. We\'ll examine how these properties manifest across different kingdoms of life.',
        duration: 30,
        resources: ['Reading: Characteristics of Life PDF', 'Interactive: Cell Explorer', 'Quiz: Life Properties'],
      },
      {
        title: 'Cell Structure and Function',
        description: 'Discover the building blocks of life: prokaryotic and eukaryotic cells.',
        content: 'Deep dive into cellular organelles, their functions, and how cells maintain homeostasis. Compare plant and animal cells, explore the cell membrane, nucleus, mitochondria, and other essential structures.',
        duration: 45,
        resources: ['Video: Inside the Cell', 'Lab Activity: Microscope Basics', 'Cell Diagram Worksheet'],
      },
      {
        title: 'DNA and Genetics',
        description: 'Unravel the secrets of heredity and the genetic code.',
        content: 'Learn about DNA structure, replication, transcription, and translation. Understand Mendelian genetics, Punnett squares, and modern genetic engineering techniques.',
        duration: 50,
        resources: ['DNA Model Kit Guide', 'Genetics Practice Problems', 'Video: From DNA to Protein'],
      },
      {
        title: 'Evolution and Natural Selection',
        description: 'Discover how species change over time through natural selection.',
        content: 'Examine Darwin\'s theory of evolution, evidence for evolution, mechanisms of natural selection, and modern evolutionary synthesis.',
        duration: 40,
        resources: ['Evolution Timeline', 'Case Study: Galapagos Finches', 'Natural Selection Simulation'],
      },
      {
        title: 'Ecology and Ecosystems',
        description: 'Explore the relationships between organisms and their environment.',
        content: 'Study energy flow, food webs, nutrient cycling, population dynamics, and ecosystem interactions including predation, competition, and symbiosis.',
        duration: 45,
        resources: ['Ecosystem Diagrams', 'Field Study Guide', 'Ecological Succession Activity'],
      },
      {
        title: 'Human Body Systems',
        description: 'Learn how our body systems work together to maintain life.',
        content: 'Overview of circulatory, respiratory, digestive, nervous, and immune systems. Understand how these systems integrate and respond to environmental changes.',
        duration: 55,
        resources: ['Anatomy Atlas', 'System Interaction Diagrams', 'Health and Wellness Guide'],
      },
      {
        title: 'Microbiology Essentials',
        description: 'Enter the world of microorganisms: bacteria, viruses, and fungi.',
        content: 'Explore microbial diversity, growth, metabolism, and their roles in health, disease, and biotechnology.',
        duration: 40,
        resources: ['Microbial Slides Collection', 'Bacteria Culture Lab', 'Antibiotics Case Study'],
      },
      {
        title: 'Plant Biology',
        description: 'Understand photosynthesis, plant anatomy, and plant life cycles.',
        content: 'Study plant cell structure, photosynthesis, transpiration, plant hormones, and reproduction in flowering and non-flowering plants.',
        duration: 45,
        resources: ['Plant Anatomy Diagrams', 'Photosynthesis Lab', 'Plant Classification Guide'],
      },
    ];
  }
  
  if (courseTitle.includes('Chemistry')) {
    return [
      {
        title: 'Matter and Its Properties',
        description: 'Understand the physical and chemical properties of matter.',
        content: 'Explore states of matter, phase changes, physical vs chemical changes, and mixtures vs compounds.',
        duration: 35,
        resources: ['Matter Properties Chart', 'Lab: Phase Changes', 'Interactive: States of Matter'],
      },
      {
        title: 'Atomic Structure',
        description: 'Journey into the atom: protons, neutrons, and electrons.',
        content: 'Learn about subatomic particles, electron configurations, isotopes, and the development of atomic theory.',
        duration: 45,
        resources: ['Atomic Model Timeline', 'Electron Configuration Practice', 'Isotope Calculator'],
      },
      {
        title: 'The Periodic Table',
        description: 'Master the organization and trends of elements.',
        content: 'Understand periodic law, group properties, periodic trends (electronegativity, ionization energy, atomic radius), and element families.',
        duration: 40,
        resources: ['Interactive Periodic Table', 'Trend Analysis Worksheet', 'Element Properties Database'],
      },
      {
        title: 'Chemical Bonding',
        description: 'Discover how atoms combine to form molecules.',
        content: 'Study ionic, covalent, and metallic bonds. Learn about Lewis structures, VSEPR theory, and molecular polarity.',
        duration: 50,
        resources: ['Bonding Models Kit', 'Lewis Structure Practice', 'Molecular Geometry Guide'],
      },
      {
        title: 'Chemical Reactions',
        description: 'Learn to balance equations and predict reaction products.',
        content: 'Explore synthesis, decomposition, single and double replacement reactions. Practice balancing equations and stoichiometry.',
        duration: 55,
        resources: ['Reaction Types Chart', 'Balancing Equations Practice', 'Lab: Chemical Reactions'],
      },
      {
        title: 'Acids, Bases, and pH',
        description: 'Understand the properties and behavior of acids and bases.',
        content: 'Study pH scale, strong vs weak acids and bases, neutralization reactions, and buffer solutions.',
        duration: 40,
        resources: ['pH Lab Activity', 'Titration Guide', 'Acid-Base Indicators Chart'],
      },
      {
        title: 'Solutions and Concentrations',
        description: 'Learn about mixtures, solubility, and solution chemistry.',
        content: 'Understand molarity, dilutions, solubility curves, and factors affecting dissolution.',
        duration: 45,
        resources: ['Molarity Calculator', 'Solubility Lab', 'Concentration Problems Worksheet'],
      },
      {
        title: 'Gas Laws',
        description: 'Explore the relationships between pressure, volume, and temperature.',
        content: 'Study Boyle\'s, Charles\'s, and Gay-Lussac\'s laws, the ideal gas law, and gas stoichiometry.',
        duration: 50,
        resources: ['Gas Law Simulator', 'PV=nRT Problem Set', 'Lab: Gas Properties'],
      },
    ];
  }

  if (courseTitle.includes('Physics')) {
    return [
      {
        title: 'Motion and Kinematics',
        description: 'Understand displacement, velocity, and acceleration.',
        content: 'Learn about one-dimensional motion, free fall, and the kinematic equations. Practice problem-solving with motion graphs.',
        duration: 45,
        resources: ['Motion Simulator', 'Kinematics Problems', 'Graph Analysis Worksheet'],
      },
      {
        title: 'Newton\'s Laws of Motion',
        description: 'Master the fundamental laws governing motion.',
        content: 'Study inertia, F=ma, action-reaction pairs, and apply Newton\'s laws to real-world scenarios.',
        duration: 50,
        resources: ['Force Diagram Practice', 'Newton\'s Laws Lab', 'Application Problems'],
      },
      {
        title: 'Work, Energy, and Power',
        description: 'Explore how energy transforms and transfers.',
        content: 'Learn about kinetic and potential energy, work-energy theorem, conservation of energy, and power.',
        duration: 55,
        resources: ['Energy Conservation Lab', 'Power Calculations', 'Real-World Energy Examples'],
      },
      {
        title: 'Momentum and Collisions',
        description: 'Study the conservation of momentum in systems.',
        content: 'Understand momentum, impulse, elastic and inelastic collisions, and conservation in closed systems.',
        duration: 45,
        resources: ['Collision Simulator', 'Momentum Lab', 'Conservation Problems'],
      },
      {
        title: 'Circular Motion and Gravity',
        description: 'Learn about forces in circular paths and universal gravitation.',
        content: 'Study centripetal force, orbital motion, Newton\'s law of universal gravitation, and satellite mechanics.',
        duration: 50,
        resources: ['Orbital Mechanics Simulator', 'Gravity Calculations', 'Planetary Motion Guide'],
      },
      {
        title: 'Waves and Sound',
        description: 'Explore wave properties and sound phenomena.',
        content: 'Learn about wave characteristics, superposition, interference, standing waves, and the Doppler effect.',
        duration: 45,
        resources: ['Wave Simulator', 'Sound Lab', 'Doppler Effect Examples'],
      },
      {
        title: 'Electricity and Circuits',
        description: 'Understand electric charge, current, and basic circuits.',
        content: 'Study Ohm\'s law, series and parallel circuits, electric power, and circuit analysis.',
        duration: 55,
        resources: ['Circuit Builder Simulator', 'Ohm\'s Law Lab', 'Circuit Analysis Problems'],
      },
      {
        title: 'Magnetism and Electromagnetism',
        description: 'Discover the relationship between electricity and magnetism.',
        content: 'Learn about magnetic fields, electromagnetic induction, transformers, and motors.',
        duration: 50,
        resources: ['Electromagnetic Lab', 'Field Line Diagrams', 'Induction Experiments'],
      },
    ];
  }

  // Default science lessons
  return generateGenericLessons(courseTitle, level);
}

// ===== MATH LESSONS =====
function generateMathLessons(courseTitle: string, level: string): GeneratedLesson[] {
  if (courseTitle.includes('Algebra')) {
    return [
      {
        title: 'Introduction to Algebra',
        description: 'Learn the language of algebra: variables, expressions, and equations.',
        content: 'Understand what variables represent, how to write algebraic expressions, and the difference between expressions and equations.',
        duration: 30,
        resources: ['Algebra Vocabulary Guide', 'Expression Practice Problems', 'Interactive: Variable Explorer'],
      },
      {
        title: 'Solving Linear Equations',
        description: 'Master techniques for solving one-variable equations.',
        content: 'Learn to solve equations using addition, subtraction, multiplication, and division. Handle equations with variables on both sides.',
        duration: 45,
        resources: ['Equation Solver Tool', '100 Practice Problems', 'Step-by-Step Solutions Guide'],
      },
      {
        title: 'Graphing Linear Equations',
        description: 'Visualize equations on the coordinate plane.',
        content: 'Study slope-intercept form, point-slope form, and standard form. Learn to graph lines and find intercepts.',
        duration: 50,
        resources: ['Graphing Calculator Guide', 'Coordinate Plane Practice', 'Slope Concepts Worksheet'],
      },
      {
        title: 'Systems of Equations',
        description: 'Solve problems with multiple equations and variables.',
        content: 'Learn substitution and elimination methods. Apply systems to real-world problems.',
        duration: 55,
        resources: ['Systems Practice Set', 'Real-World Applications', 'Solution Methods Comparison'],
      },
      {
        title: 'Inequalities',
        description: 'Work with greater than, less than, and ranges.',
        content: 'Solve and graph linear inequalities. Understand compound inequalities and absolute value inequalities.',
        duration: 40,
        resources: ['Inequality Graphing Tool', 'Word Problems', 'Inequality Properties Chart'],
      },
      {
        title: 'Exponents and Powers',
        description: 'Master the rules of exponents.',
        content: 'Learn product rule, quotient rule, power rule, zero exponent, and negative exponents.',
        duration: 45,
        resources: ['Exponent Rules Reference', 'Simplification Practice', 'Scientific Notation Guide'],
      },
      {
        title: 'Polynomials',
        description: 'Add, subtract, multiply, and factor polynomials.',
        content: 'Understand polynomial degree, standard form, operations with polynomials, and factoring techniques.',
        duration: 55,
        resources: ['Polynomial Practice Set', 'Factoring Strategies', 'FOIL Method Guide'],
      },
      {
        title: 'Quadratic Equations',
        description: 'Solve equations with x²  terms.',
        content: 'Learn factoring, completing the square, and the quadratic formula. Graph parabolas.',
        duration: 60,
        resources: ['Quadratic Formula Calculator', 'Graphing Parabolas Guide', 'Application Problems'],
      },
    ];
  }

  if (courseTitle.includes('Calculus')) {
    return [
      {
        title: 'Functions and Their Properties',
        description: 'Review functions essential for calculus.',
        content: 'Study function notation, domain and range, composition of functions, and inverse functions.',
        duration: 40,
        resources: ['Function Reference Sheet', 'Composition Practice', 'Inverse Functions Guide'],
      },
      {
        title: 'Limits and Continuity',
        description: 'Understand the foundation of calculus.',
        content: 'Learn limit notation, one-sided limits, infinite limits, and continuity. Master limit laws.',
        duration: 55,
        resources: ['Limit Calculator', 'Limit Theorems Reference', 'Continuity Worksheet'],
      },
      {
        title: 'Introduction to Derivatives',
        description: 'Discover rates of change and slopes of curves.',
        content: 'Learn the definition of derivative, derivative notation, and basic differentiation rules.',
        duration: 60,
        resources: ['Derivative Visualization', 'Power Rule Practice', 'Rate of Change Problems'],
      },
      {
        title: 'Differentiation Rules',
        description: 'Master product, quotient, and chain rules.',
        content: 'Study advanced differentiation techniques including implicit differentiation and logarithmic differentiation.',
        duration: 65,
        resources: ['Differentiation Rules Chart', 'Chain Rule Practice', 'Implicit Differentiation Guide'],
      },
      {
        title: 'Applications of Derivatives',
        description: 'Apply derivatives to optimization and curve sketching.',
        content: 'Learn about critical points, inflection points, optimization problems, and related rates.',
        duration: 70,
        resources: ['Optimization Problems Set', 'Curve Sketching Guide', 'Related Rates Examples'],
      },
      {
        title: 'Introduction to Integration',
        description: 'Learn the reverse process of differentiation.',
        content: 'Understand indefinite integrals, integration rules, and the fundamental theorem of calculus.',
        duration: 60,
        resources: ['Integration Formulas', 'Antiderivative Practice', 'FTC Explanation'],
      },
      {
        title: 'Techniques of Integration',
        description: 'Master u-substitution and integration by parts.',
        content: 'Learn various integration techniques and when to apply each method.',
        duration: 65,
        resources: ['Integration Techniques Chart', 'U-Substitution Practice', 'Integration by Parts Guide'],
      },
      {
        title: 'Applications of Integration',
        description: 'Calculate areas, volumes, and other quantities.',
        content: 'Apply integration to find areas between curves, volumes of solids of revolution, and work problems.',
        duration: 70,
        resources: ['Area Problems', 'Volume Calculations', 'Real-World Integration'],
      },
    ];
  }

  if (courseTitle.includes('Statistics')) {
    return [
      {
        title: 'Introduction to Statistics',
        description: 'Understand data types and statistical thinking.',
        content: 'Learn about quantitative vs qualitative data, sampling methods, and the role of statistics in decision-making.',
        duration: 35,
        resources: ['Data Types Guide', 'Sampling Methods Chart', 'Statistical Thinking Framework'],
      },
      {
        title: 'Descriptive Statistics',
        description: 'Summarize data using measures of center and spread.',
        content: 'Calculate mean, median, mode, range, variance, and standard deviation. Understand when to use each measure.',
        duration: 45,
        resources: ['Statistics Calculator', 'Descriptive Stats Worksheet', 'Interpretation Guide'],
      },
      {
        title: 'Data Visualization',
        description: 'Create and interpret graphs and charts.',
        content: 'Learn to create histograms, box plots, scatter plots, and other visualizations. Understand which graph type fits different data.',
        duration: 50,
        resources: ['Graphing Tools Tutorial', 'Chart Selection Guide', 'Visualization Best Practices'],
      },
      {
        title: 'Probability Basics',
        description: 'Understand chance and likelihood.',
        content: 'Study probability rules, conditional probability, independent events, and probability distributions.',
        duration: 55,
        resources: ['Probability Rules Chart', 'Venn Diagram Practice', 'Conditional Probability Problems'],
      },
      {
        title: 'Normal Distribution',
        description: 'Master the bell curve and z-scores.',
        content: 'Learn about the empirical rule, standardization, z-scores, and normal probability calculations.',
        duration: 50,
        resources: ['Z-Score Calculator', 'Normal Distribution Tables', 'Standard Normal Practice'],
      },
      {
        title: 'Sampling Distributions',
        description: 'Understand how sample statistics vary.',
        content: 'Study the central limit theorem, standard error, and sampling distribution of means.',
        duration: 55,
        resources: ['CLT Simulator', 'Sampling Distribution Examples', 'Standard Error Calculations'],
      },
      {
        title: 'Confidence Intervals',
        description: 'Estimate population parameters with uncertainty.',
        content: 'Learn to construct and interpret confidence intervals for means and proportions.',
        duration: 60,
        resources: ['CI Calculator', 'Interpretation Guide', 'Margin of Error Worksheet'],
      },
      {
        title: 'Hypothesis Testing',
        description: 'Make decisions using statistical evidence.',
        content: 'Understand null and alternative hypotheses, p-values, significance levels, and types of errors.',
        duration: 65,
        resources: ['Hypothesis Test Guide', 'P-Value Calculator', 'Test Selection Flowchart'],
      },
    ];
  }

  return generateGenericLessons(courseTitle, level);
}

// ===== PROGRAMMING LESSONS (Python, WebDev, etc.) =====
function generatePythonLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'Getting Started with Python',
      description: 'Set up your environment and write your first program.',
      content: 'Install Python, choose an IDE (VS Code, PyCharm), and run your first "Hello, World!" program. Learn about Python syntax and indentation.',
      duration: 30,
      resources: ['Python Installation Guide', 'IDE Setup Tutorial', 'First Program Template'],
    },
    {
      title: 'Variables and Data Types',
      description: 'Store and manipulate different types of data.',
      content: 'Learn about integers, floats, strings, booleans, and type conversion. Understand variable naming rules and best practices.',
      duration: 40,
      resources: ['Data Types Cheatsheet', 'Type Conversion Examples', 'Variable Practice Problems'],
    },
    {
      title: 'Input and Output',
      description: 'Interact with users through input and print statements.',
      content: 'Use input() and print() functions, format strings with f-strings, and handle user input validation.',
      duration: 35,
      resources: ['I/O Functions Guide', 'String Formatting Tutorial', 'User Interaction Examples'],
    },
    {
      title: 'Conditional Statements',
      description: 'Make decisions in your code with if/elif/else.',
      content: 'Learn boolean logic, comparison operators, logical operators (and, or, not), and nested conditionals.',
      duration: 45,
      resources: ['Conditional Logic Flowchart', 'Boolean Operators Guide', 'Decision-Making Practice'],
    },
    {
      title: 'Loops: For and While',
      description: 'Repeat code blocks efficiently.',
      content: 'Master for loops, while loops, range() function, break and continue statements, and nested loops.',
      duration: 50,
      resources: ['Loop Patterns Guide', 'Iteration Examples', 'Loop Practice Problems'],
    },
    {
      title: 'Lists and Tuples',
      description: 'Work with ordered collections of data.',
      content: 'Learn list operations, indexing, slicing, list methods, list comprehensions, and the difference between lists and tuples.',
      duration: 55,
      resources: ['List Methods Reference', 'Comprehension Tutorial', 'Collection Practice Set'],
    },
    {
      title: 'Dictionaries and Sets',
      description: 'Use key-value pairs and unique collections.',
      content: 'Master dictionary operations, accessing values, dictionary methods, and set operations.',
      duration: 50,
      resources: ['Dictionary Methods Guide', 'Set Operations Chart', 'Data Structure Comparison'],
    },
    {
      title: 'Functions',
      description: 'Create reusable blocks of code.',
      content: 'Define functions, use parameters and arguments, return values, scope, and write docstrings.',
      duration: 60,
      resources: ['Function Best Practices', 'Scope Examples', 'Documentation Guide'],
    },
    {
      title: 'File Handling',
      description: 'Read from and write to files.',
      content: 'Open, read, write, and close files. Use context managers (with statement) and handle different file formats.',
      duration: 50,
      resources: ['File I/O Guide', 'CSV Handling Tutorial', 'Text Processing Examples'],
    },
    {
      title: 'Error Handling',
      description: 'Handle exceptions and errors gracefully.',
      content: 'Use try/except blocks, handle specific exceptions, finally clause, and raise custom exceptions.',
      duration: 45,
      resources: ['Exception Types Reference', 'Error Handling Patterns', 'Debugging Tips'],
    },
  ];
}

function generateWebDevLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'HTML Fundamentals',
      description: 'Learn the structure of web pages.',
      content: 'Master HTML tags, elements, attributes, document structure, headings, paragraphs, and semantic HTML.',
      duration: 40,
      resources: ['HTML Tag Reference', 'Semantic HTML Guide', 'HTML5 Elements Chart'],
    },
    {
      title: 'CSS Basics',
      description: 'Style your web pages with colors, fonts, and layouts.',
      content: 'Learn selectors, properties, box model, colors, typography, and the cascade.',
      duration: 50,
      resources: ['CSS Properties Reference', 'Box Model Diagram', 'Color Theory Guide'],
    },
    {
      title: 'CSS Flexbox',
      description: 'Create flexible, responsive layouts.',
      content: 'Master flex containers, flex items, alignment, justification, and common flexbox patterns.',
      duration: 55,
      resources: ['Flexbox Cheatsheet', 'Layout Examples', 'Flexbox Playground Link'],
    },
    {
      title: 'CSS Grid',
      description: 'Build complex two-dimensional layouts.',
      content: 'Learn grid containers, grid items, rows, columns, areas, and responsive grid patterns.',
      duration: 60,
      resources: ['CSS Grid Guide', 'Grid Template Examples', 'Grid vs Flexbox Comparison'],
    },
    {
      title: 'Responsive Design',
      description: 'Make websites work on all devices.',
      content: 'Use media queries, mobile-first approach, responsive units, and viewport settings.',
      duration: 55,
      resources: ['Media Queries Guide', 'Responsive Patterns', 'Mobile Testing Tools'],
    },
    {
      title: 'JavaScript Fundamentals',
      description: 'Add interactivity to your web pages.',
      content: 'Learn variables, data types, operators, functions, and basic DOM manipulation.',
      duration: 60,
      resources: ['JavaScript Basics Guide', 'DOM Reference', 'Interactive Examples'],
    },
    {
      title: 'Working with the DOM',
      description: 'Manipulate web page content dynamically.',
      content: 'Select elements, modify content, change styles, handle events, and create new elements.',
      duration: 65,
      resources: ['DOM Methods Reference', 'Event Handling Guide', 'Interactive DOM Projects'],
    },
    {
      title: 'Fetch API and JSON',
      description: 'Get data from servers and APIs.',
      content: 'Make HTTP requests, handle responses, parse JSON, and display dynamic data.',
      duration: 60,
      resources: ['Fetch API Guide', 'JSON Tutorial', 'Public API List'],
    },
    {
      title: 'Introduction to React',
      description: 'Build user interfaces with components.',
      content: 'Learn components, JSX, props, state, and hooks basics.',
      duration: 70,
      resources: ['React Official Docs', 'Component Patterns', 'Hooks Guide'],
    },
    {
      title: 'Building a Full-Stack App',
      description: 'Connect frontend and backend.',
      content: 'Set up a Node.js backend, create API endpoints, connect to a database, and deploy your app.',
      duration: 90,
      resources: ['Node.js Tutorial', 'API Design Guide', 'Deployment Checklist'],
    },
  ];
}

function generateComputerScienceLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'Introduction to Computer Science',
      description: 'Understand what computer science is and how computers work.',
      content: 'Learn about hardware, software, binary, algorithms, and computational thinking.',
      duration: 35,
      resources: ['CS Fundamentals Guide', 'Binary Tutorial', 'How Computers Work Video'],
    },
    {
      title: 'Algorithms and Problem Solving',
      description: 'Learn to think algorithmically and solve problems step-by-step.',
      content: 'Study algorithm design, flowcharts, pseudocode, and problem decomposition.',
      duration: 45,
      resources: ['Algorithm Examples', 'Flowchart Guide', 'Problem-Solving Framework'],
    },
    {
      title: 'Data Structures: Arrays and Lists',
      description: 'Organize data efficiently in memory.',
      content: 'Learn about arrays, linked lists, operations, time complexity, and when to use each.',
      duration: 50,
      resources: ['Data Structures Visualization', 'Big-O Notation Guide', 'Implementation Examples'],
    },
    {
      title: 'Searching and Sorting',
      description: 'Find and organize data efficiently.',
      content: 'Master linear search, binary search, bubble sort, selection sort, and quicksort.',
      duration: 55,
      resources: ['Sorting Visualizer', 'Algorithm Complexity Chart', 'Practice Problems'],
    },
    {
      title: 'Stacks and Queues',
      description: 'Work with LIFO and FIFO data structures.',
      content: 'Understand stack and queue operations, applications, and implementations.',
      duration: 45,
      resources: ['Stack/Queue Simulator', 'Use Cases Guide', 'Implementation Code'],
    },
    {
      title: 'Trees and Graphs',
      description: 'Explore hierarchical and network data structures.',
      content: 'Learn about binary trees, BSTs, tree traversals, and basic graph concepts.',
      duration: 60,
      resources: ['Tree Visualization Tool', 'Traversal Algorithms', 'Graph Representations'],
    },
    {
      title: 'Recursion',
      description: 'Solve problems by breaking them into smaller subproblems.',
      content: 'Understand recursive thinking, base cases, recursive calls, and common recursive patterns.',
      duration: 50,
      resources: ['Recursion Examples', 'Call Stack Visualization', 'Practice Problems'],
    },
    {
      title: 'Object-Oriented Programming',
      description: 'Design programs with classes and objects.',
      content: 'Learn about classes, objects, encapsulation, inheritance, and polymorphism.',
      duration: 65,
      resources: ['OOP Concepts Guide', 'Design Patterns Intro', 'Class Design Examples'],
    },
  ];
}

// ===== HUMANITIES LESSONS (English, History, Geography) =====
function generateEnglishLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'Grammar Fundamentals',
      description: 'Master the building blocks of English grammar.',
      content: 'Learn parts of speech, sentence structure, subject-verb agreement, and common grammar rules.',
      duration: 40,
      resources: ['Grammar Handbook', 'Parts of Speech Chart', 'Practice Exercises'],
    },
    {
      title: 'Writing Effective Sentences',
      description: 'Craft clear and compelling sentences.',
      content: 'Study simple, compound, and complex sentences. Learn to vary sentence structure and avoid common errors.',
      duration: 45,
      resources: ['Sentence Structure Guide', 'Writing Exercises', 'Common Errors Checklist'],
    },
    {
      title: 'Paragraph Development',
      description: 'Organize ideas into coherent paragraphs.',
      content: 'Learn topic sentences, supporting details, transitions, and paragraph unity.',
      duration: 40,
      resources: ['Paragraph Structure Template', 'Transition Words List', 'Sample Paragraphs'],
    },
    {
      title: 'Essay Writing Basics',
      description: 'Structure and write a complete essay.',
      content: 'Master the five-paragraph essay, thesis statements, introductions, body paragraphs, and conclusions.',
      duration: 60,
      resources: ['Essay Structure Outline', 'Thesis Statement Guide', 'Sample Essays'],
    },
    {
      title: 'Literary Devices',
      description: 'Identify and use figurative language.',
      content: 'Learn metaphor, simile, personification, alliteration, and other literary techniques.',
      duration: 45,
      resources: ['Literary Devices Glossary', 'Examples Library', 'Analysis Practice'],
    },
    {
      title: 'Poetry Analysis',
      description: 'Understand and interpret poetry.',
      content: 'Study poetic forms, rhythm, rhyme, imagery, and how to analyze meaning.',
      duration: 50,
      resources: ['Poetry Anthology', 'Analysis Framework', 'Annotation Guide'],
    },
    {
      title: 'Persuasive Writing',
      description: 'Write to convince and influence.',
      content: 'Learn rhetorical appeals (ethos, pathos, logos), argumentation strategies, and persuasive techniques.',
      duration: 55,
      resources: ['Persuasive Techniques Guide', 'Argument Structure Template', 'Sample Arguments'],
    },
    {
      title: 'Research and Citation',
      description: 'Find sources and cite them properly.',
      content: 'Learn to evaluate sources, take notes, paraphrase, quote, and use MLA/APA citation.',
      duration: 50,
      resources: ['Citation Guide (MLA & APA)', 'Research Tips', 'Plagiarism Prevention'],
    },
  ];
}

function generateHistoryLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'Introduction to Historical Thinking',
      description: 'Learn to think like a historian.',
      content: 'Understand primary vs secondary sources, causation, context, and historical interpretation.',
      duration: 35,
      resources: ['Historical Thinking Concepts', 'Source Analysis Guide', 'Timeline Creation Tools'],
    },
    {
      title: 'Ancient Civilizations',
      description: 'Explore Mesopotamia, Egypt, Greece, and Rome.',
      content: 'Study the rise and fall of ancient civilizations, their contributions, and lasting impact.',
      duration: 50,
      resources: ['Ancient Civilizations Timeline', 'Primary Source Documents', 'Archaeological Evidence'],
    },
    {
      title: 'Medieval Europe',
      description: 'Understand feudalism, crusades, and medieval culture.',
      content: 'Learn about the medieval social structure, religious influence, and significant events.',
      duration: 45,
      resources: ['Feudal System Diagram', 'Medieval Life Resources', 'Crusades Map'],
    },
    {
      title: 'Renaissance and Reformation',
      description: 'Discover the rebirth of art, science, and religion.',
      content: 'Study Renaissance humanism, art, Protestant Reformation, and scientific revolution.',
      duration: 50,
      resources: ['Renaissance Art Gallery', 'Reformation Timeline', 'Scientific Revolution Figures'],
    },
    {
      title: 'Age of Exploration',
      description: 'Follow European explorers around the globe.',
      content: 'Learn about motivations for exploration, major voyages, and consequences of contact.',
      duration: 45,
      resources: ['Exploration Routes Map', 'Explorer Biographies', 'Columbian Exchange Diagram'],
    },
    {
      title: 'Revolutionary Era',
      description: 'Examine the American and French Revolutions.',
      content: 'Understand causes, events, and outcomes of revolutions. Compare revolutionary ideals.',
      duration: 55,
      resources: ['Revolutionary Documents', 'Comparative Analysis Chart', 'Key Figures Profiles'],
    },
    {
      title: 'Industrial Revolution',
      description: 'Discover how industrialization changed the world.',
      content: 'Study technological innovations, urbanization, working conditions, and social changes.',
      duration: 50,
      resources: ['Invention Timeline', 'Factory System Analysis', 'Labor Movement Documents'],
    },
    {
      title: '20th Century Conflicts',
      description: 'Understand World Wars and the Cold War.',
      content: 'Learn causes, major events, and consequences of global conflicts.',
      duration: 60,
      resources: ['WWI/WWII Timelines', 'Cold War Map', 'Primary Source Collection'],
    },
  ];
}

function generateGeographyLessons(courseTitle: string, level: string): GeneratedLesson[] {
  return [
    {
      title: 'Introduction to Geography',
      description: 'Learn the five themes of geography.',
      content: 'Study location, place, human-environment interaction, movement, and region.',
      duration: 35,
      resources: ['Five Themes Poster', 'Geography Tools Guide', 'Map Reading Basics'],
    },
    {
      title: 'Maps and Map Skills',
      description: 'Master reading and interpreting maps.',
      content: 'Learn about map types, scale, symbols, legends, latitude/longitude, and projection.',
      duration: 45,
      resources: ['Map Types Examples', 'Coordinate Practice', 'Map Symbols Reference'],
    },
    {
      title: 'Physical Geography: Landforms',
      description: 'Understand Earth\'s major landforms.',
      content: 'Study mountains, valleys, plateaus, plains, and the forces that shape them.',
      duration: 40,
      resources: ['Landform Diagrams', 'Formation Processes', 'World Landforms Map'],
    },
    {
      title: 'Climate and Weather',
      description: 'Explore atmospheric patterns and climate zones.',
      content: 'Learn about weather vs climate, climate zones, and factors affecting climate.',
      duration: 50,
      resources: ['Climate Zone Map', 'Weather Patterns Guide', 'Climate Data Graphs'],
    },
    {
      title: 'Water Systems',
      description: 'Study oceans, rivers, and the water cycle.',
      content: 'Understand the water cycle, ocean currents, river systems, and water resources.',
      duration: 45,
      resources: ['Water Cycle Diagram', 'River Systems Map', 'Ocean Currents Animation'],
    },
    {
      title: 'Population and Migration',
      description: 'Examine human population patterns.',
      content: 'Learn about population density, distribution, growth, and migration patterns.',
      duration: 50,
      resources: ['Population Density Map', 'Migration Patterns', 'Demographic Data'],
    },
    {
      title: 'Cultural Geography',
      description: 'Explore human cultures and diversity.',
      content: 'Study religion, language, customs, and cultural diffusion around the world.',
      duration: 45,
      resources: ['World Religions Map', 'Language Families', 'Cultural Regions Guide'],
    },
    {
      title: 'Economic Geography',
      description: 'Understand economic systems and resources.',
      content: 'Learn about economic activities, resource distribution, and development.',
      duration: 50,
      resources: ['Economic Systems Comparison', 'Resource Maps', 'Trade Routes'],
    },
  ];
}

// ===== LANGUAGE LESSONS =====
function generateLanguageLessons(courseTitle: string, level: string): GeneratedLesson[] {
  // Check if it's Spanish course
  if (courseTitle.toLowerCase().includes('spanish')) {
    return generateSpanishLessons(courseTitle, level);
  }
  
  // Default language lessons
  return [
    {
      title: 'Alphabet and Pronunciation',
      description: 'Learn the basics of reading and speaking.',
      content: 'Master the alphabet, key sounds, and pronunciation rules.',
      duration: 30,
      resources: ['Pronunciation Audio', 'Alphabet Chart', 'Practice Exercises'],
    },
    {
      title: 'Basic Greetings',
      description: 'Start conversations with common phrases.',
      content: 'Learn hello, goodbye, please, thank you, and introductions.',
      duration: 30,
      resources: ['Phrase Book', 'Dialogue Examples', 'Audio Practice'],
    },
    {
      title: 'Numbers and Time',
      description: 'Count and tell time in your new language.',
      content: 'Learn numbers 1-100, days, months, and time expressions.',
      duration: 35,
      resources: ['Number Chart', 'Time Expressions', 'Calendar Vocabulary'],
    },
    {
      title: 'Essential Verbs',
      description: 'Use the most common verbs.',
      content: 'Master basic verb conjugation and sentence structure.',
      duration: 45,
      resources: ['Verb List', 'Conjugation Practice', 'Sentence Builder'],
    },
    {
      title: 'Food and Dining',
      description: 'Order meals and discuss food.',
      content: 'Learn food vocabulary and restaurant phrases.',
      duration: 40,
      resources: ['Food Flashcards', 'Menu Vocabulary', 'Dining Dialogues'],
    },
    {
      title: 'Daily Activities',
      description: 'Talk about your daily routine.',
      content: 'Learn verbs and phrases for everyday activities.',
      duration: 40,
      resources: ['Activity Vocabulary', 'Routine Phrases', 'Time Expressions'],
    },
    {
      title: 'Shopping Vocabulary',
      description: 'Navigate stores and markets.',
      content: 'Learn shopping phrases, numbers for money, and negotiation.',
      duration: 35,
      resources: ['Shopping Phrases', 'Money Vocabulary', 'Store Types'],
    },
    {
      title: 'Travel and Directions',
      description: 'Get around and ask for help.',
      content: 'Learn direction phrases, transportation vocabulary, and navigation.',
      duration: 40,
      resources: ['Direction Guide', 'Transport Vocabulary', 'Map Reading'],
    },
  ];
}

// ===== SPANISH LESSONS =====
function generateSpanishLessons(courseTitle: string, level: string): GeneratedLesson[] {
  try {
    const levelMap: Record<string, string> = {
      'junior': 'basic',
      'secondary': 'intermediate',
      'advanced': 'advanced'
    };
    
    const curriculumLevel = levelMap[level.toLowerCase()] || level.toLowerCase();
    const curriculumPath = path.join(process.cwd(), 'curriculum', 'spanish', `${curriculumLevel}.json`);
    
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Spanish curriculum not found for level: ${curriculumLevel}, using generic lessons`);
      return generateGenericLessons(courseTitle, level);
    }
    
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    if (!curriculumData.topics || !Array.isArray(curriculumData.topics)) {
      console.log(`⚠️  Invalid curriculum format for level: ${curriculumLevel}`);
      return generateGenericLessons(courseTitle, level);
    }
    
    return curriculumData.topics.map((topic: any, index: number) => {
      // For English learners - English first, then Spanish
      const isBasic = curriculumLevel === 'basic';
      const topicTitle = topic.topic || topic.title || `Spanish Topic ${index + 1}`;
      const englishTitle = getEnglishTranslation(topicTitle, '');
      
      let content = `## ${englishTitle || topicTitle}${englishTitle && englishTitle !== topicTitle ? ` (${topicTitle})` : ''}\n\n`;
      
      // For beginners: English explanation first, then Spanish
      if (isBasic) {
        content += `### What You'll Learn (English)\n\n`;
        const englishDesc = getEnglishTranslation(topic.description || '', '');
        content += `${englishDesc || 'Learn essential Spanish concepts and vocabulary.'}\n\n`;
        content += `### En Español (In Spanish)\n\n`;
        content += `${topic.description || ''}\n\n`;
      } else {
        // For intermediate/advanced: Bilingual format
        content += `**English:** ${getEnglishTranslation(topic.description || '', '')}\n\n`;
        content += `**Spanish:** ${topic.description || ''}\n\n`;
      }
      
      if (topic.instructional_materials && Array.isArray(topic.instructional_materials)) {
        content += '\n### Step-by-Step Guide (English)\n\n';
        topic.instructional_materials.forEach((mat: any) => {
          if (typeof mat === 'object' && mat.type && mat.title) {
            const englishType = getEnglishTranslation(mat.type, '');
            const englishTitle = getEnglishTranslation(mat.title, '');
            const englishContent = getEnglishTranslation(mat.content || '', '');
            
            if (isBasic) {
              // For beginners: English first, then Spanish
              content += `**${englishTitle || mat.title}**\n\n`;
              content += `${englishContent || mat.content || ''}\n\n`;
              if (englishContent && englishContent !== mat.content) {
                content += `*Spanish version: ${mat.content || ''}*\n\n`;
              }
            } else {
              content += `**${mat.type}${englishType ? ` (${englishType})` : ''}: ${mat.title}**${englishTitle ? ` (${englishTitle})` : ''}\n\n`;
              content += `${mat.content || ''}\n\n`;
              if (englishContent) {
                content += `*English: ${englishContent}*\n\n`;
              }
            }
          }
        });
      }
      
      if (topic.key_points && Array.isArray(topic.key_points)) {
        content += '\n### Key Concepts (English) / Puntos Clave (Español)\n\n';
        topic.key_points.forEach((kp: any) => {
          if (typeof kp === 'object' && kp.title && kp.content) {
            const englishTitle = getEnglishTranslation(kp.title, '');
            const englishContent = getEnglishTranslation(kp.content, '');
            
            if (isBasic) {
              // For beginners: English explanation first
              content += `**${englishTitle || kp.title}**\n\n`;
              content += `${englishContent || kp.content}\n\n`;
              content += `*Spanish: ${kp.title} - ${kp.content.substring(0, 100)}${kp.content.length > 100 ? '...' : ''}*\n\n`;
            } else {
              content += `**${kp.title}** ${englishTitle ? `(${englishTitle})` : ''}\n\n`;
              content += `${kp.content}\n\n`;
              if (englishContent) {
                content += `*English: ${englishContent}*\n\n`;
              }
            }
          } else if (typeof kp === 'string') {
            const englishKp = getEnglishTranslation(kp, '');
            if (isBasic) {
              content += `- ${englishKp || kp}${englishKp ? ` (${kp})` : ''}\n`;
            } else {
              content += `- ${kp} (${englishKp || 'translation'})\n`;
            }
          }
        });
      }
      
      if (topic.examples && Array.isArray(topic.examples)) {
        content += '\n### Examples (English) / Ejemplos (Español)\n\n';
        topic.examples.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.scenario && ex.explanation) {
            const englishScenario = getEnglishTranslation(ex.scenario, '');
            const englishExplanation = getEnglishTranslation(ex.explanation, '');
            
            if (isBasic) {
              content += `**Example: ${englishScenario || ex.scenario}**\n\n`;
              content += `${englishExplanation || ex.explanation}\n\n`;
              content += `*Spanish: ${ex.scenario} - ${ex.explanation.substring(0, 80)}${ex.explanation.length > 80 ? '...' : ''}*\n\n`;
            } else {
              content += `**${ex.scenario}** ${englishScenario ? `(${englishScenario})` : ''}\n\n`;
              content += `${ex.explanation}\n\n`;
              if (englishExplanation) {
                content += `*English: ${englishExplanation}*\n\n`;
              }
            }
          } else if (typeof ex === 'string') {
            const englishEx = getEnglishTranslation(ex, '');
            if (isBasic) {
              content += `- ${englishEx || ex}${englishEx ? ` (${ex})` : ''}\n`;
            } else {
              content += `- ${ex} (${englishEx || 'translation'})\n`;
            }
          }
        });
      }
      
      if (topic.exercises && Array.isArray(topic.exercises)) {
        content += '\n### Practice Exercises (English) / Ejercicios (Español)\n\n';
        topic.exercises.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.title && ex.instructions) {
            const englishTitle = getEnglishTranslation(ex.title, '');
            const englishInstructions = getEnglishTranslation(ex.instructions, '');
            
            if (isBasic) {
              // For beginners: Clear English instructions first
              content += `**Exercise: ${englishTitle || ex.title}**\n\n`;
              content += `**Instructions (English):**\n${englishInstructions || ex.instructions}\n\n`;
              content += `**Instrucciones (Español):**\n${ex.instructions}\n\n`;
            } else {
              content += `**${ex.title}** ${englishTitle ? `(${englishTitle})` : ''}\n\n`;
              content += `${ex.instructions}\n\n`;
              if (englishInstructions) {
                content += `*English: ${englishInstructions}*\n\n`;
              }
            }
            
            if (ex.example_answer) {
              const englishAnswer = getEnglishTranslation(ex.example_answer, '');
              if (isBasic) {
                content += `**Example Answer (English):**\n${englishAnswer || ex.example_answer}\n\n`;
                content += `**Respuesta de Ejemplo (Español):**\n${ex.example_answer}\n\n`;
              } else {
                content += `*Example Answer / Respuesta de Ejemplo:* ${ex.example_answer}\n`;
                if (englishAnswer) {
                  content += `*English: ${englishAnswer}*\n\n`;
                }
              }
            }
          } else if (typeof ex === 'string') {
            const englishEx = getEnglishTranslation(ex, '');
            if (isBasic) {
              content += `- ${englishEx || ex}${englishEx ? ` (${ex})` : ''}\n`;
            } else {
              content += `- ${ex} (${englishEx || 'translation'})\n`;
            }
          }
        });
      }
      
      if (topic.summary) {
        content += `\n### Summary (English) / Resumen (Español)\n\n`;
        const englishSummary = getEnglishTranslation(topic.summary, '');
        if (isBasic) {
          content += `**English:**\n${englishSummary || 'This lesson covered essential Spanish concepts.'}\n\n`;
          content += `**Español:**\n${topic.summary}\n\n`;
        } else {
          content += `**English:** ${englishSummary}\n\n`;
          content += `**Spanish:** ${topic.summary}\n\n`;
        }
      }
      
      const resources: string[] = [];
      if (topic.textbooks && Array.isArray(topic.textbooks)) {
        topic.textbooks.forEach((tb: any) => {
          if (typeof tb === 'object' && tb.title) {
            const source = tb.source ? ` (${tb.source})` : '';
            const reason = tb.reason ? ` - ${tb.reason}` : '';
            resources.push(`Textbook: ${tb.title}${source}${reason}`);
          } else if (typeof tb === 'string') {
            resources.push(`Textbook: ${tb}`);
          }
        });
      }
      
      if (topic.videos && Array.isArray(topic.videos)) {
        topic.videos.forEach((vid: any) => {
          if (typeof vid === 'object' && vid.title) {
            const reason = vid.reason ? ` - ${vid.reason}` : '';
            resources.push(`Video: ${vid.title}${reason}`);
          } else if (typeof vid === 'string') {
            resources.push(`Video: ${vid}`);
          }
        });
      }
      
      const quiz = generateQuizFromExercises(topic.exercises, topic.key_points);
      const assignments = generateAssignmentsFromExercises(topic.exercises);
      
      // Debug logging for first Spanish lesson
      if (curriculumLevel === 'basic' && index === 0) {
        console.log(`📝 Quiz generated: ${quiz ? `${quiz.questions?.length || 0} questions` : 'NONE'}`);
        console.log(`📋 Assignments generated: ${assignments ? `${assignments.length} assignments` : 'NONE'}`);
        if (quiz && quiz.questions) {
          console.log(`   First question: ${quiz.questions[0]?.question?.substring(0, 50)}...`);
        }
        if (assignments && assignments.length > 0) {
          console.log(`   First assignment: ${assignments[0]?.title}`);
        }
      }
      
      // For English learners: English title first, Spanish in parentheses
      const spanishTitle = topic.topic || topic.title || `Spanish Topic ${index + 1}`;
      // englishTitle already declared above, reuse it
      
      let displayTitle: string;
      let displayDescription: string;
      
      if (isBasic) {
        // For beginners: English first
        displayTitle = englishTitle ? `${englishTitle} (${spanishTitle})` : spanishTitle;
        const englishDesc = getEnglishTranslation(topic.description || '', '');
        displayDescription = englishDesc 
          ? `${englishDesc} | ${topic.description || ''}`
          : topic.description || '';
      } else {
        // For intermediate/advanced: Bilingual
        displayTitle = englishTitle ? `${spanishTitle} (${englishTitle})` : spanishTitle;
        displayDescription = `${topic.description || ''} | ${getEnglishTranslation(topic.description || '', '')}`;
      }
      
      return {
        title: displayTitle,
        description: displayDescription,
        content: content,
        duration: 45 + (index * 5),
        resources: resources.length > 0 ? resources : ['Spanish Resources'],
        quiz: quiz,
        assignments: assignments,
      };
    });
  } catch (error: any) {
    console.error(`❌ Error generating Spanish lessons: ${error.message}`);
    return generateGenericLessons(courseTitle, level);
  }
}

/**
 * Helper function to get English translations for Spanish content
 * Designed for English learners - provides clear, beginner-friendly explanations
 */
function getEnglishTranslation(spanishText: string, context: string): string {
  if (!spanishText || spanishText.trim().length === 0) return '';
  
  // Remove markdown formatting for better matching
  const cleanText = spanishText.replace(/\*\*/g, '').replace(/#/g, '').replace(/📚|🗣️|✨|📝|🎯|🅰️|👂|´|🎶|📸|🎥|⚠️|🔄|💡|💬|💰|🍽️|📖|📄|🔗|⚖️|📈|📉|🏆|❓|🔑|🌍|💭|⏰|🔮|📊|🤝|✍️|💼|📧|📝|🔄|🎯|🔗|📚|💬|🔄|💡|🎯|📝|📄|⚠️|🔄|🎯|📚|💬|🔄|💡|🎯|📝|📄|⚠️|🔄|🎯/g, '').trim();
  const lowerText = cleanText.toLowerCase();
  
  // Comprehensive Spanish to English translations with beginner-friendly explanations
  const translations: Record<string, string> = {
    // Topic titles - Basic (with beginner-friendly explanations)
    'el alfabeto español y la pronunciación': 'The Spanish Alphabet and Pronunciation - Learn the 27 letters of the Spanish alphabet and how to pronounce them correctly. Spanish is phonetic, meaning words are pronounced as they are written.',
    'saludos y presentaciones': 'Greetings and Introductions - Learn how to greet people, introduce yourself, and have basic conversations in Spanish. Essential phrases for meeting new people.',
    'números y tiempo': 'Numbers and Time - Learn to count in Spanish and tell time. Master numbers 1-100, days of the week, months, and time expressions.',
    'verbos regulares en presente': 'Regular Verbs in Present Tense - Learn how to conjugate regular verbs ending in -ar, -er, and -ir in the present tense. This is the foundation of Spanish verb conjugation.',
    'artículos y sustantivos': 'Articles and Nouns - Learn about Spanish articles (el, la, los, las) and how nouns work. Understand gender (masculine/feminine) and number (singular/plural) in Spanish.',
    'adjetivos y descripciones': 'Adjectives and Descriptions - Learn how to describe people, places, and things in Spanish. Adjectives must agree with the nouns they describe in gender and number.',
    'vocabulario de comida y restaurantes': 'Food and Restaurant Vocabulary - Learn essential words and phrases for ordering food, talking about meals, and dining in Spanish-speaking countries.',
    'tiempos pasados: pretérito e imperfecto': 'Past Tenses: Preterite and Imperfect',
    'futuro y condicional': 'Future and Conditional',
    'pronombres de objeto directo e indirecto': 'Direct and Indirect Object Pronouns',
    'verbos reflexivos y rutinas diarias': 'Reflexive Verbs and Daily Routines',
    'introducción al subjuntivo': 'Introduction to Subjunctive',
    'comparativos y superlativos': 'Comparatives and Superlatives',
    'por vs para': 'Por vs Para',
    'vocabulario de viajes y transporte': 'Travel and Transportation Vocabulary',
    'expresiones idiomáticas y modismos': 'Idiomatic Expressions and Idioms',
    'lectura y comprensión de textos': 'Reading and Text Comprehension',
    
    // Topic titles - Advanced
    'subjuntivo avanzado': 'Advanced Subjunctive',
    'tiempos perfectos': 'Perfect Tenses',
    'voz pasiva y expresiones impersonales': 'Passive Voice and Impersonal Expressions',
    'ser vs estar: usos avanzados': 'Ser vs Estar: Advanced Uses',
    'escritura académica y formal': 'Academic and Formal Writing',
    'literatura y análisis de textos': 'Literature and Text Analysis',
    'español de negocios y profesional': 'Business and Professional Spanish',
    'variaciones regionales del español': 'Regional Variations of Spanish',
    'debate y argumentación': 'Debate and Argumentation',
    'conversación avanzada y fluidez': 'Advanced Conversation and Fluency',
    
    // Common instructional phrases
    'aprende': 'Learn',
    'practica': 'Practice',
    'ejercicio': 'Exercise',
    'ejemplo': 'Example',
    'resumen': 'Summary',
    'puntos clave': 'Key Points',
    'materiales didácticos': 'Instructional Materials',
    'guía paso a paso': 'Step-by-Step Guide',
    'guía visual': 'Visual Guide',
    'ejercicio interactivo': 'Interactive Exercise',
    'paso 1': 'Step 1',
    'paso 2': 'Step 2',
    'paso 3': 'Step 3',
    'paso 4': 'Step 4',
    'paso 5': 'Step 5',
    'paso 6': 'Step 6',
    'paso 7': 'Step 7',
    
    // Common descriptive phrases
    'cómo entenderlo': 'How to understand it',
    'mundo real': 'Real world',
    'mejor práctica': 'Best practice',
    'estudiante': 'Student',
    'aprende': 'Learns',
    'practica': 'Practices',
    'usa': 'Uses',
    'domina': 'Masters',
    'identifica': 'Identifies',
    'comprende': 'Understands',
    'expresa': 'Expresses',
    
    // Grammar terms
    'alfabeto': 'alphabet',
    'pronunciación': 'pronunciation',
    'saludos': 'greetings',
    'presentaciones': 'introductions',
    'números': 'numbers',
    'tiempo': 'time',
    'verbos': 'verbs',
    'presente': 'present',
    'pasado': 'past',
    'futuro': 'future',
    'condicional': 'conditional',
    'subjuntivo': 'subjunctive',
    'pretérito': 'preterite',
    'imperfecto': 'imperfect',
    'artículos': 'articles',
    'sustantivos': 'nouns',
    'adjetivos': 'adjectives',
    'pronombres': 'pronouns',
    'reflexivos': 'reflexive',
    'comparativos': 'comparatives',
    'superlativos': 'superlatives',
    'conjugación': 'conjugation',
    'reglas': 'rules',
    'formación': 'formation',
    'usos': 'uses',
    
    // Common sentence patterns with explanations
    'el español tiene': 'Spanish has',
    'se usa para': 'is used for',
    'se usa en': 'is used in',
    'es importante': 'is important',
    'es esencial': 'is essential',
    'es común': 'is common',
    'es útil': 'is useful',
    'te permite': 'allows you to',
    'te ayuda a': 'helps you to',
    'dominar': 'to master',
    'aprender': 'to learn',
    'practicar': 'to practice',
    'entender': 'to understand',
    'expresar': 'to express',
    
    // Beginner-friendly explanations for common phrases
    'aprende el alfabeto español': 'Learn the Spanish alphabet - The Spanish alphabet has 27 letters. Unlike English, Spanish is phonetic, so each letter has a consistent sound.',
    'practica la pronunciación': 'Practice pronunciation - Spanish pronunciation is consistent. Once you learn the sounds, you can read any Spanish word correctly.',
    'aprende saludos básicos': 'Learn basic greetings - Start with simple greetings like "Hola" (Hello), "Buenos días" (Good morning), and "¿Cómo estás?" (How are you?).',
    'aprende números': 'Learn numbers - Start with numbers 1-20, then expand to 100. Numbers are essential for telling time, dates, and quantities.',
    'conjuga verbos': 'Conjugate verbs - Change verb endings to match the subject. Regular verbs follow predictable patterns.',
    'usa artículos correctamente': 'Use articles correctly - Spanish has four articles: el (masculine singular), la (feminine singular), los (masculine plural), las (feminine plural).',
    'describe con adjetivos': 'Describe with adjectives - Adjectives come after nouns in Spanish and must match the noun in gender and number.',
  };
  
  // Enhanced translation for longer descriptions - provide beginner-friendly explanations
  if (lowerText.length > 50) {
    // Check for common beginner phrases and provide detailed explanations
    if (lowerText.includes('alfabeto') && lowerText.includes('pronunciación')) {
      return 'Learn the Spanish alphabet and pronunciation. Spanish has 27 letters, and unlike English, it is phonetic - words are pronounced exactly as they are written. This makes reading Spanish easier once you learn the sounds.';
    }
    if (lowerText.includes('saludos') && lowerText.includes('presentaciones')) {
      return 'Learn greetings and introductions in Spanish. Master essential phrases like "Hello", "How are you?", and "Nice to meet you". These are the first words you\'ll use in real conversations.';
    }
    if (lowerText.includes('números') && lowerText.includes('tiempo')) {
      return 'Learn numbers and time in Spanish. Master counting from 1-100, days of the week, months, and how to tell time. These are essential for everyday communication.';
    }
    if (lowerText.includes('verbos') && lowerText.includes('presente')) {
      return 'Learn regular verbs in the present tense. Spanish verbs change endings based on who is doing the action. Regular verbs follow predictable patterns that make conjugation easier.';
    }
    if (lowerText.includes('artículos') && lowerText.includes('sustantivos')) {
      return 'Learn articles and nouns in Spanish. Every noun has a gender (masculine or feminine) and articles must match. This is different from English and is a key concept in Spanish.';
    }
    if (lowerText.includes('adjetivos') && lowerText.includes('descripciones')) {
      return 'Learn adjectives and descriptions. In Spanish, adjectives come after nouns and must agree in gender and number. This allows you to describe people, places, and things accurately.';
    }
  }
  
  // Try exact match first
  if (translations[lowerText]) {
    return translations[lowerText];
  }
  
  // Try to find longest matching phrase
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lowerText.includes(key) && key.length > 3) {
      return translations[key];
    }
  }
  
  // For very long text, try to extract and translate key phrases
  const keyPhrases = sortedKeys.filter(phrase => 
    lowerText.includes(phrase) && phrase.length > 8
  );
  
  if (keyPhrases.length > 0) {
    return translations[keyPhrases[0]];
  }
  
  // If it's a very short phrase (1-3 words), try word-by-word translation
  if (cleanText.split(/\s+/).length <= 3) {
    const words = cleanText.toLowerCase().split(/\s+/);
    const translatedWords = words.map(word => {
      // Try to find translation for each word
      for (const [key, value] of Object.entries(translations)) {
        if (key === word || word.includes(key) || key.includes(word)) {
          return value;
        }
      }
      return '';
    }).filter(w => w.length > 0);
    
    if (translatedWords.length > 0) {
      return translatedWords.join(' ');
    }
  }
  
  // Return empty if no translation found (content will still be in Spanish)
  return '';
}

// ===== HELPER FUNCTIONS FOR QUIZ AND ASSIGNMENT GENERATION =====

/**
 * Generate quiz questions from exercises and key points
 */
function generateQuizFromExercises(exercises: any[] | undefined, keyPoints: any[] | undefined): { questions: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string; type: 'multiple-choice' }> } | undefined {
  // Detect if content is in Spanish (check key points too)
  const isSpanish = (exercises && exercises.some(ex => {
    if (typeof ex === 'object' && ex.title) {
      const title = ex.title.toLowerCase();
      return title.includes('practica') || title.includes('aprende') || title.includes('ejercicio') || 
             title.includes('español') || title.includes('pronunciación') || title.includes('alfabeto');
    }
    return false;
  })) || (keyPoints && keyPoints.some(kp => {
    if (typeof kp === 'object' && kp.title) {
      const title = kp.title.toLowerCase();
      return title.includes('español') || title.includes('alfabeto') || title.includes('pronunciación');
    }
    return false;
  }));
  
  if (!exercises || exercises.length === 0) {
    // If no exercises, generate questions from key points
    if (!keyPoints || keyPoints.length === 0) {
      return undefined;
    }
    return generateQuizFromKeyPoints(keyPoints, isSpanish);
  }

  const questions: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string; type: 'multiple-choice' }> = [];
  
  // Generate 3-5 quiz questions from exercises
  const numQuestions = Math.min(5, Math.max(3, exercises.length));
  
  for (let i = 0; i < numQuestions && i < exercises.length; i++) {
    const exercise = exercises[i];
    if (!exercise || typeof exercise !== 'object') continue;
    
    // Create question from exercise title (bilingual for Spanish)
    let questionText = '';
    if (exercise.title) {
      const title = exercise.title;
      // Check if Spanish
      if (isSpanish || title.toLowerCase().includes('practica') || title.toLowerCase().includes('aprende')) {
        // Spanish questions
        if (title.includes('Practica') || title.includes('Aprende')) {
          questionText = `¿Cuál es el propósito principal de "${title}"? / What is the main purpose of "${title}"?`;
        } else if (title.includes('Identifica') || title.includes('Lista')) {
          questionText = `¿Qué debes hacer en "${title}"? / What should you do in "${title}"?`;
        } else {
          questionText = `Basado en "${title}", ¿qué debes hacer? / Based on "${title}", what should you do?`;
        }
      } else {
        // English questions
        if (title.includes('Identify') || title.includes('List')) {
          questionText = `What is the main purpose of "${title}"?`;
        } else if (title.includes('Compare') || title.includes('Design')) {
          questionText = `Which approach is recommended in "${title}"?`;
        } else {
          questionText = `Based on "${title}", what should you do?`;
        }
      }
    } else {
      questionText = isSpanish 
        ? `¿Cuál de las siguientes opciones describe mejor el enfoque correcto para este ejercicio? / Which of the following best describes the correct approach for this exercise?`
        : `Which of the following best describes the correct approach for this exercise?`;
    }
    
    // Generate options based on exercise content and key points
    const { options, correctIndex } = generateQuizOptions(exercise, keyPoints, isSpanish);
    
    if (options.length >= 4) {
      const explanation = exercise.example_answer || exercise.instructions || 
        (isSpanish 
          ? 'Revisa el contenido de la lección y los puntos clave para entender la respuesta correcta. / Review the lesson content and key points to understand the correct answer.'
          : 'Review the lesson content and key points to understand the correct answer.');
      
      questions.push({
        question: questionText,
        options: options,
        correctAnswer: correctIndex,
        explanation: explanation,
        type: 'multiple-choice'
      });
    }
  }
  
  // If we have key points and need more questions, add questions about them
  if (keyPoints && keyPoints.length > 0 && questions.length < 5) {
    const keyPointQuestions = generateQuizFromKeyPoints(keyPoints, isSpanish);
    if (keyPointQuestions && keyPointQuestions.questions) {
      questions.push(...keyPointQuestions.questions.slice(0, 5 - questions.length));
    }
  }
  
  return questions.length > 0 ? { questions } : undefined;
}

/**
 * Generate quiz questions from key points
 */
function generateQuizFromKeyPoints(keyPoints: any[], isSpanish: boolean = false): { questions: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string; type: 'multiple-choice' }> } | undefined {
  if (!keyPoints || keyPoints.length === 0) {
    return undefined;
  }

  const questions: Array<{ question: string; options: string[]; correctAnswer: number; explanation: string; type: 'multiple-choice' }> = [];
  const numQuestions = Math.min(5, keyPoints.length);
  
  for (let i = 0; i < numQuestions; i++) {
    const keyPoint = keyPoints[i];
    if (!keyPoint || typeof keyPoint !== 'object' || !keyPoint.title) continue;
    
    const { options, correctIndex } = generateKeyPointOptions(keyPoint, keyPoints, isSpanish);
    
    if (options.length >= 4) {
      const questionText = isSpanish
        ? `¿Cuál es el concepto principal de "${keyPoint.title}"? / What is the main concept of "${keyPoint.title}"?`
        : `What is the main concept of "${keyPoint.title}"?`;
      
      const explanation = keyPoint.content || 
        (isSpanish 
          ? 'Revisa la sección de puntos clave para entender este concepto. / Review the key points section to understand this concept.'
          : 'Review the key points section to understand this concept.');
      
      questions.push({
        question: questionText,
        options: options,
        correctAnswer: correctIndex,
        explanation: explanation,
        type: 'multiple-choice'
      });
    }
  }
  
  return questions.length > 0 ? { questions } : undefined;
}

/**
 * Generate quiz options from exercise
 */
function generateQuizOptions(exercise: any, keyPoints: any[] | undefined, isSpanish: boolean = false): { options: string[]; correctIndex: number } {
  const options: string[] = [];
  
  // First option: correct answer (from example_answer or key concept)
  let correctAnswer = '';
  if (exercise.example_answer) {
    // Extract key concept from example_answer
    const answer = exercise.example_answer;
    // Extract the main point (first sentence or key phrase)
    const sentences = answer.split('.');
    correctAnswer = sentences[0].trim();
    if (correctAnswer.length > 120) {
      correctAnswer = correctAnswer.substring(0, 120) + '...';
    }
  } else if (exercise.instructions) {
    // Extract key action from instructions
    const instructions = exercise.instructions;
    if (isSpanish) {
      // Handle Spanish instructions
      if (instructions.includes('Paso 1:') || instructions.includes('Paso 1')) {
        correctAnswer = 'Sigue el proceso paso a paso descrito en el ejercicio / Follow the step-by-step process outlined in the exercise';
      } else if (instructions.includes('Practica') || instructions.includes('Practica:')) {
        correctAnswer = 'Practica los conceptos según las instrucciones / Practice the concepts as instructed';
      } else if (instructions.includes('Aprende') || instructions.includes('Aprende:')) {
        correctAnswer = 'Aprende los conceptos siguiendo las instrucciones / Learn the concepts following the instructions';
      } else if (instructions.includes('Memoriza') || instructions.includes('Memoriza:')) {
        correctAnswer = 'Memoriza el contenido según las instrucciones / Memorize the content as instructed';
      } else {
        correctAnswer = 'Aplica los conceptos aprendidos en esta lección correctamente / Apply the concepts learned in this lesson correctly';
      }
    } else {
      // Handle English instructions
      if (instructions.includes('Step 1:') || instructions.includes('Step 1')) {
        correctAnswer = 'Follow the step-by-step process outlined in the exercise';
      } else if (instructions.includes('Calculate') || instructions.includes('Calculate:')) {
        correctAnswer = 'Perform the calculations as instructed';
      } else if (instructions.includes('Design') || instructions.includes('Design:')) {
        correctAnswer = 'Create a design following the specified requirements';
      } else if (instructions.includes('Compare') || instructions.includes('Compare:')) {
        correctAnswer = 'Analyze and compare the options as described';
      } else {
        correctAnswer = 'Apply the concepts learned in this lesson correctly';
      }
    }
  } else {
    correctAnswer = isSpanish 
      ? 'Aplica los conceptos clave de esta lección / Apply the key concepts from this lesson'
      : 'Apply the key concepts from this lesson';
  }
  
  options.push(correctAnswer);
  
  // Generate incorrect options (distractors)
  const distractors = [
    'Skip the exercise and move to the next lesson',
    'Use traditional on-premises methods instead of cloud',
    'Ignore the instructions and use a different approach',
    'Focus only on cost without considering other factors',
    'Use the first solution that comes to mind without analysis',
  ];
  
  // Add more realistic distractors if we have key points
  if (keyPoints && keyPoints.length > 0) {
    const otherKeyPoint = keyPoints[Math.floor(Math.random() * keyPoints.length)];
    if (otherKeyPoint && typeof otherKeyPoint === 'object' && otherKeyPoint.title) {
      distractors.push(`Focus only on ${otherKeyPoint.title} without considering other factors`);
    }
  }
  
  // Add 3 distractors
  for (let i = 0; i < 3 && i < distractors.length; i++) {
    options.push(distractors[i]);
  }
  
  // Shuffle options but track correct answer index
  const correctIndex = 0;
  const incorrect = options.slice(1);
  // Shuffle incorrect options
  for (let i = incorrect.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [incorrect[i], incorrect[j]] = [incorrect[j], incorrect[i]];
  }
  
  // Randomly place correct answer
  const finalCorrectIndex = Math.floor(Math.random() * options.length);
  const finalOptions = [...incorrect];
  finalOptions.splice(finalCorrectIndex, 0, correctAnswer);
  
  return { options: finalOptions, correctIndex: finalCorrectIndex };
}

/**
 * Generate quiz options from key point
 */
function generateKeyPointOptions(keyPoint: any, allKeyPoints: any[], isSpanish: boolean = false): { options: string[]; correctIndex: number } {
  const options: string[] = [];
  
  // Correct answer: extract main concept from key point content
  let correctAnswer = '';
  if (keyPoint.content) {
    const content = keyPoint.content;
    // Extract first sentence or key phrase (before "**How it works:**" or similar)
    let mainContent = content.split('**How it works:**')[0].split('**Real-world:**')[0];
    const firstSentence = mainContent.split('.')[0].trim();
    if (firstSentence.length > 100) {
      correctAnswer = firstSentence.substring(0, 100) + '...';
    } else {
      correctAnswer = firstSentence || keyPoint.title || 'The concept described in the key point';
    }
  } else {
    correctAnswer = keyPoint.title || 'The concept described in the key point';
  }
  
  options.push(correctAnswer);
  
  // Generate distractors from other key points
  const otherKeyPoints = allKeyPoints.filter(kp => kp !== keyPoint && typeof kp === 'object');
  const distractors: string[] = [];
  
  for (let i = 0; i < Math.min(3, otherKeyPoints.length); i++) {
    const otherKp = otherKeyPoints[i];
    if (otherKp && otherKp.content) {
      let content = otherKp.content.split('**How it works:**')[0].split('**Real-world:**')[0];
      content = content.split('.')[0].trim();
      if (content.length > 100) {
        distractors.push(content.substring(0, 100) + '...');
      } else {
        distractors.push(content);
      }
    } else if (otherKp && otherKp.title) {
      distractors.push(`A concept related to ${otherKp.title}`);
    }
  }
  
  // Fill remaining slots with generic distractors
  const genericDistractors = [
    'A concept not covered in this lesson',
    'An outdated approach that is no longer recommended',
    'A different technology entirely',
  ];
  
  distractors.push(...genericDistractors);
  
  // Add 3 distractors
  for (let i = 0; i < 3 && i < distractors.length; i++) {
    options.push(distractors[i]);
  }
  
  // Shuffle options but track correct answer index
  const correctIndex = 0;
  const incorrect = options.slice(1);
  // Shuffle incorrect options
  for (let i = incorrect.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [incorrect[i], incorrect[j]] = [incorrect[j], incorrect[i]];
  }
  
  // Randomly place correct answer
  const finalCorrectIndex = Math.floor(Math.random() * options.length);
  const finalOptions = [...incorrect];
  finalOptions.splice(finalCorrectIndex, 0, correctAnswer);
  
  return { options: finalOptions, correctIndex: finalCorrectIndex };
}

/**
 * Generate assignments from exercises
 */
function generateAssignmentsFromExercises(exercises: any[] | undefined): Array<{ title: string; description: string; tasks: string[] }> | undefined {
  if (!exercises || exercises.length === 0) {
    return undefined;
  }
  
  const assignments: Array<{ title: string; description: string; tasks: string[] }> = [];
  
  exercises.forEach((exercise) => {
    if (!exercise || typeof exercise !== 'object') return;
    
    const title = exercise.title || 'Practice Exercise';
    const description = exercise.instructions || exercise.example_answer || 'Complete this exercise to reinforce your learning.';
    
    // Convert instructions into tasks
    const tasks: string[] = [];
    if (exercise.instructions) {
      // Split instructions by "Step", "Paso" (Spanish), or numbered items
      const steps = exercise.instructions.split(/(?:Step \d+:|Paso \d+:|^\d+\.)/).filter(s => s.trim());
      if (steps.length > 0) {
        tasks.push(...steps.map(s => s.trim()).filter(s => s.length > 0));
      } else {
        // If no steps, use the whole instruction as a task
        tasks.push(exercise.instructions);
      }
    } else {
      // Detect if Spanish
      const isSpanish = title.toLowerCase().includes('practica') || title.toLowerCase().includes('aprende');
      if (isSpanish) {
        tasks.push('Revisa el contenido de la lección / Review the lesson content');
        tasks.push('Aplica los conceptos aprendidos / Apply the concepts learned');
        tasks.push('Completa el ejercicio / Complete the exercise');
      } else {
        tasks.push('Review the lesson content');
        tasks.push('Apply the concepts learned');
        tasks.push('Complete the exercise');
      }
    }
    
    if (tasks.length > 0) {
      assignments.push({
        title,
        description,
        tasks: tasks.slice(0, 5) // Limit to 5 tasks per assignment
      });
    }
  });
  
  return assignments.length > 0 ? assignments : undefined;
}

// ===== CYBERSECURITY LESSONS =====
function generateCybersecurityLessons(courseTitle: string, level: string): GeneratedLesson[] {
  try {
    // Map level names
    const levelMap: Record<string, string> = {
      'junior': 'basic',
      'secondary': 'intermediate',
      'advanced': 'advanced'
    };
    
    const curriculumLevel = levelMap[level.toLowerCase()] || level.toLowerCase();
    const curriculumPath = path.join(process.cwd(), 'curriculum', 'cybersecurity', `${curriculumLevel}.json`);
    
    // Check if curriculum file exists
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Cybersecurity curriculum not found for level: ${curriculumLevel}, using generic lessons`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Read and parse curriculum file
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    if (!curriculumData.topics || !Array.isArray(curriculumData.topics)) {
      console.log(`⚠️  Invalid curriculum format for level: ${curriculumLevel}`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Convert curriculum topics to lessons (same logic as Cloud Computing)
    return curriculumData.topics.map((topic: any, index: number) => {
      // Build content from key points, examples, and exercises
      let content = topic.description || '';
      
      if (topic.key_points && Array.isArray(topic.key_points)) {
        content += '\n\n### Key Points:\n';
        topic.key_points.forEach((kp: any) => {
          if (typeof kp === 'object' && kp.title && kp.content) {
            content += `\n**${kp.title}**\n${kp.content}\n`;
          } else if (typeof kp === 'string') {
            content += `\n- ${kp}\n`;
          }
        });
      }
      
      if (topic.examples && Array.isArray(topic.examples)) {
        content += '\n\n### Examples:\n';
        topic.examples.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.scenario && ex.explanation) {
            content += `\n**${ex.scenario}:**\n${ex.explanation}\n`;
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.exercises && Array.isArray(topic.exercises)) {
        content += '\n\n### Exercises:\n';
        topic.exercises.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.title && ex.instructions) {
            content += `\n**${ex.title}**\n${ex.instructions}\n`;
            if (ex.example_answer) {
              content += `\n*Example Answer:* ${ex.example_answer}\n`;
            }
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.instructional_materials && Array.isArray(topic.instructional_materials)) {
        content += '\n\n### Instructional Materials:\n';
        topic.instructional_materials.forEach((mat: any) => {
          if (typeof mat === 'object' && mat.type && mat.title) {
            content += `\n**${mat.type}: ${mat.title}**\n${mat.content || ''}\n`;
          }
        });
      }
      
      if (topic.summary) {
        content += `\n\n### Summary:\n${topic.summary}\n`;
      }
      
      // Build resources from textbooks and videos
      const resources: string[] = [];
      if (topic.textbooks && Array.isArray(topic.textbooks)) {
        topic.textbooks.forEach((tb: any) => {
          if (typeof tb === 'object' && tb.title) {
            const source = tb.source ? ` (${tb.source})` : '';
            const reason = tb.reason ? ` - ${tb.reason}` : '';
            resources.push(`Textbook: ${tb.title}${source}${reason}`);
          } else if (typeof tb === 'string') {
            resources.push(`Textbook: ${tb}`);
          }
        });
      }
      
      if (topic.videos && Array.isArray(topic.videos)) {
        topic.videos.forEach((vid: any) => {
          if (typeof vid === 'object' && vid.title) {
            const reason = vid.reason ? ` - ${vid.reason}` : '';
            resources.push(`Video: ${vid.title}${reason}`);
          } else if (typeof vid === 'string') {
            resources.push(`Video: ${vid}`);
          }
        });
      }
      
      // Generate quiz from exercises (convert first 2-3 exercises into quiz questions)
      const quiz = generateQuizFromExercises(topic.exercises, topic.key_points);
      
      // Generate assignments from exercises
      const assignments = generateAssignmentsFromExercises(topic.exercises);
      
      return {
        title: topic.topic || topic.title || `Cybersecurity Topic ${index + 1}`,
        description: topic.description || '',
        content: content,
        duration: 45 + (index * 5), // Progressive duration
        resources: resources.length > 0 ? resources : ['Cybersecurity Resources'],
        quiz: quiz,
        assignments: assignments,
      };
    });
  } catch (error: any) {
    console.error(`❌ Error generating Cybersecurity lessons: ${error.message}`);
    return generateGenericLessons(courseTitle, level);
  }
}

// ===== FULL STACK DEVELOPMENT LESSONS =====
function generateFullStackDevelopmentLessons(courseTitle: string, level: string): GeneratedLesson[] {
  try {
    // Map level names
    const levelMap: Record<string, string> = {
      'junior': 'basic',
      'secondary': 'intermediate',
      'advanced': 'advanced'
    };
    
    const curriculumLevel = levelMap[level.toLowerCase()] || level.toLowerCase();
    const curriculumPath = path.join(process.cwd(), 'curriculum', 'fullstackdevelopment', `${curriculumLevel}.json`);
    
    // Check if curriculum file exists
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Full Stack Development curriculum not found for level: ${curriculumLevel}, using generic lessons`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Read and parse curriculum file
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    if (!curriculumData.topics || !Array.isArray(curriculumData.topics)) {
      console.log(`⚠️  Invalid curriculum format for level: ${curriculumLevel}`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Convert curriculum topics to lessons
    return curriculumData.topics.map((topic: any, index: number) => {
      // Build content from key points, examples, and exercises
      let content = topic.description || '';
      
      if (topic.key_points && Array.isArray(topic.key_points)) {
        content += '\n\n### Key Points:\n';
        topic.key_points.forEach((kp: any) => {
          if (typeof kp === 'object' && kp.title && kp.content) {
            content += `\n**${kp.title}**\n${kp.content}\n`;
          } else if (typeof kp === 'string') {
            content += `\n- ${kp}\n`;
          }
        });
      }
      
      if (topic.examples && Array.isArray(topic.examples)) {
        content += '\n\n### Examples:\n';
        topic.examples.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.scenario && ex.explanation) {
            content += `\n**${ex.scenario}:**\n${ex.explanation}\n`;
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.exercises && Array.isArray(topic.exercises)) {
        content += '\n\n### Exercises:\n';
        topic.exercises.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.title && ex.instructions) {
            content += `\n**${ex.title}**\n${ex.instructions}\n`;
            if (ex.example_answer) {
              content += `\n*Example Answer:* ${ex.example_answer}\n`;
            }
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.instructional_materials && Array.isArray(topic.instructional_materials)) {
        content += '\n\n### Instructional Materials:\n';
        topic.instructional_materials.forEach((mat: any) => {
          if (typeof mat === 'object' && mat.type && mat.title) {
            content += `\n**${mat.type}: ${mat.title}**\n${mat.content || ''}\n`;
          }
        });
      }
      
      if (topic.summary) {
        content += `\n\n### Summary:\n${topic.summary}\n`;
      }
      
      // Build resources from textbooks and videos
      const resources: string[] = [];
      if (topic.textbooks && Array.isArray(topic.textbooks)) {
        topic.textbooks.forEach((tb: any) => {
          if (typeof tb === 'object' && tb.title) {
            const source = tb.source ? ` (${tb.source})` : '';
            const reason = tb.reason ? ` - ${tb.reason}` : '';
            resources.push(`Textbook: ${tb.title}${source}${reason}`);
          } else if (typeof tb === 'string') {
            resources.push(`Textbook: ${tb}`);
          }
        });
      }
      
      if (topic.videos && Array.isArray(topic.videos)) {
        topic.videos.forEach((vid: any) => {
          if (typeof vid === 'object' && vid.title) {
            const reason = vid.reason ? ` - ${vid.reason}` : '';
            resources.push(`Video: ${vid.title}${reason}`);
          } else if (typeof vid === 'string') {
            resources.push(`Video: ${vid}`);
          }
        });
      }
      
      // Generate quiz from exercises (convert first 2-3 exercises into quiz questions)
      const quiz = generateQuizFromExercises(topic.exercises, topic.key_points);
      
      // Generate assignments from exercises
      const assignments = generateAssignmentsFromExercises(topic.exercises);
      
      return {
        title: topic.topic || topic.title || `Full Stack Development Topic ${index + 1}`,
        description: topic.description || '',
        content: content,
        duration: 45 + (index * 5), // Progressive duration
        resources: resources.length > 0 ? resources : ['Full Stack Development Resources'],
        quiz: quiz,
        assignments: assignments,
      };
    });
  } catch (error: any) {
    console.error(`❌ Error generating Full Stack Development lessons: ${error.message}`);
    return generateGenericLessons(courseTitle, level);
  }
}

// ===== MOBILE DEVELOPMENT LESSONS =====
function generateMobileDevelopmentLessons(courseTitle: string, level: string): GeneratedLesson[] {
  try {
    const levelMap: Record<string, string> = {
      'junior': 'basic',
      'secondary': 'intermediate',
      'advanced': 'advanced'
    };
    
    const curriculumLevel = levelMap[level.toLowerCase()] || level.toLowerCase();
    const curriculumPath = path.join(process.cwd(), 'curriculum', 'mobiledevelopment', `${curriculumLevel}.json`);
    
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Mobile Development curriculum not found for level: ${curriculumLevel}, using generic lessons`);
      return generateGenericLessons(courseTitle, level);
    }
    
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    if (!curriculumData.topics || !Array.isArray(curriculumData.topics)) {
      console.log(`⚠️  Invalid curriculum format for level: ${curriculumLevel}`);
      return generateGenericLessons(courseTitle, level);
    }
    
    return curriculumData.topics.map((topic: any, index: number) => {
      let content = topic.description || '';
      
      if (topic.key_points && Array.isArray(topic.key_points)) {
        content += '\n\n### Key Points:\n';
        topic.key_points.forEach((kp: any) => {
          if (typeof kp === 'object' && kp.title && kp.content) {
            content += `\n**${kp.title}**\n${kp.content}\n`;
          } else if (typeof kp === 'string') {
            content += `\n- ${kp}\n`;
          }
        });
      }
      
      if (topic.examples && Array.isArray(topic.examples)) {
        content += '\n\n### Examples:\n';
        topic.examples.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.scenario && ex.explanation) {
            content += `\n**${ex.scenario}:**\n${ex.explanation}\n`;
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.exercises && Array.isArray(topic.exercises)) {
        content += '\n\n### Exercises:\n';
        topic.exercises.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.title && ex.instructions) {
            content += `\n**${ex.title}**\n${ex.instructions}\n`;
            if (ex.example_answer) {
              content += `\n*Example Answer:* ${ex.example_answer}\n`;
            }
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.instructional_materials && Array.isArray(topic.instructional_materials)) {
        content += '\n\n### Instructional Materials:\n';
        topic.instructional_materials.forEach((mat: any) => {
          if (typeof mat === 'object' && mat.type && mat.title) {
            content += `\n**${mat.type}: ${mat.title}**\n${mat.content || ''}\n`;
          }
        });
      }
      
      if (topic.summary) {
        content += `\n\n### Summary:\n${topic.summary}\n`;
      }
      
      const resources: string[] = [];
      if (topic.textbooks && Array.isArray(topic.textbooks)) {
        topic.textbooks.forEach((tb: any) => {
          if (typeof tb === 'object' && tb.title) {
            const source = tb.source ? ` (${tb.source})` : '';
            const reason = tb.reason ? ` - ${tb.reason}` : '';
            resources.push(`Textbook: ${tb.title}${source}${reason}`);
          } else if (typeof tb === 'string') {
            resources.push(`Textbook: ${tb}`);
          }
        });
      }
      
      if (topic.videos && Array.isArray(topic.videos)) {
        topic.videos.forEach((vid: any) => {
          if (typeof vid === 'object' && vid.title) {
            const reason = vid.reason ? ` - ${vid.reason}` : '';
            resources.push(`Video: ${vid.title}${reason}`);
          } else if (typeof vid === 'string') {
            resources.push(`Video: ${vid}`);
          }
        });
      }
      
      const quiz = generateQuizFromExercises(topic.exercises, topic.key_points);
      const assignments = generateAssignmentsFromExercises(topic.exercises);
      
      return {
        title: topic.topic || topic.title || `Mobile Development Topic ${index + 1}`,
        description: topic.description || '',
        content: content,
        duration: 45 + (index * 5),
        resources: resources.length > 0 ? resources : ['Mobile Development Resources'],
        quiz: quiz,
        assignments: assignments,
      };
    });
  } catch (error: any) {
    console.error(`❌ Error generating Mobile Development lessons: ${error.message}`);
    return generateGenericLessons(courseTitle, level);
  }
}

// ===== CLOUD COMPUTING LESSONS =====
function generateCloudComputingLessons(courseTitle: string, level: string): GeneratedLesson[] {
  try {
    // Map level names
    const levelMap: Record<string, string> = {
      'junior': 'basic',
      'secondary': 'intermediate',
      'advanced': 'advanced'
    };
    
    const curriculumLevel = levelMap[level.toLowerCase()] || level.toLowerCase();
    const curriculumPath = path.join(process.cwd(), 'curriculum', 'cloudcomputing', `${curriculumLevel}.json`);
    
    // Check if curriculum file exists
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Cloud Computing curriculum not found for level: ${curriculumLevel}, using generic lessons`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Read and parse curriculum file
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    
    if (!curriculumData.topics || !Array.isArray(curriculumData.topics)) {
      console.log(`⚠️  Invalid curriculum format for level: ${curriculumLevel}`);
      return generateGenericLessons(courseTitle, level);
    }
    
    // Convert curriculum topics to lessons
    return curriculumData.topics.map((topic: any, index: number) => {
      // Build content from key points, examples, and exercises
      let content = topic.description || '';
      
      if (topic.key_points && Array.isArray(topic.key_points)) {
        content += '\n\n### Key Points:\n';
        topic.key_points.forEach((kp: any) => {
          if (typeof kp === 'object' && kp.title && kp.content) {
            content += `\n**${kp.title}**\n${kp.content}\n`;
          } else if (typeof kp === 'string') {
            content += `\n- ${kp}\n`;
          }
        });
      }
      
      if (topic.examples && Array.isArray(topic.examples)) {
        content += '\n\n### Examples:\n';
        topic.examples.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.scenario && ex.explanation) {
            content += `\n**${ex.scenario}:**\n${ex.explanation}\n`;
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.exercises && Array.isArray(topic.exercises)) {
        content += '\n\n### Exercises:\n';
        topic.exercises.forEach((ex: any) => {
          if (typeof ex === 'object' && ex.title && ex.instructions) {
            content += `\n#### ${ex.title}\n${ex.instructions}\n`;
            if (ex.example_answer) {
              content += `\n**Example Answer:** ${ex.example_answer}\n`;
            }
          } else if (typeof ex === 'string') {
            content += `\n- ${ex}\n`;
          }
        });
      }
      
      if (topic.instructional_materials && Array.isArray(topic.instructional_materials)) {
        content += '\n\n### Instructional Materials:\n';
        topic.instructional_materials.forEach((mat: any) => {
          if (mat.type && mat.title && mat.content) {
            content += `\n#### ${mat.type}: ${mat.title}\n${mat.content}\n`;
          }
        });
      }
      
      if (topic.summary) {
        content += `\n\n### Summary:\n${topic.summary}`;
      }
      
      // Build resources array
      const resources: string[] = [];
      
      if (topic.textbooks && Array.isArray(topic.textbooks)) {
        topic.textbooks.forEach((tb: any) => {
          if (tb.title && tb.source) {
            resources.push(`Textbook: ${tb.title} (${tb.source})${tb.reason ? ` - ${tb.reason}` : ''}`);
          }
        });
      }
      
      if (topic.videos && Array.isArray(topic.videos)) {
        topic.videos.forEach((vid: any) => {
          if (typeof vid === 'object' && vid.title) {
            resources.push(`Video: ${vid.title}${vid.reason ? ` - ${vid.reason}` : ''}`);
          } else if (typeof vid === 'string') {
            resources.push(`Video: ${vid}`);
          }
        });
      }
      
      // Generate quiz from exercises (convert first 2-3 exercises into quiz questions)
      const quiz = generateQuizFromExercises(topic.exercises, topic.key_points);
      
      // Generate assignments from exercises
      const assignments = generateAssignmentsFromExercises(topic.exercises);
      
      return {
        title: topic.topic || topic.title || `Cloud Computing Topic ${index + 1}`,
        description: topic.description || '',
        content: content,
        duration: 45 + (index * 5), // Progressive duration
        resources: resources.length > 0 ? resources : ['Cloud Computing Resources'],
        quiz: quiz,
        assignments: assignments,
      };
    });
  } catch (error) {
    console.error(`Error loading Cloud Computing curriculum: ${error}`);
    return generateGenericLessons(courseTitle, level);
  }
}

// ===== GENERIC LESSONS (Fallback) =====
function generateGenericLessons(courseTitle: string, level: string): GeneratedLesson[] {
  const lessonCount = level === 'junior' ? 8 : level === 'advanced' ? 12 : 10;
  const baseDuration = level === 'junior' ? 30 : level === 'advanced' ? 50 : 40;
  
  const lessons: GeneratedLesson[] = [];
  
  for (let i = 1; i <= lessonCount; i++) {
    lessons.push({
      title: `Lesson ${i}: ${courseTitle} - Part ${i}`,
      description: `Learn key concepts and skills for ${courseTitle} in this comprehensive lesson.`,
      content: `This lesson covers fundamental concepts and practical applications. You'll learn through examples, exercises, and hands-on activities designed to build your understanding progressively.`,
      duration: baseDuration + Math.floor(Math.random() * 20),
      resources: [
        `Lecture Notes - Lesson ${i}`,
        'Practice Exercises',
        'Additional Reading',
        'Quiz - Test Your Knowledge',
      ],
    });
  }
  
  return lessons;
}


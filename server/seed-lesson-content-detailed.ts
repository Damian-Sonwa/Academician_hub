/**
 * Seed all lessons with detailed, topic-specific content
 * Includes images, illustrations, and textbook references
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from './models/Lesson';
import Course from './models/Course';
import { getTopicVideo } from './get-topic-videos';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/evolve-hub';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env!');
  process.exit(1);
}

/**
 * Get topic-specific images based on lesson title and category
 * Returns only additional images (no main imageUrl)
 */
function getLessonImages(title: string, category: string): { images: string[] } {
  const titleLower = title.toLowerCase();
  const categoryLower = category.toLowerCase();

  // Default images
  const defaultImages = [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  ];

  // Web Development / CSS
  if (titleLower.includes('css') || titleLower.includes('styling')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      ],
    };
  }

  // HTML
  if (titleLower.includes('html') || titleLower.includes('markup')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
      ],
    };
  }

  // JavaScript
  if (titleLower.includes('javascript') || titleLower.includes('js') || titleLower.includes('script')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      ],
    };
  }

  // Python
  if (titleLower.includes('python') || (categoryLower === 'python')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      ],
    };
  }

  // Biology / Cells
  if (titleLower.includes('cell') || titleLower.includes('biology')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
        'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
      ],
    };
  }

  // Chemistry / Atoms
  if (titleLower.includes('atom') || titleLower.includes('molecule') || titleLower.includes('chemistry')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
      ],
    };
  }

  // Math / Equations
  if (titleLower.includes('equation') || titleLower.includes('formula') || titleLower.includes('math')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
      ],
    };
  }

  // Language Learning
  if (categoryLower === 'languages' || categoryLower === 'english') {
    return {
      images: [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      ],
    };
  }

  // Cybersecurity
  if (categoryLower === 'cybersecurity' || titleLower.includes('security') || titleLower.includes('cyber')) {
    return {
      images: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
      ],
    };
  }

  return {
    images: defaultImages,
  };
}

/**
 * Generate detailed, topic-specific content
 */
function generateDetailedContent(
  title: string,
  category: string,
  level: string,
  courseTitle: string,
  hasTextbook: boolean
): string {
  const titleLower = title.toLowerCase();
  const categoryLower = category.toLowerCase();
  const levelLower = level.toLowerCase();

  // CSS Specific Content
  if (titleLower.includes('css') || titleLower.includes('styling') || titleLower.includes('cascading')) {
    return `# ${title}

## What is CSS?

CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML documents. While HTML provides the structure of a webpage, CSS controls how that structure looks—colors, fonts, layouts, spacing, and visual effects.

![CSS Styling Example](https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80)

## Core Concepts

### Selectors
CSS selectors target HTML elements to apply styles. The most common types are:
- **Element selectors**: Target specific HTML tags (e.g., \`p\`, \`h1\`, \`div\`)
- **Class selectors**: Target elements with a specific class (e.g., \`.container\`)
- **ID selectors**: Target a unique element (e.g., \`#header\`)
- **Attribute selectors**: Target elements with specific attributes

### Properties and Values
Each CSS rule consists of a property and a value:
\`\`\`css
selector {
  property: value;
}
\`\`\`

For example:
\`\`\`css
h1 {
  color: blue;
  font-size: 24px;
  margin: 10px;
}
\`\`\`

### The Box Model
Every HTML element is a box with four areas:
1. **Content**: The actual content (text, images)
2. **Padding**: Space inside the element, around the content
3. **Border**: A line around the padding
4. **Margin**: Space outside the element, between elements

![Box Model](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80)

## Common CSS Properties

### Text Styling
- \`color\`: Sets text color
- \`font-family\`: Sets font type
- \`font-size\`: Sets text size
- \`font-weight\`: Sets text thickness (bold, normal)
- \`text-align\`: Aligns text (left, center, right, justify)
- \`line-height\`: Sets spacing between lines

### Layout Properties
- \`display\`: Controls how elements are displayed (block, inline, flex, grid)
- \`width\` and \`height\`: Set element dimensions
- \`margin\`: Space outside the element
- \`padding\`: Space inside the element
- \`position\`: Controls element positioning (static, relative, absolute, fixed)
- \`float\`: Allows elements to float left or right

### Colors and Backgrounds
- \`background-color\`: Sets background color
- \`background-image\`: Sets background image
- \`opacity\`: Sets transparency (0.0 to 1.0)

## CSS Units

- **px** (pixels): Fixed size units
- **%** (percentage): Relative to parent element
- **em**: Relative to font size of element
- **rem**: Relative to root element font size
- **vw/vh**: Viewport width/height units

## Practical Examples

### Example 1: Styling a Button
\`\`\`css
.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
\`\`\`

### Example 2: Creating a Flexbox Layout
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
\`\`\`

![CSS Layout](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80)

## Best Practices

1. **Use classes instead of IDs** for styling (IDs should be unique, classes reusable)
2. **Keep CSS organized** with comments and logical grouping
3. **Use external stylesheets** rather than inline styles
4. **Follow naming conventions** (BEM, OOCSS, or your team's standard)
5. **Use CSS variables** for colors and common values
6. **Optimize for performance** by avoiding overly specific selectors

## Responsive Design

CSS enables responsive design through:
- **Media queries**: Apply styles based on screen size
- **Flexbox**: Flexible layouts that adapt to screen size
- **Grid**: Two-dimensional layout system
- **Relative units**: Use rem, em, %, vw, vh instead of fixed pixels

## Browser Compatibility

Different browsers may interpret CSS slightly differently. Always test your styles in multiple browsers. Use CSS prefixes when necessary for older browser support.

## Next Steps

Practice by styling HTML elements you create. Experiment with different properties and values to see their effects. Build small projects to reinforce your learning.

${hasTextbook ? `## Further Learning

For comprehensive coverage of CSS concepts, advanced techniques, and best practices, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, additional examples, and exercises to deepen your understanding.` : ''}

## Summary

CSS is essential for creating visually appealing and well-structured web pages. Master the fundamentals of selectors, properties, and the box model, then explore advanced topics like Flexbox, Grid, and responsive design.`;
  }

  // HTML Content
  if (titleLower.includes('html') || titleLower.includes('markup') || titleLower.includes('hypertext')) {
    return `# ${title}

## Introduction to HTML

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structure and content of a webpage, defining elements like headings, paragraphs, links, images, and more.

![HTML Structure](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80)

## Basic HTML Structure

Every HTML document follows this basic structure:
\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <!-- Content goes here -->
  </body>
</html>
\`\`\`

### Document Structure
- **\`<!DOCTYPE html>\`**: Declares the document type
- **\`<html>\`**: Root element containing all content
- **\`<head>\`**: Contains metadata (title, links, scripts)
- **\`<body>\`**: Contains visible content

## Common HTML Elements

### Text Elements
- **\`<h1>\` to \`<h6>\`**: Headings (h1 is largest, h6 is smallest)
- **\`<p>\`**: Paragraphs
- **\`<strong>\` or \`<b>\`**: Bold text
- **\`<em>\` or \`<i>\`**: Italic text
- **\`<br>\`**: Line break
- **\`<hr>\`**: Horizontal rule (divider)

### Links and Images
- **\`<a href="url">\`**: Creates hyperlinks
- **\`<img src="url" alt="description">\`**: Displays images

### Lists
- **\`<ul>\`**: Unordered list (bullets)
- **\`<ol>\`**: Ordered list (numbers)
- **\`<li>\`**: List item

### Structural Elements
- **\`<div>\`**: Division/container (block-level)
- **\`<span>\`**: Inline container
- **\`<header>\`**: Header section
- **\`<nav>\`**: Navigation section
- **\`<main>\`**: Main content
- **\`<section>\`**: Section of content
- **\`<article>\`**: Independent content
- **\`<footer>\`**: Footer section

![HTML Elements](https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80)

## HTML Attributes

Attributes provide additional information about elements:
- **\`id\`**: Unique identifier
- **\`class\`**: Class name for styling
- **\`src\`**: Source URL (for images, scripts)
- **\`href\`**: Hyperlink reference
- **\`alt\`**: Alternative text (for images)
- **\`title\`**: Tooltip text

Example:
\`\`\`html
<img src="photo.jpg" alt="Description" class="photo" id="main-photo">
\`\`\`

## Semantic HTML

Semantic HTML uses meaningful tags that describe content:
- **\`<header>\`**: Page or section header
- **\`<nav>\`**: Navigation menu
- **\`<main>\`**: Main content area
- **\`<article>\`**: Standalone content
- **\`<section>\`**: Thematic grouping
- **\`<aside>\`**: Sidebar content
- **\`<footer>\`**: Page or section footer

Benefits:
- Better accessibility
- Improved SEO
- Easier maintenance
- Clearer code structure

## Forms

HTML forms collect user input:
\`\`\`html
<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Submit</button>
</form>
\`\`\`

Common input types:
- \`text\`: Text input
- \`email\`: Email input
- \`password\`: Password input
- \`checkbox\`: Checkbox
- \`radio\`: Radio button
- \`submit\`: Submit button

## Best Practices

1. **Use semantic HTML** for better structure
2. **Always include alt text** for images
3. **Validate your HTML** using validators
4. **Use proper indentation** for readability
5. **Close all tags** properly
6. **Use lowercase** for tags and attributes
7. **Quote attribute values**

## HTML5 Features

Modern HTML5 includes:
- New semantic elements
- Form input types (email, date, number)
- Audio and video elements
- Canvas for graphics
- Local storage APIs

${hasTextbook ? `## Further Learning

For comprehensive HTML documentation, advanced techniques, and complete reference guides, refer to the **course textbook** available in the course header. The textbook provides detailed explanations of all HTML elements, attributes, and best practices.` : ''}

## Summary

HTML provides the foundation for all web pages. Master the basic structure, common elements, and semantic HTML to create well-structured, accessible web content.`;
  }

  // JavaScript Content
  if (titleLower.includes('javascript') || titleLower.includes('js') || titleLower.includes('script')) {
    return `# ${title}

## Introduction to JavaScript

JavaScript is a programming language that adds interactivity and dynamic behavior to web pages. It's one of the core technologies of the web, alongside HTML and CSS.

![JavaScript Code](https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80)

## What JavaScript Does

- **Manipulates HTML**: Changes content, styles, and structure
- **Handles Events**: Responds to user actions (clicks, form submissions)
- **Validates Data**: Checks form input before submission
- **Creates Animations**: Makes pages dynamic and interactive
- **Communicates with Servers**: Fetches and sends data (AJAX, Fetch API)

## Basic Syntax

### Variables
\`\`\`javascript
let name = "John";
const age = 25;
var city = "New York";
\`\`\`

- **\`let\`**: Block-scoped, can be reassigned
- **\`const\`**: Block-scoped, cannot be reassigned
- **\`var\`**: Function-scoped (older syntax)

### Data Types
- **String**: Text (\`"Hello"\`)
- **Number**: Numbers (\`42\`, \`3.14\`)
- **Boolean**: True/false (\`true\`, \`false\`)
- **Array**: List of values (\`[1, 2, 3]\`)
- **Object**: Key-value pairs (\`{name: "John"}\`)
- **null** and **undefined**: Special values

### Functions
\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}

// Arrow function
const greet = (name) => {
  return "Hello, " + name;
};
\`\`\`

## DOM Manipulation

The Document Object Model (DOM) represents the HTML structure. JavaScript can:
- **Select elements**: \`document.getElementById()\`, \`document.querySelector()\`
- **Change content**: \`element.textContent\`, \`element.innerHTML\`
- **Modify styles**: \`element.style.property = value\`
- **Add/remove elements**: \`createElement()\`, \`appendChild()\`, \`remove()\`

Example:
\`\`\`javascript
const button = document.querySelector('button');
button.addEventListener('click', () => {
  alert('Button clicked!');
});
\`\`\`

![JavaScript DOM](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80)

## Control Structures

### Conditionals
\`\`\`javascript
if (age >= 18) {
  console.log("Adult");
} else {
  console.log("Minor");
}
\`\`\`

### Loops
\`\`\`javascript
// For loop
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// Array forEach
array.forEach(item => {
  console.log(item);
});
\`\`\`

## Arrays and Objects

### Arrays
\`\`\`javascript
const fruits = ['apple', 'banana', 'orange'];
fruits.push('grape'); // Add item
fruits.length; // Get length
\`\`\`

### Objects
\`\`\`javascript
const person = {
  name: 'John',
  age: 30,
  greet: function() {
    return 'Hello, ' + this.name;
  }
};
\`\`\`

## Event Handling

JavaScript responds to user interactions:
\`\`\`javascript
element.addEventListener('click', function() {
  // Handle click
});

element.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  // Handle form
});
\`\`\`

Common events: \`click\`, \`submit\`, \`change\`, \`keypress\`, \`load\`

## Modern JavaScript (ES6+)

### Arrow Functions
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

### Template Literals
\`\`\`javascript
const message = \`Hello, \${name}!\`;
\`\`\`

### Destructuring
\`\`\`javascript
const {name, age} = person;
const [first, second] = array;
\`\`\`

### Promises and Async/Await
\`\`\`javascript
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
\`\`\`

${hasTextbook ? `## Further Learning

For comprehensive JavaScript coverage, including advanced concepts, frameworks, and best practices, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, code examples, and exercises.` : ''}

## Summary

JavaScript brings web pages to life with interactivity and dynamic behavior. Master variables, functions, DOM manipulation, and event handling to create engaging user experiences.`;
  }

  // Python Content
  if (titleLower.includes('python') || categoryLower === 'python') {
    return `# ${title}

## Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, automation, and more.

![Python Programming](https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80)

## Why Python?

- **Easy to Learn**: Simple, readable syntax
- **Versatile**: Used in many fields (web, data science, AI, automation)
- **Large Community**: Extensive libraries and support
- **Powerful**: Handles complex tasks with simple code

## Basic Syntax

### Variables
\`\`\`python
name = "John"
age = 25
height = 5.9
is_student = True
\`\`\`

Python is dynamically typed—no need to declare variable types.

### Data Types
- **str**: Strings (\`"Hello"\`)
- **int**: Integers (\`42\`)
- **float**: Decimals (\`3.14\`)
- **bool**: Boolean (\`True\`, \`False\`)
- **list**: Ordered collections (\`[1, 2, 3]\`)
- **dict**: Key-value pairs (\`{"name": "John"}\`)

### Functions
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

result = greet("John")
\`\`\`

## Control Flow

### Conditionals
\`\`\`python
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
\`\`\`

### Loops
\`\`\`python
# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Data Structures

### Lists
\`\`\`python
fruits = ['apple', 'banana', 'orange']
fruits.append('grape')
fruits[0]  # Access first item
\`\`\`

### Dictionaries
\`\`\`python
person = {
    'name': 'John',
    'age': 30
}
person['name']  # Access value
\`\`\`

## File Operations

\`\`\`python
# Read file
with open('file.txt', 'r') as f:
    content = f.read()

# Write file
with open('file.txt', 'w') as f:
    f.write('Hello, World!')
\`\`\`

${hasTextbook ? `## Further Learning

For comprehensive Python coverage, including advanced topics, libraries, and best practices, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, code examples, and projects.` : ''}

## Summary

Python's simplicity and power make it an excellent language for beginners and professionals. Master the basics of syntax, data types, functions, and control flow to start building Python applications.`;
  }

  // Biology / Cell Content
  if (titleLower.includes('cell') || (categoryLower === 'science' && titleLower.includes('biology'))) {
    return `# ${title}

## Introduction to Cell Structure

Cells are the fundamental units of life. All living organisms are composed of cells, which carry out the essential functions necessary for life.

![Cell Structure](https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80)

## Types of Cells

### Prokaryotic Cells
- **No nucleus**: DNA floats in cytoplasm
- **Simpler structure**: Fewer organelles
- **Examples**: Bacteria, Archaea
- **Size**: 0.1-5 micrometers

### Eukaryotic Cells
- **Has nucleus**: DNA enclosed in membrane
- **Complex structure**: Many organelles
- **Examples**: Animal cells, plant cells, fungi
- **Size**: 10-100 micrometers

![Microscope View](https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80)

## Cell Components

### Cell Membrane
- **Function**: Controls what enters/exits cell
- **Structure**: Phospholipid bilayer with proteins
- **Analogy**: Security guard of the cell

### Nucleus
- **Function**: Control center, stores DNA
- **Contains**: Chromosomes, nucleolus
- **Function**: Directs cell activities

### Mitochondria
- **Function**: Powerhouse—produces energy (ATP)
- **Structure**: Double membrane, inner folds (cristae)
- **Found in**: All eukaryotic cells

### Ribosomes
- **Function**: Protein synthesis
- **Location**: Free in cytoplasm or attached to ER
- **Found in**: All cells

### Endoplasmic Reticulum (ER)
- **Rough ER**: Has ribosomes, protein synthesis
- **Smooth ER**: Lipid synthesis, detoxification

### Golgi Apparatus
- **Function**: Processes and packages proteins
- **Structure**: Stacked membrane sacs

![Cell Organelles](https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80)

## Plant vs Animal Cells

### Plant Cells Have:
- **Cell wall**: Rigid structure (cellulose)
- **Chloroplasts**: Photosynthesis
- **Large vacuole**: Stores water and nutrients

### Animal Cells Have:
- **Centrioles**: Cell division
- **Lysosomes**: Digestive enzymes
- **Small vacuoles**: Storage

## Cell Functions

1. **Metabolism**: Chemical reactions for energy
2. **Growth**: Increase in size
3. **Reproduction**: Cell division
4. **Response**: React to environment
5. **Homeostasis**: Maintain internal balance

${hasTextbook ? `## Further Learning

For comprehensive coverage of cell biology, including detailed organelle functions, cellular processes, and advanced topics, refer to the **course textbook** available in the course header. The textbook provides in-depth explanations, diagrams, and study guides.` : ''}

## Summary

Understanding cell structure is fundamental to biology. Cells are complex structures with specialized organelles working together to maintain life.`;
  }

  // Chemistry / Atom Content
  if (titleLower.includes('atom') || titleLower.includes('molecule') || (categoryLower === 'science' && titleLower.includes('chemistry'))) {
    return `# ${title}

## Introduction to Atomic Structure

Atoms are the basic building blocks of matter. Understanding atomic structure is fundamental to chemistry and explains how elements combine to form compounds.

![Atomic Structure](https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80)

## Components of an Atom

### Nucleus
- **Protons**: Positively charged particles
- **Neutrons**: Neutral particles (no charge)
- **Mass**: Contains most of atom's mass
- **Size**: Very small compared to atom

### Electron Cloud
- **Electrons**: Negatively charged particles
- **Location**: Orbit around nucleus
- **Energy Levels**: Electrons exist in shells
- **Behavior**: Move rapidly in cloud

![Atom Model](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80)

## Atomic Number and Mass

### Atomic Number (Z)
- **Definition**: Number of protons
- **Determines**: Element identity
- **Example**: Carbon has 6 protons (atomic number 6)

### Mass Number (A)
- **Definition**: Protons + Neutrons
- **Varies**: Different isotopes have different mass numbers
- **Example**: Carbon-12 has 6 protons + 6 neutrons

## Electron Configuration

Electrons occupy energy levels (shells):
- **First shell**: Up to 2 electrons
- **Second shell**: Up to 8 electrons
- **Third shell**: Up to 8 electrons (for first 20 elements)

### Valence Electrons
- **Definition**: Electrons in outermost shell
- **Importance**: Determine chemical properties
- **Bonding**: Participate in chemical bonds

## Periodic Table Organization

- **Periods**: Horizontal rows (energy levels)
- **Groups**: Vertical columns (similar properties)
- **Trends**: Atomic size, electronegativity, ionization energy

${hasTextbook ? `## Further Learning

For comprehensive coverage of atomic structure, electron configuration, periodic trends, and chemical bonding, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, diagrams, and practice problems.` : ''}

## Summary

Atoms consist of protons, neutrons, and electrons. Understanding atomic structure explains element properties and chemical behavior.`;
  }

  // Math / Equations
  if (titleLower.includes('equation') || titleLower.includes('formula') || categoryLower === 'math' || categoryLower === 'mathematics') {
    return `# ${title}

## Introduction to Equations

Equations are mathematical statements showing that two expressions are equal. They're essential tools for solving problems and expressing relationships.

![Mathematical Equations](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80)

## Types of Equations

### Linear Equations
- **Form**: \`ax + b = c\`
- **Solution**: One value for x
- **Example**: \`2x + 3 = 11\` → \`x = 4\`

### Quadratic Equations
- **Form**: \`ax² + bx + c = 0\`
- **Solutions**: Up to 2 values
- **Methods**: Factoring, quadratic formula

### Systems of Equations
- **Multiple equations**: Solve simultaneously
- **Methods**: Substitution, elimination
- **Solution**: Values satisfying all equations

![Math Problem Solving](https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80)

## Solving Equations

### Steps:
1. **Simplify**: Combine like terms
2. **Isolate variable**: Use inverse operations
3. **Check**: Substitute solution back

### Example:
\`\`\`
3x + 5 = 14
3x = 14 - 5
3x = 9
x = 3
\`\`\`

## Applications

Equations model real-world situations:
- **Distance**: \`d = rt\` (distance = rate × time)
- **Area**: \`A = lw\` (area = length × width)
- **Profit**: \`P = R - C\` (profit = revenue - cost)

${hasTextbook ? `## Further Learning

For comprehensive coverage of equations, formulas, and problem-solving techniques, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, worked examples, and practice problems.` : ''}

## Summary

Equations express relationships and enable problem-solving. Master the techniques for solving different types of equations to apply mathematics to real-world situations.`;
  }

  // Default content for other topics
  return `# ${title}

## Introduction

This lesson provides comprehensive coverage of ${title.toLowerCase()}, building essential knowledge and skills in this important area.

![Learning Illustration](https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80)

## Core Concepts

The lesson covers fundamental principles and concepts essential for understanding ${title.toLowerCase()}. These concepts form the foundation for more advanced topics and practical applications.

## Key Learning Points

1. **Fundamental Understanding**: Grasp the basic principles
2. **Practical Application**: See how concepts apply in real situations
3. **Problem-Solving**: Develop skills to solve related problems
4. **Critical Thinking**: Analyze and evaluate information

![Study Materials](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80)

## Learning Approach

- **Read carefully**: Understand each concept before moving forward
- **Take notes**: Write down key points and examples
- **Practice actively**: Apply what you learn through exercises
- **Review regularly**: Reinforce learning through repetition

## Real-World Applications

The concepts in this lesson have practical applications in various contexts. Understanding these applications helps make abstract concepts more concrete and memorable.

${hasTextbook ? `## Further Learning

For comprehensive coverage, advanced topics, and additional resources, refer to the **course textbook** available in the course header. The textbook provides detailed explanations, examples, and exercises to deepen your understanding.` : ''}

## Summary

This lesson provides essential knowledge in ${title.toLowerCase()}. Continue practicing and reviewing to reinforce your learning and prepare for more advanced topics.`;
}

/**
 * Seed all lessons with detailed content
 */
async function seedAllLessonContent() {
  try {
    console.log('🌱 Starting detailed lesson content seeding...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all lessons
    const lessons = await Lesson.find({}).sort({ courseId: 1, order: 1 });
    console.log(`📚 Found ${lessons.length} lessons to process\n`);

    let updated = 0;
    let skipped = 0;

    for (const lesson of lessons) {
      // Get course information
      const course = await Course.findById(lesson.courseId);
      
      if (!course) {
        console.log(`⚠️  Skipping lesson "${lesson.title}" - course not found`);
        skipped++;
        continue;
      }

      // Generate detailed content
      const hasTextbook = !!(course.textbookUrl);
      const detailedContent = generateDetailedContent(
        lesson.title,
        course.category,
        course.level,
        course.title,
        hasTextbook
      );

      // Get images (but we'll remove main imageUrl, keep only content images)
      const { images } = getLessonImages(lesson.title, course.category);

      // Get topic-specific video
      const topicVideo = getTopicVideo(lesson.title, course.category);

      // Update lesson
      lesson.content = detailedContent;
      // Remove main imageUrl - only keep images in content
      lesson.imageUrl = undefined;
      // Keep additional images for content display (only if empty)
      if (!lesson.images || lesson.images.length === 0) {
        lesson.images = images;
      }
      // Set topic-specific video (always update to ensure topic-specific)
      if (topicVideo) {
        lesson.videoUrl = topicVideo;
      } else {
        // If no topic-specific video found, clear existing video to avoid generic ones
        lesson.videoUrl = undefined;
      }
      await lesson.save();

      console.log(`✅ Updated: "${lesson.title}" (${course.category} - ${course.level})`);
      updated++;
    }

    console.log('\n🎉 Content seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Lessons updated: ${updated}`);
    console.log(`   - Lessons skipped: ${skipped}`);
    console.log(`   - Total processed: ${lessons.length}`);

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedAllLessonContent();


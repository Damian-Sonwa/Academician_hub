/**
 * Comprehensive Lesson Content Generator
 * Creates detailed, educational content with images and explanations for each lesson
 */

interface LessonContentData {
  summary: string;
  detailedContent: string;
  imageUrl: string;
  images: string[];
  keyPoints: string[];
  examples: string[];
}

// Biology Lesson Content
export const biologyLessonContent: Record<string, LessonContentData> = {
  'Introduction to Cell Structure': {
    summary: 'Cells are the basic building blocks of all living organisms. Understanding cell structure is fundamental to biology.',
    detailedContent: `
# Introduction to Cell Structure

## What is a Cell?

A cell is the smallest unit of life that can replicate independently. It's often called the "building block of life." Just like a brick is the basic unit of a house, a cell is the basic unit of all living organisms.

## Types of Cells

### 1. Prokaryotic Cells
- **No nucleus**: Genetic material floats freely in the cytoplasm
- **Simpler structure**: Fewer organelles
- **Examples**: Bacteria and Archaea
- **Size**: Typically 0.1-5 micrometers

### 2. Eukaryotic Cells
- **Has a nucleus**: DNA is enclosed in a membrane-bound nucleus
- **Complex structure**: Many specialized organelles
- **Examples**: Animal cells, plant cells, fungi, protists
- **Size**: Typically 10-100 micrometers

## Major Cell Components

### Cell Membrane (Plasma Membrane)
- **Function**: Controls what enters and exits the cell
- **Structure**: Made of phospholipids and proteins
- **Analogy**: Think of it as the cell's security guard

### Cytoplasm
- **Function**: Gel-like substance filling the cell
- **Contains**: Water, salts, and organic molecules
- **Purpose**: Where most cellular activities occur

### Nucleus (in eukaryotes)
- **Function**: Control center of the cell
- **Contains**: DNA (genetic material)
- **Analogy**: The cell's brain or command center

### Mitochondria
- **Function**: Powerhouse of the cell
- **Process**: Converts food into energy (ATP)
- **Found in**: All eukaryotic cells

### Ribosomes
- **Function**: Protein factories
- **Process**: Build proteins from amino acids
- **Found in**: All cells (prokaryotic and eukaryotic)

## Why Study Cells?

Understanding cells helps us:
- Understand how our bodies work
- Develop medicines and treatments
- Understand diseases at the molecular level
- Learn about evolution and life's diversity

## Real-World Applications

- **Medicine**: Understanding cancer (uncontrolled cell division)
- **Genetics**: How traits are passed down through DNA
- **Biotechnology**: Creating vaccines and antibiotics
    `,
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80', // Microscope
      'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80', // DNA
      'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&q=80', // Lab
    ],
    keyPoints: [
      'Cells are the basic units of life',
      'There are two main types: prokaryotic and eukaryotic',
      'Each cell part has a specific function',
      'Understanding cells is key to understanding biology',
    ],
    examples: [
      'Human body has about 37 trillion cells',
      'Red blood cells carry oxygen throughout your body',
      'Bacteria are single-celled prokaryotic organisms',
      'Plant cells have cell walls, animal cells don\'t',
    ],
  },

  'DNA and Genetics': {
    summary: 'DNA carries genetic information that determines all characteristics of living organisms. It\'s the blueprint of life.',
    detailedContent: `
# DNA and Genetics

## What is DNA?

DNA (Deoxyribonucleic Acid) is a molecule that carries genetic information. Think of it as an instruction manual that tells your body how to build and maintain itself.

## Structure of DNA

### The Double Helix
- **Shape**: Twisted ladder (double helix)
- **Discovered by**: Watson and Crick (1953)
- **Components**: Sugar, phosphate, and nitrogenous bases

### The Four Bases
1. **Adenine (A)** - Always pairs with Thymine
2. **Thymine (T)** - Always pairs with Adenine  
3. **Cytosine (C)** - Always pairs with Guanine
4. **Guanine (G)** - Always pairs with Cytosine

**Remember**: A-T and C-G (think: "AT" the "CG" store)

## From DNA to Traits

### The Flow of Information
1. **DNA** → Contains the instructions
2. **RNA** → Copies and carries the message
3. **Proteins** → Execute the instructions
4. **Traits** → Visible characteristics

This is called the **Central Dogma** of molecular biology.

## Genes and Chromosomes

### Genes
- **Definition**: Segments of DNA that code for traits
- **Function**: Instructions for making proteins
- **Number in humans**: About 20,000-25,000 genes

### Chromosomes
- **Structure**: Packaged DNA
- **Number in humans**: 46 (23 pairs)
- **Inheritance**: 23 from mom, 23 from dad

## Genetic Inheritance

### Dominant vs. Recessive
- **Dominant allele**: Only need one copy to show trait (represented by capital letter: A)
- **Recessive allele**: Need two copies to show trait (represented by lowercase letter: a)

### Example: Eye Color
- Brown eyes (B) are dominant
- Blue eyes (b) are recessive
- BB or Bb = Brown eyes
- bb = Blue eyes

## Genetic Variation

### Why Are We All Different?
1. **Sexual reproduction**: Mix of parents' genes
2. **Mutations**: Changes in DNA sequence
3. **Crossing over**: During meiosis, chromosomes exchange segments

## Applications of Genetics

### Medicine
- **Genetic testing**: Identify disease risk
- **Gene therapy**: Fix faulty genes
- **Personalized medicine**: Treatments based on your genes

### Agriculture
- **GMOs**: Genetically modified organisms for better crops
- **Selective breeding**: Choose desired traits

### Forensics
- **DNA fingerprinting**: Solve crimes
- **Paternity tests**: Determine biological relationships
    `,
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80', // DNA strand
      'https://images.unsplash.com/photo-1578496781379-7dcfb995293d?w=800&q=80', // Genetics lab
      'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&q=80', // Chromosomes
    ],
    keyPoints: [
      'DNA is made of four bases: A, T, C, G',
      'Genes are segments of DNA that code for traits',
      'We inherit 23 chromosomes from each parent',
      'Dominant alleles mask recessive alleles',
    ],
    examples: [
      'Identical twins have identical DNA',
      'Height is controlled by multiple genes',
      'Sickle cell anemia is caused by a single gene mutation',
      'Eye color can skip generations (recessive traits)',
    ],
  },

  'Photosynthesis': {
    summary: 'Photosynthesis is how plants convert sunlight, water, and carbon dioxide into food (glucose) and oxygen. It\'s the foundation of life on Earth.',
    detailedContent: `
# Photosynthesis: Nature's Solar Power

## What is Photosynthesis?

Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in glucose (sugar). It's literally how plants "eat"!

## The Equation

**6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂**

Translation:
- **Input**: 6 carbon dioxide + 6 water + sunlight
- **Output**: 1 glucose + 6 oxygen

## Where Does It Happen?

### Chloroplasts
- **Location**: Inside plant cells
- **Contains**: Chlorophyll (green pigment)
- **Function**: Captures light energy

### Chlorophyll
- **Color**: Green
- **Why plants look green**: Chlorophyll reflects green light and absorbs red and blue light
- **Location**: In thylakoid membranes

## Two Stages of Photosynthesis

### Stage 1: Light-Dependent Reactions (Light Reactions)
**Where**: Thylakoid membranes
**Needs**: Light, water
**Produces**: ATP, NADPH, and oxygen

**What Happens**:
1. Chlorophyll absorbs light energy
2. Water molecules split (H₂O → H⁺ + O)
3. Oxygen is released as waste
4. Energy is stored in ATP and NADPH

**Analogy**: Like charging a battery with solar panels

### Stage 2: Light-Independent Reactions (Calvin Cycle)
**Where**: Stroma of chloroplast
**Needs**: CO₂, ATP, NADPH
**Produces**: Glucose (sugar)

**What Happens**:
1. CO₂ enters from air
2. ATP and NADPH provide energy
3. CO₂ is converted into glucose
4. Plant uses glucose for energy and growth

**Analogy**: Like using the charged battery to power something

## Factors Affecting Photosynthesis

### 1. Light Intensity
- **More light** = More photosynthesis (up to a point)
- **Too much** = Can damage chloroplasts

### 2. Carbon Dioxide Concentration
- **More CO₂** = More photosynthesis
- **Limited CO₂** = Slower photosynthesis

### 3. Temperature
- **Optimal**: 25-35°C (77-95°F)
- **Too cold**: Enzymes work slowly
- **Too hot**: Enzymes denature

### 4. Water Availability
- **Essential** for light reactions
- **Drought** = Reduced photosynthesis

## Why is Photosynthesis Important?

### For Plants
- Creates food (glucose) for energy and growth
- Builds cellulose for cell walls
- Produces fruits, vegetables, and grains

### For Animals
- **Food chain**: All food comes from photosynthesis
- **Oxygen**: Plants produce the oxygen we breathe
- **Climate**: Removes CO₂ from atmosphere

### For Humans
- **Food**: Fruits, vegetables, grains
- **Oxygen**: 50% comes from ocean phytoplankton
- **Fuel**: Fossil fuels are ancient photosynthesis
- **Medicine**: Many drugs come from plants

## Fun Facts

- **One tree** produces enough oxygen for 2 people per year
- **Rainforests** produce 28% of world's oxygen
- **Ocean algae** produce more oxygen than all land plants combined
- **Fast plants** can complete photosynthesis in microseconds
    `,
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80', // Green plant
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', // Sunlight through leaves
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80', // Forest
    ],
    keyPoints: [
      'Photosynthesis converts light energy into chemical energy',
      'Occurs in chloroplasts using chlorophyll',
      'Two stages: light reactions and Calvin cycle',
      'Produces glucose and oxygen from CO₂ and water',
    ],
    examples: [
      'Trees provide oxygen for us to breathe',
      'Corn plants convert sunlight into corn kernels',
      'Algae in oceans produce massive amounts of oxygen',
      'Houseplants improve indoor air quality',
    ],
  },
};

// Math Lesson Content
export const mathLessonContent: Record<string, LessonContentData> = {
  'Introduction to Algebra': {
    summary: 'Algebra is the branch of mathematics that uses letters and symbols to represent numbers and quantities in formulas and equations.',
    detailedContent: `
# Introduction to Algebra

## What is Algebra?

Algebra is like a universal language for mathematics. Instead of working with just numbers, we use letters (variables) to represent unknown values. It's like solving puzzles where you need to find the missing pieces!

## Variables

### What is a Variable?
- **Definition**: A symbol (usually a letter) that represents an unknown number
- **Common variables**: x, y, z, a, b, c
- **Example**: In "x + 5 = 10", x is the variable we need to find

### Why Use Variables?
1. **Generalization**: Write formulas that work for any number
2. **Problem-solving**: Represent unknown quantities
3. **Patterns**: Describe relationships between numbers

## Basic Operations with Variables

### Addition and Subtraction
- **Like terms**: x + x = 2x
- **Unlike terms**: x + y cannot be simplified
- **Example**: 3x + 2x = 5x (combining like terms)

### Multiplication
- **Number × Variable**: 3 × x = 3x
- **Variable × Variable**: x × x = x²
- **Distributive property**: 2(x + 3) = 2x + 6

### Division
- **Variable ÷ Number**: x ÷ 2 = x/2 or ½x
- **Number ÷ Variable**: 6 ÷ x = 6/x

## Solving Equations

### What is an Equation?
- **Definition**: A mathematical statement that two expressions are equal
- **Example**: 2x + 5 = 15
- **Goal**: Find the value of the variable

### Steps to Solve Equations

**Example: 2x + 5 = 15**

1. **Isolate the variable term**
   - Subtract 5 from both sides
   - 2x + 5 - 5 = 15 - 5
   - 2x = 10

2. **Solve for the variable**
   - Divide both sides by 2
   - 2x ÷ 2 = 10 ÷ 2
   - x = 5

3. **Check your answer**
   - Substitute x = 5 back into original equation
   - 2(5) + 5 = 15
   - 10 + 5 = 15 ✓

## Real-World Applications

### Shopping
**Problem**: You have $50. A shirt costs $15, and you want to buy some books for $7 each. How many books can you buy?
**Equation**: 15 + 7x = 50
**Solution**: x = 5 books

### Distance and Speed
**Formula**: Distance = Speed × Time
**Problem**: If d = 60t, how long to travel 180 miles at 60 mph?
**Solution**: 180 = 60t → t = 3 hours

### Money and Interest
**Problem**: Savings account with simple interest
**Formula**: A = P(1 + rt)
Where: A = final amount, P = principal, r = rate, t = time

## Common Patterns

### Linear Patterns
- **Constant difference**: 2, 5, 8, 11, 14...
- **Formula**: y = 3x - 1

### Quadratic Patterns
- **Squared terms**: 1, 4, 9, 16, 25...
- **Formula**: y = x²

## Tips for Success

1. **Practice regularly**: Algebra is a skill that improves with practice
2. **Show your work**: Write every step clearly
3. **Check your answers**: Substitute back to verify
4. **Use real examples**: Connect to everyday situations
5. **Don't rush**: Take time to understand each concept
    `,
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80', // Math equations
      'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=800&q=80', // Algebra board
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', // Math formulas
    ],
    keyPoints: [
      'Variables represent unknown numbers',
      'Equations show relationships between numbers',
      'Solve by isolating the variable',
      'Always check your answer',
    ],
    examples: [
      'If x + 7 = 12, then x = 5',
      '2(x + 3) = 2x + 6 (distributive property)',
      'The area of a rectangle: A = length × width',
      'Simple interest: I = PRT',
    ],
  },
};

// Programming Lesson Content
export const programmingLessonContent: Record<string, LessonContentData> = {
  'Variables and Data Types': {
    summary: 'Variables are containers for storing data values. Understanding data types is fundamental to programming.',
    detailedContent: `
# Variables and Data Types in Python

## What is a Variable?

A variable is like a labeled box where you can store information. Just like you might have a box labeled "toys" or "books", in programming, we create variables to store different types of data.

## Creating Variables in Python

### Basic Syntax
\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

### Naming Rules
1. **Must start with** a letter or underscore (_)
2. **Cannot start with** a number
3. **Can contain** letters, numbers, and underscores
4. **Case-sensitive**: age and Age are different
5. **No spaces**: Use snake_case (like_this) or camelCase (likeThis)

**Good variable names:**
- user_name
- total_score
- is_valid

**Bad variable names:**
- 1st_name (starts with number)
- user name (has space)
- class (reserved keyword)

## Data Types

### 1. Strings (str)
**Definition**: Text data enclosed in quotes

\`\`\`python
# Single or double quotes work
name = "Alice"
greeting = 'Hello, World!'

# Multi-line strings use triple quotes
message = """This is a
multi-line
string"""

# String operations
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name  # "John Doe"
\`\`\`

### 2. Integers (int)
**Definition**: Whole numbers without decimal points

\`\`\`python
age = 25
score = 100
year = 2024

# Math operations
total = 10 + 5      # 15
difference = 10 - 5  # 5
product = 10 * 5     # 50
quotient = 10 / 5    # 2.0
\`\`\`

### 3. Floats (float)
**Definition**: Numbers with decimal points

\`\`\`python
height = 5.9
price = 19.99
pi = 3.14159

# Mixing int and float
result = 10 + 3.5  # 13.5 (automatically converts to float)
\`\`\`

### 4. Booleans (bool)
**Definition**: True or False values

\`\`\`python
is_student = True
has_passed = False

# Comparison operations return booleans
age = 25
is_adult = age >= 18  # True
is_senior = age >= 65  # False
\`\`\`

## Type Conversion

### Checking Types
\`\`\`python
age = 25
type(age)  # <class 'int'>

name = "Alice"
type(name)  # <class 'str'>
\`\`\`

### Converting Types
\`\`\`python
# String to Integer
age_str = "25"
age_int = int(age_str)  # 25

# Integer to String
score = 100
score_str = str(score)  # "100"

# String to Float
price_str = "19.99"
price_float = float(price_str)  # 19.99

# Float to Integer (truncates decimal)
height = 5.9
height_int = int(height)  # 5
\`\`\`

## String Operations

### Concatenation
\`\`\`python
first = "Hello"
second = "World"
result = first + " " + second  # "Hello World"
\`\`\`

### F-strings (Formatted Strings)
\`\`\`python
name = "Alice"
age = 25
message = f"My name is {name} and I am {age} years old."
# "My name is Alice and I am 25 years old."
\`\`\`

### String Methods
\`\`\`python
text = "Hello World"
text.upper()     # "HELLO WORLD"
text.lower()     # "hello world"
text.replace("World", "Python")  # "Hello Python"
len(text)        # 11 (length)
\`\`\`

## Practical Examples

### Example 1: Calculate Area
\`\`\`python
# Rectangle area calculator
length = 10
width = 5
area = length * width
print(f"The area is {area} square units")
# Output: The area is 50 square units
\`\`\`

### Example 2: User Information
\`\`\`python
# Store user data
username = "alice123"
email = "alice@example.com"
age = 25
is_verified = True

# Display user info
print(f"Username: {username}")
print(f"Email: {email}")
print(f"Age: {age}")
print(f"Verified: {is_verified}")
\`\`\`

### Example 3: Temperature Converter
\`\`\`python
# Celsius to Fahrenheit
celsius = 25
fahrenheit = (celsius * 9/5) + 32
print(f"{celsius}°C = {fahrenheit}°F")
# Output: 25°C = 77.0°F
\`\`\`

## Common Mistakes to Avoid

### 1. Forgetting Quotes for Strings
\`\`\`python
# Wrong
name = Alice  # Error!

# Correct
name = "Alice"
\`\`\`

### 2. Wrong Type Operations
\`\`\`python
# This won't work
age = "25"
next_age = age + 1  # Error! Can't add string and int

# Correct way
age = int("25")
next_age = age + 1  # 26
\`\`\`

### 3. Case Sensitivity
\`\`\`python
name = "Alice"
print(Name)  # Error! 'Name' is not defined
print(name)  # Correct
\`\`\`

## Best Practices

1. **Use descriptive names**: student_score instead of x
2. **Follow naming conventions**: Use snake_case in Python
3. **Initialize variables**: Always give variables a starting value
4. **Use appropriate types**: Don't store numbers as strings
5. **Comment your code**: Explain what variables represent

\`\`\`python
# Good example
student_name = "Alice"       # Student's full name
test_score = 95              # Test score out of 100
is_passing = test_score >= 60  # True if score is 60 or above
\`\`\`
    `,
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80', // Code on screen
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80', // Python code
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80', // Programming
    ],
    keyPoints: [
      'Variables store data values',
      'Python has main types: str, int, float, bool',
      'Type conversion changes data from one type to another',
      'Use descriptive variable names',
    ],
    examples: [
      'age = 25 (integer)',
      'name = "Alice" (string)',
      'height = 5.9 (float)',
      'is_student = True (boolean)',
    ],
  },
};

/**
 * Get comprehensive lesson content for a specific topic
 */
export function getLessonContent(category: string, lessonTitle: string): LessonContentData | null {
  const categoryLower = category.toLowerCase();
  
  // Try biology content
  if (categoryLower.includes('science') || categoryLower.includes('biology')) {
    return biologyLessonContent[lessonTitle] || null;
  }
  
  // Try math content
  if (categoryLower.includes('math')) {
    return mathLessonContent[lessonTitle] || null;
  }
  
  // Try programming content
  if (categoryLower.includes('python') || categoryLower.includes('programming')) {
    return programmingLessonContent[lessonTitle] || null;
  }
  
  return null;
}

/**
 * Get educational image for a subject/topic
 */
export function getEducationalImage(subject: string): string {
  const imageMap: Record<string, string> = {
    // Science
    'biology': 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    'chemistry': 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80',
    'physics': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    'cell': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80',
    'dna': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    'plant': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
    
    // Math
    'math': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
    'algebra': 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&q=80',
    'geometry': 'https://images.unsplash.com/photo-1509869175650-a1d97972541a?w=800&q=80',
    'calculus': 'https://images.unsplash.com/photo-1635372722656-389f87a941b7?w=800&q=80',
    
    // Programming
    'programming': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    'python': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
    'code': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    'webdev': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    
    // English/Literature
    'english': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    'literature': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    'writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80',
    'book': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    
    // History
    'history': 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=800&q=80',
    'ancient': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'modern': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    
    // Geography
    'geography': 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80',
    'earth': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'map': 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
  };
  
  const subjectLower = subject.toLowerCase();
  
  // Find matching key
  for (const [key, url] of Object.entries(imageMap)) {
    if (subjectLower.includes(key)) {
      return url;
    }
  }
  
  // Default educational image
  return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80';
}


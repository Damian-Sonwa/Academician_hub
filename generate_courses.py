#!/usr/bin/env python3
"""
Generate structured JSON course files for all courses
"""
import json
import os

# Course data structure
courses_data = {
    "french": {
        "beginner": [
            {
                "title": "French Alphabet and Pronunciation",
                "summary": "Learn the French alphabet and pronunciation rules. Master the 26 letters and special characters like é, è, ê, ç. Understand French pronunciation including silent letters and liaisons. Learn about accent marks and how they affect pronunciation. Practice pronouncing common French words and build confidence in speaking.",
                "materials": {
                    "videos": [
                        {"title": "French Alphabet - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "French Pronunciation Guide - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "French Alphabet Guide - Lawless French", "url": "https://www.lawlessfrench.com/pronunciation/alphabet/"},
                        {"title": "French Pronunciation Rules - French Today", "url": "https://www.frenchtoday.com/blog/french-pronunciation/"}
                    ],
                    "labs": [
                        {"title": "Alphabet Pronunciation Practice", "url": "https://www.languageguide.org/french/alphabet/"},
                        {"title": "Pronunciation Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            },
            {
                "title": "Greetings and Introductions",
                "summary": "Say hello and introduce yourself in French. Learn formal and informal greetings including bonjour, bonsoir, and salut. Master how to introduce yourself with je m'appelle and ask someone's name. Learn basic courtesy phrases like s'il vous plaît, merci, and de rien. Practice simple conversations for meeting new people.",
                "materials": {
                    "videos": [
                        {"title": "French Greetings - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "Introductions in French - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "French Greetings Guide - Lawless French", "url": "https://www.lawlessfrench.com/vocabulary/greetings/"},
                        {"title": "Basic French Phrases - French Today", "url": "https://www.frenchtoday.com/blog/french-vocabulary/"}
                    ],
                    "labs": [
                        {"title": "Greetings Practice", "url": "https://www.languageguide.org/french/vocabulary/greetings/"},
                        {"title": "Conversation Practice Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            },
            {
                "title": "Numbers and Time",
                "summary": "Count and tell time in French. Learn numbers 0-100 and how to form larger numbers. Master days of the week and months of the year. Learn how to tell time using il est and how to express dates. Practice using numbers in real-world contexts.",
                "materials": {
                    "videos": [
                        {"title": "French Numbers - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "Telling Time in French - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "French Numbers Guide - Lawless French", "url": "https://www.lawlessfrench.com/vocabulary/numbers/"},
                        {"title": "Dates and Time - French Today", "url": "https://www.frenchtoday.com/blog/french-vocabulary/dates/"}
                    ],
                    "labs": [
                        {"title": "Numbers Practice", "url": "https://www.languageguide.org/french/vocabulary/numbers/"},
                        {"title": "Time Telling Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            },
            {
                "title": "Present Tense Verbs",
                "summary": "Conjugate regular -er, -ir, and -re verbs in the present tense. Master present tense conjugation patterns for regular verbs. Learn common irregular verbs including être, avoir, aller, and faire. Understand when to use different verb forms. Practice using verbs in sentences and conversations.",
                "materials": {
                    "videos": [
                        {"title": "French Present Tense - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "Verb Conjugation - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "Present Tense Guide - Lawless French", "url": "https://www.lawlessfrench.com/grammar/present-tense/"},
                        {"title": "Verb Conjugation - French Today", "url": "https://www.frenchtoday.com/blog/french-grammar/"}
                    ],
                    "labs": [
                        {"title": "Verb Conjugation Practice", "url": "https://conjuguemos.com/verb/133"},
                        {"title": "Present Tense Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            },
            {
                "title": "Food and Dining",
                "summary": "Order food and discuss meals in French. Learn food vocabulary including fruits, vegetables, meats, and common dishes. Master restaurant phrases like l'addition, s'il vous plaît. Learn how to express preferences with j'aime and je n'aime pas. Practice ordering food in restaurants.",
                "materials": {
                    "videos": [
                        {"title": "Food Vocabulary - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "Ordering Food - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "Food Vocabulary - Lawless French", "url": "https://www.lawlessfrench.com/vocabulary/food/"},
                        {"title": "Restaurant Phrases - French Today", "url": "https://www.frenchtoday.com/blog/french-vocabulary/restaurant/"}
                    ],
                    "labs": [
                        {"title": "Food Vocabulary Practice", "url": "https://www.languageguide.org/french/vocabulary/food/"},
                        {"title": "Restaurant Dialogue Practice", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            }
        ],
        "intermediate": [
            {
                "title": "Past Tenses",
                "summary": "Master the passé composé and imparfait past tenses in French. Learn when to use passé composé (completed actions) vs imparfait (ongoing or habitual actions). Study irregular past participles and auxiliary verbs. Understand how to narrate past events and tell stories.",
                "materials": {
                    "videos": [
                        {"title": "Passé Composé vs Imparfait - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "Past Tenses - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "Passé Composé Guide - Lawless French", "url": "https://www.lawlessfrench.com/grammar/passe-compose/"},
                        {"title": "Imparfait Guide - French Today", "url": "https://www.frenchtoday.com/blog/french-grammar/imparfait/"}
                    ],
                    "labs": [
                        {"title": "Past Tense Conjugation Practice", "url": "https://conjuguemos.com/verb/133"},
                        {"title": "Past Tenses Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            },
            {
                "title": "Subjunctive Mood",
                "summary": "Learn the subjunctive mood and when to use it in French. Understand the difference between indicative and subjunctive moods. Study subjunctive triggers including expressions of emotion, doubt, and desire. Learn subjunctive conjugation patterns.",
                "materials": {
                    "videos": [
                        {"title": "Subjunctive Mood - Learn French with Alexa", "url": "https://youtu.be/5uuf9b0gE5U"},
                        {"title": "When to Use Subjunctive - FrenchPod101", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "Subjunctive Guide - Lawless French", "url": "https://www.lawlessfrench.com/grammar/subjunctive/"},
                        {"title": "Subjunctive Mood - French Today", "url": "https://www.frenchtoday.com/blog/french-grammar/subjunctive/"}
                    ],
                    "labs": [
                        {"title": "Subjunctive Practice", "url": "https://conjuguemos.com/verb/133"},
                        {"title": "Subjunctive Quiz", "url": "https://www.lawlessfrench.com/quizzes-and-tests/"}
                    ]
                }
            }
        ],
        "advanced": [
            {
                "title": "Advanced French Literature",
                "summary": "Explore French literature, analyze classic and contemporary texts, and refine your language mastery. Read works by famous French authors like Victor Hugo, Molière, and Albert Camus. Study literary devices, themes, and cultural contexts. Analyze poetry, plays, and novels in French.",
                "materials": {
                    "videos": [
                        {"title": "French Literature - MIT OpenCourseWare", "url": "https://ocw.mit.edu/courses/global-languages/"},
                        {"title": "Literary Analysis in French - Yale", "url": "https://youtu.be/5uuf9b0gE5U"}
                    ],
                    "textbooks": [
                        {"title": "French Literature Anthology - Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/search/?query=french+literature"},
                        {"title": "Literary Analysis Guide - Lawless French", "url": "https://www.lawlessfrench.com/literature/"}
                    ],
                    "labs": [
                        {"title": "Literature Discussion Forum", "url": "https://www.reddit.com/r/French/"},
                        {"title": "Literary Analysis Essay Practice", "url": "https://www.lawlessfrench.com/writing/"}
                    ]
                }
            }
        ]
    }
}

# Create directories and write files
base_dir = "seed/courses"
for course_name, levels in courses_data.items():
    course_dir = os.path.join(base_dir, course_name)
    os.makedirs(course_dir, exist_ok=True)
    
    for level_name, topics in levels.items():
        file_path = os.path.join(course_dir, f"{level_name}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(topics, f, indent=2, ensure_ascii=False)
        print(f"Created {file_path}")

print("Done!")




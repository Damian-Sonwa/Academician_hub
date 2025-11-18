/**
 * Comprehensive Greetings Content for Language Learning
 * Lesson 2: Greetings and Introductions for All Languages
 */

interface GreetingExample {
  phrase: string;
  pronunciation: string;
  english: string;
  context: string;
  formality: 'formal' | 'informal' | 'neutral';
}

interface GreetingCategory {
  category: string;
  description: string;
  greetings: GreetingExample[];
}

interface LanguageGreetings {
  language: string;
  langCode: string;
  overview: string;
  culturalNotes: string;
  mainImage: string;
  images: string[];
  categories: GreetingCategory[];
  commonResponses: {
    greeting: string;
    responses: string[];
  }[];
  practiceDialogues: {
    title: string;
    dialogue: { speaker: string; text: string; translation: string }[];
  }[];
}

export const languageGreetingsData: Record<string, LanguageGreetings> = {
  spanish: {
    language: 'Spanish',
    langCode: 'es-ES',
    overview: 'Spanish greetings vary based on time of day, formality, and regional differences. Learning proper greetings is essential for making a good first impression in Spanish-speaking cultures.',
    culturalNotes: 'In Spanish-speaking countries, greetings are often accompanied by physical gestures: handshakes (formal), kisses on the cheek (informal, usually between women or opposite genders), or hugs (close friends). Eye contact is important and shows respect.',
    mainImage: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582213782179-e0617885c0c3?w=800&q=80', // People greeting
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80', // Handshake
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', // Friends meeting
    ],
    categories: [
      {
        category: 'Basic Greetings',
        description: 'Essential everyday greetings used in all situations',
        greetings: [
          {
            phrase: 'Hola',
            pronunciation: 'OH-lah',
            english: 'Hello / Hi',
            context: 'Universal greeting, works anytime',
            formality: 'neutral',
          },
          {
            phrase: 'Buenos días',
            pronunciation: 'BWEH-nos DEE-as',
            english: 'Good morning',
            context: 'Used until noon',
            formality: 'neutral',
          },
          {
            phrase: 'Buenas tardes',
            pronunciation: 'BWEH-nas TAR-des',
            english: 'Good afternoon',
            context: 'Used from noon to sunset (around 6-8 PM)',
            formality: 'neutral',
          },
          {
            phrase: 'Buenas noches',
            pronunciation: 'BWEH-nas NO-ches',
            english: 'Good evening / Good night',
            context: 'Used after sunset',
            formality: 'neutral',
          },
        ],
      },
      {
        category: 'Formal Greetings',
        description: 'Professional or respectful greetings for formal situations',
        greetings: [
          {
            phrase: '¿Cómo está usted?',
            pronunciation: 'KOH-moh es-TAH oo-STED',
            english: 'How are you? (formal)',
            context: 'Business meetings, meeting elders, showing respect',
            formality: 'formal',
          },
          {
            phrase: 'Mucho gusto',
            pronunciation: 'MOO-cho GOO-stoh',
            english: 'Nice to meet you',
            context: 'First-time introductions',
            formality: 'formal',
          },
          {
            phrase: 'Es un placer conocerle',
            pronunciation: 'es oon plah-SEHR koh-noh-SAIR-leh',
            english: 'It\'s a pleasure to meet you',
            context: 'Very formal introductions',
            formality: 'formal',
          },
        ],
      },
      {
        category: 'Informal Greetings',
        description: 'Casual greetings for friends and peers',
        greetings: [
          {
            phrase: '¿Qué tal?',
            pronunciation: 'keh TAHL',
            english: 'What\'s up? / How\'s it going?',
            context: 'Friends, casual situations',
            formality: 'informal',
          },
          {
            phrase: '¿Cómo estás?',
            pronunciation: 'KOH-moh es-TAHS',
            english: 'How are you? (informal)',
            context: 'Friends, family, people your age',
            formality: 'informal',
          },
          {
            phrase: '¿Qué pasa?',
            pronunciation: 'keh PAH-sah',
            english: 'What\'s happening?',
            context: 'Very casual, among friends',
            formality: 'informal',
          },
          {
            phrase: '¿Qué onda?',
            pronunciation: 'keh ON-dah',
            english: 'What\'s up? (slang)',
            context: 'Mexico and Central America, very casual',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Farewells',
        description: 'Ways to say goodbye in Spanish',
        greetings: [
          {
            phrase: 'Adiós',
            pronunciation: 'ah-DYOHS',
            english: 'Goodbye',
            context: 'General farewell',
            formality: 'neutral',
          },
          {
            phrase: 'Hasta luego',
            pronunciation: 'AH-stah LWEH-goh',
            english: 'See you later',
            context: 'When you\'ll see them again soon',
            formality: 'neutral',
          },
          {
            phrase: 'Hasta mañana',
            pronunciation: 'AH-stah mah-NYAH-nah',
            english: 'See you tomorrow',
            context: 'When meeting again the next day',
            formality: 'neutral',
          },
          {
            phrase: 'Nos vemos',
            pronunciation: 'nohs VEH-mohs',
            english: 'See you',
            context: 'Casual farewell among friends',
            formality: 'informal',
          },
          {
            phrase: 'Chao',
            pronunciation: 'CHOW',
            english: 'Bye',
            context: 'Very casual, borrowed from Italian',
            formality: 'informal',
          },
        ],
      },
    ],
    commonResponses: [
      {
        greeting: '¿Cómo estás? (How are you?)',
        responses: [
          'Bien, gracias. ¿Y tú? (Good, thanks. And you?)',
          'Muy bien. (Very well.)',
          'Más o menos. (So-so.)',
          'Bien, ¿y usted? (Good, and you? - formal)',
        ],
      },
      {
        greeting: 'Mucho gusto (Nice to meet you)',
        responses: [
          'Igualmente (Likewise)',
          'El gusto es mío (The pleasure is mine)',
          'Encantado/Encantada (Delighted - m/f)',
        ],
      },
    ],
    practiceDialogues: [
      {
        title: 'Meeting Someone New (Formal)',
        dialogue: [
          {
            speaker: 'Person A',
            text: 'Buenos días. Me llamo Carlos.',
            translation: 'Good morning. My name is Carlos.',
          },
          {
            speaker: 'Person B',
            text: 'Mucho gusto, Carlos. Yo soy María.',
            translation: 'Nice to meet you, Carlos. I am María.',
          },
          {
            speaker: 'Person A',
            text: '¿Cómo está usted?',
            translation: 'How are you?',
          },
          {
            speaker: 'Person B',
            text: 'Muy bien, gracias. ¿Y usted?',
            translation: 'Very well, thank you. And you?',
          },
          {
            speaker: 'Person A',
            text: 'Bien, gracias.',
            translation: 'Good, thank you.',
          },
        ],
      },
      {
        title: 'Meeting a Friend (Informal)',
        dialogue: [
          {
            speaker: 'Friend 1',
            text: '¡Hola! ¿Qué tal?',
            translation: 'Hi! What\'s up?',
          },
          {
            speaker: 'Friend 2',
            text: 'Bien, ¿y tú?',
            translation: 'Good, and you?',
          },
          {
            speaker: 'Friend 1',
            text: 'Todo bien. ¿Vamos al café?',
            translation: 'All good. Shall we go to the café?',
          },
          {
            speaker: 'Friend 2',
            text: '¡Sí, vamos!',
            translation: 'Yes, let\'s go!',
          },
        ],
      },
    ],
  },

  french: {
    language: 'French',
    langCode: 'fr-FR',
    overview: 'French greetings are an essential part of daily interactions. The French place great importance on politeness and proper greetings, which vary depending on the time of day and level of formality.',
    culturalNotes: 'In France, greetings typically involve "la bise" (cheek kisses) among friends and family, or handshakes in professional settings. Always greet shopkeepers and service workers when entering establishments - it\'s considered polite!',
    mainImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=800&q=80',
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    ],
    categories: [
      {
        category: 'Basic Greetings',
        description: 'Essential French greetings for everyday use',
        greetings: [
          {
            phrase: 'Bonjour',
            pronunciation: 'bohn-ZHOOR',
            english: 'Hello / Good day',
            context: 'Standard greeting during the day',
            formality: 'neutral',
          },
          {
            phrase: 'Bonsoir',
            pronunciation: 'bohn-SWAHR',
            english: 'Good evening',
            context: 'Used after 6 PM',
            formality: 'neutral',
          },
          {
            phrase: 'Salut',
            pronunciation: 'sah-LU',
            english: 'Hi / Bye',
            context: 'Informal greeting among friends',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Formal Greetings',
        description: 'Professional and respectful French greetings',
        greetings: [
          {
            phrase: 'Comment allez-vous?',
            pronunciation: 'koh-mahn tah-lay-VOO',
            english: 'How are you? (formal)',
            context: 'Professional settings, showing respect',
            formality: 'formal',
          },
          {
            phrase: 'Enchanté / Enchantée',
            pronunciation: 'ahn-shahn-TAY',
            english: 'Nice to meet you (m/f)',
            context: 'First-time introductions',
            formality: 'formal',
          },
          {
            phrase: 'Ravi de vous rencontrer',
            pronunciation: 'rah-VEE duh voo rahn-kohn-TRAY',
            english: 'Pleased to meet you',
            context: 'Very formal meetings',
            formality: 'formal',
          },
        ],
      },
      {
        category: 'Informal Greetings',
        description: 'Casual greetings for friends and family',
        greetings: [
          {
            phrase: 'Ça va?',
            pronunciation: 'sah VAH',
            english: 'How\'s it going?',
            context: 'Friends, casual',
            formality: 'informal',
          },
          {
            phrase: 'Comment ça va?',
            pronunciation: 'koh-mahn sah VAH',
            english: 'How are you?',
            context: 'Informal but slightly more polite than "Ça va"',
            formality: 'informal',
          },
          {
            phrase: 'Quoi de neuf?',
            pronunciation: 'kwah duh NUHF',
            english: 'What\'s new?',
            context: 'Among friends',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Farewells',
        description: 'Ways to say goodbye in French',
        greetings: [
          {
            phrase: 'Au revoir',
            pronunciation: 'oh ruh-VWAHR',
            english: 'Goodbye',
            context: 'Standard farewell',
            formality: 'neutral',
          },
          {
            phrase: 'À bientôt',
            pronunciation: 'ah byahn-TOH',
            english: 'See you soon',
            context: 'When you\'ll meet again',
            formality: 'neutral',
          },
          {
            phrase: 'À demain',
            pronunciation: 'ah duh-MAN',
            english: 'See you tomorrow',
            context: 'Specific next meeting',
            formality: 'neutral',
          },
          {
            phrase: 'Bonne journée',
            pronunciation: 'bohn zhoor-NAY',
            english: 'Have a good day',
            context: 'Polite farewell during the day',
            formality: 'neutral',
          },
          {
            phrase: 'Bonne soirée',
            pronunciation: 'bohn swah-RAY',
            english: 'Have a good evening',
            context: 'Evening farewell',
            formality: 'neutral',
          },
        ],
      },
    ],
    commonResponses: [
      {
        greeting: 'Ça va? (How are you?)',
        responses: [
          'Ça va bien, merci. (I\'m well, thanks.)',
          'Ça va, et toi? (Fine, and you?)',
          'Très bien! (Very well!)',
          'Pas mal. (Not bad.)',
        ],
      },
      {
        greeting: 'Enchanté (Nice to meet you)',
        responses: [
          'Enchanté aussi (Nice to meet you too)',
          'Tout le plaisir est pour moi (The pleasure is all mine)',
        ],
      },
    ],
    practiceDialogues: [
      {
        title: 'At a Café (Formal)',
        dialogue: [
          {
            speaker: 'Customer',
            text: 'Bonjour madame.',
            translation: 'Good day, madam.',
          },
          {
            speaker: 'Server',
            text: 'Bonjour monsieur. Comment allez-vous?',
            translation: 'Good day, sir. How are you?',
          },
          {
            speaker: 'Customer',
            text: 'Très bien, merci. Et vous?',
            translation: 'Very well, thank you. And you?',
          },
          {
            speaker: 'Server',
            text: 'Ça va bien, merci.',
            translation: 'I\'m well, thank you.',
          },
        ],
      },
      {
        title: 'Meeting a Friend',
        dialogue: [
          {
            speaker: 'Friend 1',
            text: 'Salut! Ça va?',
            translation: 'Hi! How are you?',
          },
          {
            speaker: 'Friend 2',
            text: 'Ça va super! Et toi?',
            translation: 'I\'m great! And you?',
          },
          {
            speaker: 'Friend 1',
            text: 'Ça va bien, merci!',
            translation: 'I\'m good, thanks!',
          },
        ],
      },
    ],
  },

  german: {
    language: 'German',
    langCode: 'de-DE',
    overview: 'German greetings reflect the language\'s attention to formality and regional variation. Understanding when to use formal (Sie) versus informal (du) forms is crucial in German-speaking cultures.',
    culturalNotes: 'Germans value punctuality and direct communication. Handshakes are standard in both formal and informal settings. Eye contact during greetings shows confidence and respect. Regional variations exist - "Grüß Gott" in Bavaria, "Moin" in Northern Germany.',
    mainImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80',
      'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    ],
    categories: [
      {
        category: 'Basic Greetings',
        description: 'Essential German greetings',
        greetings: [
          {
            phrase: 'Guten Morgen',
            pronunciation: 'GOO-ten MOR-gen',
            english: 'Good morning',
            context: 'Until around 10-11 AM',
            formality: 'neutral',
          },
          {
            phrase: 'Guten Tag',
            pronunciation: 'GOO-ten TAHK',
            english: 'Good day / Hello',
            context: 'Standard daytime greeting',
            formality: 'neutral',
          },
          {
            phrase: 'Guten Abend',
            pronunciation: 'GOO-ten AH-bent',
            english: 'Good evening',
            context: 'After 6 PM',
            formality: 'neutral',
          },
          {
            phrase: 'Hallo',
            pronunciation: 'HAH-loh',
            english: 'Hello',
            context: 'Universal, slightly informal',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Formal Greetings',
        description: 'Professional German greetings using "Sie"',
        greetings: [
          {
            phrase: 'Wie geht es Ihnen?',
            pronunciation: 'vee GAYT es EE-nen',
            english: 'How are you? (formal)',
            context: 'Professional settings, showing respect',
            formality: 'formal',
          },
          {
            phrase: 'Freut mich, Sie kennenzulernen',
            pronunciation: 'FROYT mish, zee KEN-nen-tsoo-ler-nen',
            english: 'Pleased to meet you (formal)',
            context: 'First business meetings',
            formality: 'formal',
          },
          {
            phrase: 'Es freut mich, Sie zu sehen',
            pronunciation: 'es FROYT mish, zee tsoo ZAY-en',
            english: 'I\'m pleased to see you',
            context: 'Formal, polite greeting',
            formality: 'formal',
          },
        ],
      },
      {
        category: 'Informal Greetings',
        description: 'Casual greetings using "du"',
        greetings: [
          {
            phrase: 'Wie geht\'s?',
            pronunciation: 'vee GAYTS',
            english: 'How are you? (informal)',
            context: 'Friends, family',
            formality: 'informal',
          },
          {
            phrase: 'Was geht?',
            pronunciation: 'vahs GAYT',
            english: 'What\'s up?',
            context: 'Very casual, young people',
            formality: 'informal',
          },
          {
            phrase: 'Hey / Hi',
            pronunciation: 'HAY / HEE',
            english: 'Hey / Hi',
            context: 'Very informal, borrowed from English',
            formality: 'informal',
          },
          {
            phrase: 'Moin',
            pronunciation: 'moyn',
            english: 'Hi (Northern Germany)',
            context: 'Regional greeting, can be used all day',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Farewells',
        description: 'Ways to say goodbye in German',
        greetings: [
          {
            phrase: 'Auf Wiedersehen',
            pronunciation: 'owf VEE-der-zay-en',
            english: 'Goodbye (formal)',
            context: 'Standard formal farewell',
            formality: 'formal',
          },
          {
            phrase: 'Tschüss',
            pronunciation: 'CHEWS',
            english: 'Bye',
            context: 'Informal farewell',
            formality: 'informal',
          },
          {
            phrase: 'Bis bald',
            pronunciation: 'bis BALT',
            english: 'See you soon',
            context: 'When meeting again soon',
            formality: 'neutral',
          },
          {
            phrase: 'Bis morgen',
            pronunciation: 'bis MOR-gen',
            english: 'See you tomorrow',
            context: 'Specific next meeting',
            formality: 'neutral',
          },
          {
            phrase: 'Mach\'s gut',
            pronunciation: 'MAKHS goot',
            english: 'Take care',
            context: 'Informal, friendly',
            formality: 'informal',
          },
        ],
      },
    ],
    commonResponses: [
      {
        greeting: 'Wie geht es Ihnen? (How are you? - formal)',
        responses: [
          'Gut, danke. Und Ihnen? (Good, thanks. And you?)',
          'Sehr gut. (Very good.)',
          'Es geht. (It\'s okay.)',
        ],
      },
      {
        greeting: 'Wie geht\'s? (How are you? - informal)',
        responses: [
          'Gut, und dir? (Good, and you?)',
          'Prima! (Great!)',
          'Nicht schlecht. (Not bad.)',
        ],
      },
    ],
    practiceDialogues: [
      {
        title: 'Business Meeting (Formal)',
        dialogue: [
          {
            speaker: 'Person A',
            text: 'Guten Tag. Ich bin Herr Schmidt.',
            translation: 'Good day. I am Mr. Schmidt.',
          },
          {
            speaker: 'Person B',
            text: 'Guten Tag, Herr Schmidt. Freut mich, Sie kennenzulernen.',
            translation: 'Good day, Mr. Schmidt. Pleased to meet you.',
          },
          {
            speaker: 'Person A',
            text: 'Wie geht es Ihnen?',
            translation: 'How are you?',
          },
          {
            speaker: 'Person B',
            text: 'Sehr gut, danke. Und Ihnen?',
            translation: 'Very good, thank you. And you?',
          },
        ],
      },
      {
        title: 'Meeting Friends',
        dialogue: [
          {
            speaker: 'Friend 1',
            text: 'Hey! Wie geht\'s?',
            translation: 'Hey! How are you?',
          },
          {
            speaker: 'Friend 2',
            text: 'Prima! Und dir?',
            translation: 'Great! And you?',
          },
          {
            speaker: 'Friend 1',
            text: 'Auch gut!',
            translation: 'Also good!',
          },
        ],
      },
    ],
  },

  english: {
    language: 'English',
    langCode: 'en-US',
    overview: 'English greetings are relatively informal compared to many other languages. While formality still matters in professional settings, English speakers generally use the same pronouns (you) for both formal and informal situations.',
    culturalNotes: 'English-speaking cultures value friendly, approachable communication. Firm handshakes are standard in professional settings. Personal space (about an arm\'s length) is important. Smiling while greeting is common and shows friendliness.',
    mainImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582213782179-e0617885c0c3?w=800&q=80',
      'https://images.unsplash.com/photo-1556484687-30636164638b?w=800&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    ],
    categories: [
      {
        category: 'Basic Greetings',
        description: 'Common English greetings for everyday use',
        greetings: [
          {
            phrase: 'Hello',
            pronunciation: 'heh-LOH',
            english: 'Hello',
            context: 'Universal, polite greeting',
            formality: 'neutral',
          },
          {
            phrase: 'Good morning',
            pronunciation: 'good MOR-ning',
            english: 'Good morning',
            context: 'Until noon',
            formality: 'neutral',
          },
          {
            phrase: 'Good afternoon',
            pronunciation: 'good af-ter-NOON',
            english: 'Good afternoon',
            context: 'From noon to evening',
            formality: 'neutral',
          },
          {
            phrase: 'Good evening',
            pronunciation: 'good EEV-ning',
            english: 'Good evening',
            context: 'After 6 PM',
            formality: 'neutral',
          },
        ],
      },
      {
        category: 'Formal Greetings',
        description: 'Professional English greetings',
        greetings: [
          {
            phrase: 'How do you do?',
            pronunciation: 'how doo you DOO',
            english: 'How do you do?',
            context: 'Very formal, traditional',
            formality: 'formal',
          },
          {
            phrase: 'Pleased to meet you',
            pronunciation: 'pleezd to MEET you',
            english: 'Pleased to meet you',
            context: 'First business meetings',
            formality: 'formal',
          },
          {
            phrase: 'It\'s a pleasure to meet you',
            pronunciation: 'its a PLEH-zhur to meet you',
            english: 'It\'s a pleasure to meet you',
            context: 'Very formal introductions',
            formality: 'formal',
          },
        ],
      },
      {
        category: 'Informal Greetings',
        description: 'Casual greetings for friends and peers',
        greetings: [
          {
            phrase: 'Hi',
            pronunciation: 'HYE',
            english: 'Hi',
            context: 'Casual, friendly',
            formality: 'informal',
          },
          {
            phrase: 'Hey',
            pronunciation: 'HAY',
            english: 'Hey',
            context: 'Very casual',
            formality: 'informal',
          },
          {
            phrase: 'What\'s up?',
            pronunciation: 'whats UHP',
            english: 'What\'s up?',
            context: 'Informal greeting/question',
            formality: 'informal',
          },
          {
            phrase: 'How\'s it going?',
            pronunciation: 'hows it GO-ing',
            english: 'How\'s it going?',
            context: 'Casual check-in',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Farewells',
        description: 'Ways to say goodbye in English',
        greetings: [
          {
            phrase: 'Goodbye',
            pronunciation: 'good-BYE',
            english: 'Goodbye',
            context: 'Standard farewell',
            formality: 'neutral',
          },
          {
            phrase: 'Bye',
            pronunciation: 'BYE',
            english: 'Bye',
            context: 'Informal farewell',
            formality: 'informal',
          },
          {
            phrase: 'See you later',
            pronunciation: 'see you LAY-ter',
            english: 'See you later',
            context: 'When meeting again',
            formality: 'neutral',
          },
          {
            phrase: 'Take care',
            pronunciation: 'take CARE',
            english: 'Take care',
            context: 'Friendly farewell',
            formality: 'neutral',
          },
          {
            phrase: 'Have a nice day',
            pronunciation: 'have a nice DAY',
            english: 'Have a nice day',
            context: 'Polite farewell',
            formality: 'neutral',
          },
        ],
      },
    ],
    commonResponses: [
      {
        greeting: 'How are you?',
        responses: [
          'I\'m good, thanks. How are you?',
          'Fine, and you?',
          'Great! And yourself?',
          'Not bad, you?',
        ],
      },
      {
        greeting: 'Nice to meet you',
        responses: [
          'Nice to meet you too',
          'Likewise',
          'The pleasure is mine',
        ],
      },
    ],
    practiceDialogues: [
      {
        title: 'Business Introduction',
        dialogue: [
          {
            speaker: 'Person A',
            text: 'Good morning. I\'m Sarah Johnson.',
            translation: 'Good morning. I\'m Sarah Johnson.',
          },
          {
            speaker: 'Person B',
            text: 'Good morning, Sarah. Pleased to meet you. I\'m Michael Chen.',
            translation: 'Good morning, Sarah. Pleased to meet you. I\'m Michael Chen.',
          },
          {
            speaker: 'Person A',
            text: 'Nice to meet you, Michael. How are you today?',
            translation: 'Nice to meet you, Michael. How are you today?',
          },
          {
            speaker: 'Person B',
            text: 'I\'m well, thank you. And yourself?',
            translation: 'I\'m well, thank you. And yourself?',
          },
        ],
      },
      {
        title: 'Casual Meeting',
        dialogue: [
          {
            speaker: 'Friend 1',
            text: 'Hey! What\'s up?',
            translation: 'Hey! What\'s up?',
          },
          {
            speaker: 'Friend 2',
            text: 'Not much! How are you?',
            translation: 'Not much! How are you?',
          },
          {
            speaker: 'Friend 1',
            text: 'I\'m good, thanks!',
            translation: 'I\'m good, thanks!',
          },
        ],
      },
    ],
  },

  chinese: {
    language: 'Chinese (Mandarin)',
    langCode: 'zh-CN',
    overview: 'Chinese greetings emphasize respect for hierarchy and relationships. The concept of "face" (面子, miànzi) is important - showing proper respect in greetings maintains harmony and shows cultural awareness.',
    culturalNotes: 'Traditional Chinese culture values modesty in greetings. Slight bow or nod when greeting elders. Handshakes are common in business. Address people by their title + surname (e.g., 王老师 Wáng lǎoshī - Teacher Wang). Asking "Have you eaten?" is a common informal greeting.',
    mainImage: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
      'https://images.unsplash.com/photo-1583415788145-1da7a9bc7fc0?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    ],
    categories: [
      {
        category: 'Basic Greetings',
        description: 'Essential Mandarin Chinese greetings',
        greetings: [
          {
            phrase: '你好 (Nǐ hǎo)',
            pronunciation: 'nee HOW',
            english: 'Hello',
            context: 'Universal greeting',
            formality: 'neutral',
          },
          {
            phrase: '早上好 (Zǎoshang hǎo)',
            pronunciation: 'ZOW-shang HOW',
            english: 'Good morning',
            context: 'Morning greeting',
            formality: 'neutral',
          },
          {
            phrase: '下午好 (Xiàwǔ hǎo)',
            pronunciation: 'shya-WOO HOW',
            english: 'Good afternoon',
            context: 'Afternoon greeting',
            formality: 'neutral',
          },
          {
            phrase: '晚上好 (Wǎnshang hǎo)',
            pronunciation: 'WAHN-shang HOW',
            english: 'Good evening',
            context: 'Evening greeting',
            formality: 'neutral',
          },
        ],
      },
      {
        category: 'Formal Greetings',
        description: 'Respectful greetings showing proper etiquette',
        greetings: [
          {
            phrase: '您好 (Nín hǎo)',
            pronunciation: 'NEEN HOW',
            english: 'Hello (respectful)',
            context: 'Formal, showing respect to elders/superiors',
            formality: 'formal',
          },
          {
            phrase: '很高兴见到您 (Hěn gāoxìng jiàndào nín)',
            pronunciation: 'hun GOW-shing jyen-DOW NEEN',
            english: 'Very pleased to meet you',
            context: 'Formal first meeting',
            formality: 'formal',
          },
          {
            phrase: '久仰大名 (Jiǔyǎng dàmíng)',
            pronunciation: 'jyo-YAHNG dah-MING',
            english: 'I\'ve heard so much about you',
            context: 'Very respectful, formal introduction',
            formality: 'formal',
          },
        ],
      },
      {
        category: 'Informal Greetings',
        description: 'Casual greetings for friends and peers',
        greetings: [
          {
            phrase: '嗨 (Hāi)',
            pronunciation: 'HYE',
            english: 'Hi',
            context: 'Casual, borrowed from English',
            formality: 'informal',
          },
          {
            phrase: '吃了吗？(Chī le ma?)',
            pronunciation: 'chir luh MAH',
            english: 'Have you eaten?',
            context: 'Common informal greeting (like "how are you")',
            formality: 'informal',
          },
          {
            phrase: '最近怎么样？(Zuìjìn zěnmeyàng?)',
            pronunciation: 'zway-JEEN zun-muh-YAHNG',
            english: 'How have you been recently?',
            context: 'Friends you haven\'t seen in a while',
            formality: 'informal',
          },
        ],
      },
      {
        category: 'Farewells',
        description: 'Ways to say goodbye in Chinese',
        greetings: [
          {
            phrase: '再见 (Zàijiàn)',
            pronunciation: 'zye-JYEN',
            english: 'Goodbye',
            context: 'Standard farewell',
            formality: 'neutral',
          },
          {
            phrase: '拜拜 (Bàibài)',
            pronunciation: 'bye-BYE',
            english: 'Bye-bye',
            context: 'Informal, borrowed from English',
            formality: 'informal',
          },
          {
            phrase: '明天见 (Míngtiān jiàn)',
            pronunciation: 'ming-TYEN jyen',
            english: 'See you tomorrow',
            context: 'Specific next meeting',
            formality: 'neutral',
          },
          {
            phrase: '慢走 (Màn zǒu)',
            pronunciation: 'mahn ZOH',
            english: 'Take care / Walk slowly',
            context: 'Polite farewell when someone is leaving',
            formality: 'neutral',
          },
        ],
      },
    ],
    commonResponses: [
      {
        greeting: '你好 (Hello)',
        responses: [
          '你好 (Nǐ hǎo) - Hello',
          '你好吗？(Nǐ hǎo ma?) - How are you?',
        ],
      },
      {
        greeting: '吃了吗？(Have you eaten?)',
        responses: [
          '吃了，你呢？(Chī le, nǐ ne?) - Yes, and you?',
          '还没，一起吃吧 (Hái méi, yìqǐ chī ba) - Not yet, let\'s eat together',
        ],
      },
    ],
    practiceDialogues: [
      {
        title: 'Formal Meeting',
        dialogue: [
          {
            speaker: 'Person A',
            text: '您好，我是王明。',
            translation: 'Hello (respectful), I am Wang Ming.',
          },
          {
            speaker: 'Person B',
            text: '您好，王先生。很高兴见到您。',
            translation: 'Hello, Mr. Wang. Very pleased to meet you.',
          },
          {
            speaker: 'Person A',
            text: '我也很高兴见到您。',
            translation: 'I\'m also very pleased to meet you.',
          },
        ],
      },
      {
        title: 'Meeting a Friend',
        dialogue: [
          {
            speaker: 'Friend 1',
            text: '嗨！吃了吗？',
            translation: 'Hi! Have you eaten?',
          },
          {
            speaker: 'Friend 2',
            text: '吃了！你呢？',
            translation: 'Yes! And you?',
          },
          {
            speaker: 'Friend 1',
            text: '我也吃了。',
            translation: 'I\'ve eaten too.',
          },
        ],
      },
    ],
  },
};

export default languageGreetingsData;


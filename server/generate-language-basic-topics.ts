/**
 * Generate Basic level topic content files for all languages
 */

import fs from 'fs';
import path from 'path';

// Language-specific content templates
const languageContent: Record<string, any> = {
  spanish: {
    alphabet: "The Spanish alphabet has 27 letters (26 English letters plus 'ñ'). Each letter has consistent pronunciation. Vowels (a, e, i, o, u) are pure sounds. Consonants follow specific rules: 'c' before e/i sounds like 's', 'g' before e/i sounds like 'h', 'h' is silent, 'j' sounds like 'h', 'll' and 'y' sound like 'y' in 'yes', 'ñ' sounds like 'ny' in 'canyon'.",
    greetings: "Essential Spanish greetings: 'Hola' (Hello), 'Buenos días' (Good morning), 'Buenas tardes' (Good afternoon), 'Buenas noches' (Good evening/night), 'Adiós' (Goodbye), 'Hasta luego' (See you later), 'Gracias' (Thank you), 'De nada' (You're welcome), 'Por favor' (Please).",
    numbers: "Numbers 1-20 in Spanish: uno (1), dos (2), tres (3), cuatro (4), cinco (5), seis (6), siete (7), ocho (8), nueve (9), diez (10), once (11), doce (12), trece (13), catorce (14), quince (15), dieciséis (16), diecisiete (17), dieciocho (18), diecinueve (19), veinte (20).",
    colors: "Basic colors in Spanish: rojo (red), azul (blue), verde (green), amarillo (yellow), negro (black), blanco (white), gris (gray), marrón (brown), naranja (orange), rosa (pink).",
    bodyParts: "Basic body parts in Spanish: cabeza (head), mano (hand), pie (foot), brazo (arm), pierna (leg), ojo (eye), oreja (ear), nariz (nose), boca (mouth).",
    questions: "Simple question words in Spanish: ¿Qué? (What?), ¿Quién? (Who?), ¿Dónde? (Where?), ¿Cuándo? (When?), ¿Por qué? (Why?), ¿Cómo? (How?).",
    yesNo: "Yes and No in Spanish: 'Sí' (Yes), 'No' (No). Use 'Sí' to agree and 'No' to disagree or negate.",
    pleaseThankYou: "Polite expressions: 'Por favor' (Please), 'Gracias' (Thank you), 'De nada' (You're welcome), 'Con mucho gusto' (With pleasure).",
    days: "Days of the week in Spanish: lunes (Monday), martes (Tuesday), miércoles (Wednesday), jueves (Thursday), viernes (Friday), sábado (Saturday), domingo (Sunday).",
    months: "Months in Spanish: enero (January), febrero (February), marzo (March), abril (April), mayo (May), junio (June), julio (July), agosto (August), septiembre (September), octubre (October), noviembre (November), diciembre (December)."
  },
  french: {
    alphabet: "The French alphabet has 26 letters, but pronunciation differs from English. French uses accents: é, è, ê, ë, à, â, ç, î, ï, ô, ù, û, ü. Silent letters are common, especially at word endings. Key sounds: nasal vowels (an, en, in, on, un), 'r' is guttural, 'u' is different from English.",
    greetings: "Essential French greetings: 'Bonjour' (Hello/Good morning), 'Bonsoir' (Good evening), 'Bonne nuit' (Good night), 'Au revoir' (Goodbye), 'À bientôt' (See you soon), 'Merci' (Thank you), 'De rien' (You're welcome), 'S'il vous plaît' (Please).",
    numbers: "Numbers 1-20 in French: un (1), deux (2), trois (3), quatre (4), cinq (5), six (6), sept (7), huit (8), neuf (9), dix (10), onze (11), douze (12), treize (13), quatorze (14), quinze (15), seize (16), dix-sept (17), dix-huit (18), dix-neuf (19), vingt (20).",
    colors: "Basic colors in French: rouge (red), bleu (blue), vert (green), jaune (yellow), noir (black), blanc (white), gris (gray), marron (brown), orange (orange), rose (pink).",
    bodyParts: "Basic body parts in French: tête (head), main (hand), pied (foot), bras (arm), jambe (leg), œil (eye), oreille (ear), nez (nose), bouche (mouth).",
    questions: "Simple question words in French: Quoi? (What?), Qui? (Who?), Où? (Where?), Quand? (When?), Pourquoi? (Why?), Comment? (How?).",
    yesNo: "Yes and No in French: 'Oui' (Yes), 'Non' (No). Use 'Oui' to agree and 'Non' to disagree.",
    pleaseThankYou: "Polite expressions: 'S'il vous plaît' (Please), 'Merci' (Thank you), 'De rien' (You're welcome), 'Je vous en prie' (You're welcome - formal).",
    days: "Days of the week in French: lundi (Monday), mardi (Tuesday), mercredi (Wednesday), jeudi (Thursday), vendredi (Friday), samedi (Saturday), dimanche (Sunday).",
    months: "Months in French: janvier (January), février (February), mars (March), avril (April), mai (May), juin (June), juillet (July), août (August), septembre (September), octobre (October), novembre (November), décembre (December)."
  },
  german: {
    alphabet: "The German alphabet has 26 letters plus three umlauts: ä, ö, ü, and the ß (Eszett). German pronunciation is more consistent than English. Key sounds: 'ch' has two sounds (after a/o/u like 'k', after e/i like 'sh'), 'w' sounds like 'v', 'v' sounds like 'f', 'z' sounds like 'ts'.",
    greetings: "Essential German greetings: 'Guten Tag' (Good day), 'Guten Morgen' (Good morning), 'Guten Abend' (Good evening), 'Gute Nacht' (Good night), 'Auf Wiedersehen' (Goodbye), 'Tschüss' (Bye), 'Danke' (Thank you), 'Bitte' (Please/You're welcome).",
    numbers: "Numbers 1-20 in German: eins (1), zwei (2), drei (3), vier (4), fünf (5), sechs (6), sieben (7), acht (8), neun (9), zehn (10), elf (11), zwölf (12), dreizehn (13), vierzehn (14), fünfzehn (15), sechzehn (16), siebzehn (17), achtzehn (18), neunzehn (19), zwanzig (20).",
    colors: "Basic colors in German: rot (red), blau (blue), grün (green), gelb (yellow), schwarz (black), weiß (white), grau (gray), braun (brown), orange (orange), rosa (pink).",
    bodyParts: "Basic body parts in German: Kopf (head), Hand (hand), Fuß (foot), Arm (arm), Bein (leg), Auge (eye), Ohr (ear), Nase (nose), Mund (mouth).",
    questions: "Simple question words in German: Was? (What?), Wer? (Who?), Wo? (Where?), Wann? (When?), Warum? (Why?), Wie? (How?).",
    yesNo: "Yes and No in German: 'Ja' (Yes), 'Nein' (No). Use 'Ja' to agree and 'Nein' to disagree.",
    pleaseThankYou: "Polite expressions: 'Bitte' (Please/You're welcome), 'Danke' (Thank you), 'Gern geschehen' (You're welcome), 'Vielen Dank' (Thank you very much).",
    days: "Days of the week in German: Montag (Monday), Dienstag (Tuesday), Mittwoch (Wednesday), Donnerstag (Thursday), Freitag (Friday), Samstag (Saturday), Sonntag (Sunday).",
    months: "Months in German: Januar (January), Februar (February), März (March), April (April), Mai (May), Juni (June), Juli (July), August (August), September (September), Oktober (October), November (November), Dezember (December)."
  },
  italian: {
    alphabet: "The Italian alphabet has 21 letters (no j, k, w, x, y except in foreign words). Italian pronunciation is very consistent. Each letter has one sound. Double consonants are pronounced distinctly. Vowels are pure: a, e, i, o, u. 'c' before e/i sounds like 'ch', 'g' before e/i sounds like 'j'.",
    greetings: "Essential Italian greetings: 'Ciao' (Hello/Goodbye), 'Buongiorno' (Good morning), 'Buonasera' (Good evening), 'Buonanotte' (Good night), 'Arrivederci' (Goodbye), 'Grazie' (Thank you), 'Prego' (You're welcome/Please).",
    numbers: "Numbers 1-20 in Italian: uno (1), due (2), tre (3), quattro (4), cinque (5), sei (6), sette (7), otto (8), nove (9), dieci (10), undici (11), dodici (12), tredici (13), quattordici (14), quindici (15), sedici (16), diciassette (17), diciotto (18), diciannove (19), venti (20).",
    colors: "Basic colors in Italian: rosso (red), blu (blue), verde (green), giallo (yellow), nero (black), bianco (white), grigio (gray), marrone (brown), arancione (orange), rosa (pink).",
    bodyParts: "Basic body parts in Italian: testa (head), mano (hand), piede (foot), braccio (arm), gamba (leg), occhio (eye), orecchio (ear), naso (nose), bocca (mouth).",
    questions: "Simple question words in Italian: Cosa? (What?), Chi? (Who?), Dove? (Where?), Quando? (When?), Perché? (Why?), Come? (How?).",
    yesNo: "Yes and No in Italian: 'Sì' (Yes), 'No' (No). Use 'Sì' to agree and 'No' to disagree.",
    pleaseThankYou: "Polite expressions: 'Per favore' (Please), 'Grazie' (Thank you), 'Prego' (You're welcome), 'Grazie mille' (Thank you very much).",
    days: "Days of the week in Italian: lunedì (Monday), martedì (Tuesday), mercoledì (Wednesday), giovedì (Thursday), venerdì (Friday), sabato (Saturday), domenica (Sunday).",
    months: "Months in Italian: gennaio (January), febbraio (February), marzo (March), aprile (April), maggio (May), giugno (June), luglio (July), agosto (August), settembre (September), ottobre (October), novembre (November), dicembre (December)."
  },
  chinese: {
    alphabet: "Chinese doesn't use an alphabet but uses characters. However, Pinyin is the romanization system using the Latin alphabet to represent Chinese sounds. Pinyin has initials (consonants) and finals (vowels). Tones are crucial: first tone (flat), second tone (rising), third tone (falling-rising), fourth tone (falling).",
    greetings: "Essential Chinese greetings: 'Nǐ hǎo' (Hello), 'Zǎo shàng hǎo' (Good morning), 'Wǎn shàng hǎo' (Good evening), 'Zài jiàn' (Goodbye), 'Xiè xie' (Thank you), 'Bù kè qì' (You're welcome), 'Qǐng' (Please).",
    numbers: "Numbers 1-20 in Chinese: yī (1), èr (2), sān (3), sì (4), wǔ (5), liù (6), qī (7), bā (8), jiǔ (9), shí (10), shí yī (11), shí èr (12), shí sān (13), shí sì (14), shí wǔ (15), shí liù (16), shí qī (17), shí bā (18), shí jiǔ (19), èr shí (20).",
    colors: "Basic colors in Chinese: hóng sè (red), lán sè (blue), lǜ sè (green), huáng sè (yellow), hēi sè (black), bái sè (white), huī sè (gray), zōng sè (brown), chéng sè (orange), fěn sè (pink).",
    bodyParts: "Basic body parts in Chinese: tóu (head), shǒu (hand), jiǎo (foot), gē bo (arm), tuǐ (leg), yǎn jīng (eye), ěr duo (ear), bí zi (nose), zuǐ (mouth).",
    questions: "Simple question words in Chinese: Shén me? (What?), Shéi? (Who?), Nǎ lǐ? (Where?), Shén me shí hou? (When?), Wèi shén me? (Why?), Zěn me? (How?).",
    yesNo: "Yes and No in Chinese: 'Shì' (Yes), 'Bù' (No). Use 'Shì' to agree and 'Bù' to disagree.",
    pleaseThankYou: "Polite expressions: 'Qǐng' (Please), 'Xiè xie' (Thank you), 'Bù kè qì' (You're welcome), 'Bù yòng xiè' (Don't mention it).",
    days: "Days of the week in Chinese: Xīng qī yī (Monday), Xīng qī èr (Tuesday), Xīng qī sān (Wednesday), Xīng qī sì (Thursday), Xīng qī wǔ (Friday), Xīng qī liù (Saturday), Xīng qī rì (Sunday).",
    months: "Months in Chinese: yī yuè (January), èr yuè (February), sān yuè (March), sì yuè (April), wǔ yuè (May), liù yuè (June), qī yuè (July), bā yuè (August), jiǔ yuè (September), shí yuè (October), shí yī yuè (November), shí èr yuè (December)."
  },
  japanese: {
    alphabet: "Japanese uses three writing systems: Hiragana (46 characters for native words), Katakana (46 characters for foreign words), and Kanji (Chinese characters). Hiragana is the foundation. Each character represents a syllable. Basic sounds: a, i, u, e, o, ka, ki, ku, ke, ko, etc.",
    greetings: "Essential Japanese greetings: 'Konnichiwa' (Hello), 'Ohayou gozaimasu' (Good morning), 'Konbanwa' (Good evening), 'Sayounara' (Goodbye), 'Arigatou gozaimasu' (Thank you), 'Douitashimashite' (You're welcome), 'Onegaishimasu' (Please).",
    numbers: "Numbers 1-20 in Japanese: ichi (1), ni (2), san (3), yon/shi (4), go (5), roku (6), nana/shichi (7), hachi (8), kyuu/ku (9), juu (10), juu ichi (11), juu ni (12), juu san (13), juu yon (14), juu go (15), juu roku (16), juu nana (17), juu hachi (18), juu kyuu (19), ni juu (20).",
    colors: "Basic colors in Japanese: aka (red), ao (blue), midori (green), kiiro (yellow), kuro (black), shiro (white), hai iro (gray), cha iro (brown), orenji (orange), pinku (pink).",
    bodyParts: "Basic body parts in Japanese: atama (head), te (hand), ashi (foot), ude (arm), ashi (leg), me (eye), mimi (ear), hana (nose), kuchi (mouth).",
    questions: "Simple question words in Japanese: Nani? (What?), Dare? (Who?), Doko? (Where?), Itsu? (When?), Naze? (Why?), Dou? (How?).",
    yesNo: "Yes and No in Japanese: 'Hai' (Yes), 'Iie' (No). Use 'Hai' to agree and 'Iie' to disagree.",
    pleaseThankYou: "Polite expressions: 'Onegaishimasu' (Please), 'Arigatou gozaimasu' (Thank you), 'Douitashimashite' (You're welcome), 'Sumimasen' (Excuse me/Thank you).",
    days: "Days of the week in Japanese: Getsuyoubi (Monday), Kayoubi (Tuesday), Suiyoubi (Wednesday), Mokuyoubi (Thursday), Kinyoubi (Friday), Doyoubi (Saturday), Nichiyoubi (Sunday).",
    months: "Months in Japanese: ichi gatsu (January), ni gatsu (February), san gatsu (March), shi gatsu (April), go gatsu (May), roku gatsu (June), shichi gatsu (July), hachi gatsu (August), ku gatsu (September), juu gatsu (October), juu ichi gatsu (November), juu ni gatsu (December)."
  },
  arabic: {
    alphabet: "The Arabic alphabet has 28 letters, written from right to left. Each letter has different forms depending on position (beginning, middle, end, isolated). Arabic is a consonantal script - vowels are indicated by diacritical marks. Key sounds: 'kh' (like German 'ch'), 'gh' (guttural), 'q' (back of throat), 'ayn' (unique guttural sound).",
    greetings: "Essential Arabic greetings: 'As-salamu alaykum' (Peace be upon you), 'Ahlan' (Hello), 'Marhaban' (Welcome), 'Ma'a as-salama' (Goodbye), 'Shukran' (Thank you), 'Afwan' (You're welcome), 'Min fadlik' (Please).",
    numbers: "Numbers 1-20 in Arabic: wahid (1), ithnan (2), thalatha (3), arba'a (4), khamsa (5), sitta (6), sab'a (7), thamaniya (8), tis'a (9), 'ashara (10), ihda 'ashar (11), ithna 'ashar (12), thalatha 'ashar (13), arba'a 'ashar (14), khamsa 'ashar (15), sitta 'ashar (16), sab'a 'ashar (17), thamaniya 'ashar (18), tis'a 'ashar (19), 'ishrun (20).",
    colors: "Basic colors in Arabic: ahmar (red), azraq (blue), akhdar (green), asfar (yellow), aswad (black), abyad (white), ramadi (gray), bunni (brown), burtuqali (orange), wardiyy (pink).",
    bodyParts: "Basic body parts in Arabic: ra's (head), yad (hand), qadam (foot), dhir'a' (arm), saaq (leg), 'ayn (eye), udhun (ear), anf (nose), fam (mouth).",
    questions: "Simple question words in Arabic: Ma? (What?), Man? (Who?), Ayna? (Where?), Mata? (When?), Limadha? (Why?), Kayfa? (How?).",
    yesNo: "Yes and No in Arabic: 'Na'am' (Yes), 'La' (No). Use 'Na'am' to agree and 'La' to disagree.",
    pleaseThankYou: "Polite expressions: 'Min fadlik' (Please), 'Shukran' (Thank you), 'Afwan' (You're welcome), 'Al-'afw' (You're welcome - formal).",
    days: "Days of the week in Arabic: al-ithnayn (Monday), al-thulatha' (Tuesday), al-arba'a' (Wednesday), al-khamis (Thursday), al-jum'a (Friday), al-sabt (Saturday), al-ahad (Sunday).",
    months: "Months in Arabic: yanayir (January), fibrayir (February), maris (March), abril (April), mayu (May), yunyu (June), yulyu (July), aghustus (August), sibtambar (September), uktubar (October), nufimbir (November), disimbir (December)."
  }
};

// Topic mapping to content keys
const topicMapping: Record<string, string> = {
  'alphabet': 'alphabet',
  'greetings': 'greetings',
  'numbers': 'numbers',
  'colors': 'colors',
  'body parts': 'bodyParts',
  'questions': 'questions',
  'yes and no': 'yesNo',
  'please and thank you': 'pleaseThankYou',
  'days of the week': 'days',
  'months of the year': 'months'
};

function getContentForTopic(topic: string, language: string): string {
  const lang = language.toLowerCase();
  const topicLower = topic.toLowerCase();
  
  // Find matching content key
  for (const [key, value] of Object.entries(topicMapping)) {
    if (topicLower.includes(key)) {
      return languageContent[lang]?.[value] || `${topic} content for ${language}`;
    }
  }
  
  return `${topic} provides essential foundational knowledge for learning ${language}. This topic introduces basic vocabulary, pronunciation, and fundamental language concepts that form the building blocks for further language acquisition.`;
}

function generateBasicTopicFile(topic: string, language: string, topicNumber: number) {
  const lang = language.toLowerCase();
  const content = getContentForTopic(topic, language);
  
  // Get video IDs based on language
  const videoIds = {
    spanish: ['5MJbHmgaeDM', 'Uq3e0Qvd4rE', '5MJbHmgaeDM'],
    french: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
    german: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
    italian: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
    chinese: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
    japanese: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM'],
    arabic: ['5MJbHmgaeDM', '5MJbHmgaeDM', '5MJbHmgaeDM']
  };
  
  const channels = {
    spanish: ['Butterfly Spanish', 'Spanish Learning', 'SpanishDict'],
    french: ['Learn French with Alexa', 'French Learning', 'FrenchPod101'],
    german: ['Learn German', 'German Learning', 'GermanPod101'],
    italian: ['Learn Italian', 'Italian Learning', 'ItalianPod101'],
    chinese: ['Learn Chinese', 'Chinese Learning', 'ChinesePod101'],
    japanese: ['Learn Japanese', 'Japanese Learning', 'JapanesePod101'],
    arabic: ['Learn Arabic', 'Arabic Learning', 'ArabicPod101']
  };
  
  const topicFile = {
    topic: topic,
    detailedSummary: content,
    whyItMatters: `Mastering ${topic} is essential for building a strong foundation in ${language} - these basic concepts are the first building blocks for all future language learning.`,
    materials: {
      videos: videoIds[lang as keyof typeof videoIds].map((id, i) => ({
        title: `${topic} | ${channels[lang as keyof typeof channels][i]}`,
        url: `https://www.youtube.com/watch?v=${id}`
      })),
      textbooks: [
        {
          title: `${language} for Beginners - ${topic}`,
          url: "https://www.languageguide.org/"
        }
      ],
      images: [
        {
          title: `${topic} - Visual Aid`,
          url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800`
        }
      ]
    },
    assignments: [
      {
        title: `Practice ${topic}`,
        description: `Practice and demonstrate understanding of ${topic} in ${language}.`,
        tasks: [
          `Create flashcards for all vocabulary related to ${topic}`,
          `Practice pronunciation daily for one week`,
          `Write simple sentences using the vocabulary from ${topic}`,
          `Record yourself speaking the vocabulary correctly`,
          `Create a simple dialogue or conversation using ${topic} concepts`
        ]
      }
    ],
    quizzes: [
      {
        question: `What is the main focus of ${topic}?`,
        type: "multiple-choice",
        options: [
          `Learning basic ${language} vocabulary and concepts`,
          "Advanced grammar structures",
          "Literary analysis",
          "Historical context"
        ],
        correctAnswer: 0,
        explanation: `${topic} focuses on learning basic ${language} vocabulary and fundamental concepts.`,
      },
      {
        question: `Why is ${topic} important for ${language} learners?`,
        type: "multiple-choice",
        options: [
          "It provides essential foundational knowledge",
          "It is only useful for advanced learners",
          "It has no practical application",
          "It is outdated information"
        ],
        correctAnswer: 0,
        explanation: `${topic} provides essential foundational knowledge that all ${language} learners need.`,
      }
    ],
    images: {
      main: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800`,
      additional: [
        `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800`,
        `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800`
      ]
    },
    videoUrl: `https://www.youtube.com/watch?v=${videoIds[lang as keyof typeof videoIds][0]}`,
    fullTopicLesson: {
      introduction: `${topic} is a fundamental aspect of learning ${language}. This lesson introduces essential vocabulary and concepts.`,
      keyConcepts: [
        "Basic vocabulary and pronunciation",
        "Fundamental language concepts",
        "Simple phrases and expressions",
        "Cultural context and usage"
      ],
      detailedExplanations: [
        {
          concept: "Vocabulary",
          explanation: `This topic introduces essential ${language} vocabulary that forms the foundation for communication.`
        },
        {
          concept: "Pronunciation",
          explanation: `Proper pronunciation is crucial for being understood and understanding spoken ${language}.`
        }
      ],
      examples: [
        {
          description: "Basic examples",
          content: `Examples demonstrate how to use the vocabulary and concepts from ${topic} in simple sentences.`
        }
      ],
      realWorldApplications: [
        "Basic communication",
        "Daily interactions",
        "Building language foundation",
        "Cultural understanding"
      ]
    },
    markingGuide: {
      quizGrading: "Each multiple-choice question is worth equal points. Correct answers demonstrate understanding of basic concepts.",
      assignmentGrading: "Assignments are graded based on vocabulary accuracy, pronunciation, effort, and understanding of basic concepts."
    }
  };

  return topicFile;
}

// Read curriculum files and generate topics
const languages = ['spanish', 'french', 'german', 'italian', 'chinese', 'japanese', 'arabic'];
const coursesDir = path.join(process.cwd(), 'seed', 'courses');
const curriculumDir = path.join(process.cwd(), 'curriculum');
let totalGenerated = 0;

for (const language of languages) {
  try {
    const curriculumPath = path.join(curriculumDir, language, 'curriculum.json');
    if (!fs.existsSync(curriculumPath)) {
      console.log(`⚠️  Curriculum file not found for ${language}`);
      continue;
    }

    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    const basicTopics = curriculum.levels?.Basic || [];

    if (basicTopics.length === 0) {
      console.log(`⚠️  No Basic level topics found for ${language}`);
      continue;
    }

    // Create basic directory if it doesn't exist
    const basicDir = path.join(coursesDir, language, 'basic');
    if (!fs.existsSync(basicDir)) {
      fs.mkdirSync(basicDir, { recursive: true });
    }

    // Generate topic files
    for (let i = 0; i < basicTopics.length; i++) {
      const topic = basicTopics[i];
      const topicNumber = i + 1;
      const topicFile = generateBasicTopicFile(topic, language, topicNumber);
      const filePath = path.join(basicDir, `topic_${topicNumber}.json`);
      
      fs.writeFileSync(filePath, JSON.stringify(topicFile, null, 2), 'utf-8');
      console.log(`✅ Generated: ${topic} (${language} - Basic - Topic ${topicNumber})`);
      totalGenerated++;
    }
  } catch (error: any) {
    console.error(`❌ Error processing ${language}: ${error.message}`);
  }
}

console.log(`\n🎉 Generated ${totalGenerated} Basic level topic files for all languages!`);




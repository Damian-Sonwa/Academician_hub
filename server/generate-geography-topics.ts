/**
 * Generate Geography topic content files for Secondary and Advanced levels
 */

import fs from 'fs';
import path from 'path';

// Geography curriculum topics
const geographyCurriculum = {
  secondary: [
    "Introduction to Geography: Physical and Human Geography",
    "Earth's Structure: Plate Tectonics and Landforms",
    "Weather and Climate: Atmospheric Processes",
    "Biomes and Ecosystems: Global Distribution",
    "Water Systems: Oceans, Rivers, and Water Cycle",
    "Population Geography: Distribution and Migration",
    "Urban Geography: Cities and Urbanization",
    "Economic Geography: Agriculture, Industry, and Trade",
    "Political Geography: Borders, States, and Geopolitics",
    "Cultural Geography: Language, Religion, and Identity",
    "Regional Geography: North America",
    "Regional Geography: Europe and Asia",
    "Regional Geography: Africa, Latin America, and Oceania",
    "Environmental Geography: Resources and Sustainability",
    "Geographic Information Systems (GIS) Basics"
  ],
  advanced: [
    "Physical Geography: Geomorphology and Landform Processes",
    "Climatology: Climate Systems and Change",
    "Biogeography: Species Distribution and Evolution",
    "Hydrology: Water Resources and Management",
    "Human Geography: Space, Place, and Scale",
    "Urban Geography: Planning, Development, and Sustainability",
    "Economic Geography: Globalization and Development",
    "Political Geography: Territory, Power, and Conflict",
    "Cultural Geography: Identity, Representation, and Space",
    "Environmental Geography: Sustainability and Resource Management",
    "Geographic Information Systems (GIS) and Remote Sensing",
    "Regional Analysis: Advanced Case Studies",
    "Research Methods in Geography",
    "Geographic Thought and Theory",
    "Capstone: Geographic Research Project"
  ]
};

// Topic-specific summaries and content
const topicContent: Record<string, any> = {
  // Secondary topics
  "Earth's Structure: Plate Tectonics and Landforms": {
    summary: "Earth's structure consists of layers: crust, mantle, and core. Plate tectonics explains how Earth's lithosphere is divided into moving plates that interact at boundaries. Convergent boundaries create mountains and trenches. Divergent boundaries form mid-ocean ridges and rift valleys. Transform boundaries cause earthquakes. These processes create landforms: mountains, valleys, plateaus, plains, and coastal features. Understanding plate tectonics explains earthquakes, volcanoes, mountain formation, and continental drift.",
    whyItMatters: "Plate tectonics explains Earth's dynamic surface, natural hazards, and resource distribution - essential for understanding geology, natural disasters, and Earth's evolution.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Weather and Climate: Atmospheric Processes": {
    summary: "Weather is short-term atmospheric conditions; climate is long-term patterns. The atmosphere has layers: troposphere (weather), stratosphere (ozone), mesosphere, thermosphere. Solar radiation drives weather through heating, pressure differences, and wind. Water cycle processes include evaporation, condensation, precipitation. Weather systems include high/low pressure, fronts, storms. Climate factors: latitude, altitude, ocean currents, landforms. Climate zones: tropical, temperate, polar. Understanding weather and climate is crucial for agriculture, planning, and climate change.",
    whyItMatters: "Understanding weather and climate patterns is essential for agriculture, disaster preparedness, urban planning, and addressing climate change impacts.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Biomes and Ecosystems: Global Distribution": {
    summary: "Biomes are large-scale ecosystems with similar climate, vegetation, and wildlife. Major terrestrial biomes: tropical rainforests, deserts, grasslands, temperate forests, taiga, tundra. Aquatic biomes: freshwater (lakes, rivers, wetlands) and marine (oceans, coral reefs). Each biome has characteristic plants, animals, and adaptations. Biome distribution depends on climate, latitude, altitude, and geography. Ecosystems include biotic (living) and abiotic (non-living) components interacting through energy flow and nutrient cycles. Understanding biomes helps explain biodiversity, conservation, and environmental management.",
    whyItMatters: "Understanding biomes and ecosystems is essential for biodiversity conservation, environmental management, and understanding global environmental patterns.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Water Systems: Oceans, Rivers, and Water Cycle": {
    summary: "Water covers 71% of Earth's surface. Oceans contain 97% of Earth's water and drive global climate through currents. Major ocean currents distribute heat. Rivers flow from source to mouth, creating valleys and deltas. The water cycle circulates water through evaporation, condensation, precipitation, and runoff. Groundwater fills aquifers. Water systems shape landscapes through erosion and deposition. Water resources are essential for life, agriculture, industry, and ecosystems. Understanding water systems is crucial for water management and conservation.",
    whyItMatters: "Water systems are fundamental to life, climate, agriculture, and ecosystems - understanding them is essential for water resource management and conservation.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Population Geography: Distribution and Migration": {
    summary: "Population geography studies human population distribution, density, growth, and movement. World population is unevenly distributed, concentrated in Asia, Europe, and coastal areas. Population density measures people per area. Population pyramids show age and gender structure. Migration includes push factors (war, poverty) and pull factors (jobs, safety). Types: internal, international, voluntary, forced. Urbanization increases population in cities. Demographic transition model explains population changes. Understanding population geography helps plan services, manage resources, and address migration challenges.",
    whyItMatters: "Population geography helps understand demographic trends, plan infrastructure, manage resources, and address migration and urbanization challenges.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Urban Geography: Cities and Urbanization": {
    summary: "Urban geography studies cities, their growth, structure, and functions. Urbanization is the increasing proportion of people living in cities. Cities have zones: central business district (CBD), residential, industrial, commercial. Urban models include concentric zones, sectors, and multiple nuclei. Urban functions: economic, political, cultural, transportation hubs. Challenges: housing, transportation, pollution, inequality. Urban planning addresses these through zoning, infrastructure, and sustainability. Megacities have over 10 million people. Understanding urban geography helps plan sustainable, livable cities.",
    whyItMatters: "Urban geography is essential for planning sustainable cities, addressing urban challenges, and understanding the majority of humanity who live in urban areas.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Economic Geography: Agriculture, Industry, and Trade": {
    summary: "Economic geography studies how economic activities are distributed across space. Agriculture types: subsistence (feeding families) and commercial (selling crops). Agricultural systems vary by climate and technology. Industry locations depend on resources, labor, transportation, and markets. Economic sectors: primary (extraction), secondary (manufacturing), tertiary (services), quaternary (information). Trade connects regions through imports and exports. Globalization increases economic interdependence. Economic development varies globally, creating core and peripheral regions. Understanding economic geography explains wealth distribution, trade patterns, and development.",
    whyItMatters: "Economic geography explains global wealth distribution, trade patterns, and development - essential for understanding economic systems and addressing inequality.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Political Geography: Borders, States, and Geopolitics": {
    summary: "Political geography studies how political systems organize space. States are political units with defined territories, populations, governments, and sovereignty. Borders separate states and can be natural (rivers, mountains) or artificial (lines). Nations are cultural groups; nation-states combine nation and state. Geopolitics studies how geography influences politics and power. Colonialism shaped modern political boundaries. Conflicts arise from border disputes, resources, and ethnic divisions. International organizations (UN, EU) coordinate between states. Understanding political geography explains conflicts, cooperation, and global governance.",
    whyItMatters: "Political geography explains borders, conflicts, cooperation, and global governance - essential for understanding international relations and geopolitics.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Cultural Geography: Language, Religion, and Identity": {
    summary: "Cultural geography studies how culture varies across space. Language families group related languages. Major language families: Indo-European, Sino-Tibetan, Afro-Asiatic. Languages spread through migration, trade, and colonization. Religion distribution shows major world religions: Christianity, Islam, Hinduism, Buddhism, Judaism. Religious landscapes include places of worship and sacred sites. Culture includes customs, traditions, arts, and values. Cultural regions share similar characteristics. Cultural diffusion spreads ideas and practices. Globalization affects local cultures. Understanding cultural geography explains diversity, identity, and cultural change.",
    whyItMatters: "Cultural geography explains human diversity, identity, and cultural patterns - essential for understanding societies and addressing cultural conflicts.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Regional Geography: North America": {
    summary: "North America includes Canada, United States, Mexico, and Central America. Physical features: Rocky Mountains, Great Plains, Appalachian Mountains, Great Lakes, Mississippi River. Climate varies from arctic (north) to tropical (south). Major cities: New York, Los Angeles, Mexico City, Toronto. Economic activities: agriculture, manufacturing, services, technology. Cultural diversity reflects immigration history. Regional differences: Northeast (industrial), South (agricultural), West (technology), Canada (resources), Mexico (manufacturing). NAFTA/USMCA promotes trade. Understanding North American geography explains regional development and relationships.",
    whyItMatters: "Understanding North American geography explains regional development, economic patterns, and relationships between countries in the region.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Regional Geography: Europe and Asia": {
    summary: "Europe and Asia form Eurasia, the world's largest landmass. Europe: diverse physical features (Alps, plains, coastlines), temperate climate, high urbanization, developed economies, EU integration. Asia: vast size, diverse physical features (Himalayas, deserts, coastlines), varied climates, high population density, rapid economic growth. Major regions: Western Europe, Eastern Europe, East Asia, South Asia, Southeast Asia, Central Asia. Economic powerhouses: China, Japan, India, Germany. Cultural diversity: hundreds of languages and religions. Understanding Eurasian geography explains global economic and political dynamics.",
    whyItMatters: "Understanding Europe and Asia geography explains global economic power, population distribution, and cultural diversity in the world's largest landmass.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Regional Geography: Africa, Latin America, and Oceania": {
    summary: "Africa: diverse physical features (Sahara, savannas, rainforests, Great Rift Valley), varied climates, rich resources, rapid population growth, development challenges. Latin America: Andes Mountains, Amazon Basin, diverse climates, cultural mix (indigenous, European, African), economic development varies. Oceania: Australia (desert interior, coastal cities), Pacific Islands (diverse cultures, small populations), New Zealand (mountains, agriculture). These regions face challenges: poverty, environmental issues, political instability, but also have resources, biodiversity, and growing economies. Understanding these regions explains global diversity and development patterns.",
    whyItMatters: "Understanding these regions explains global diversity, development challenges, and opportunities in Africa, Latin America, and Oceania.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Environmental Geography: Resources and Sustainability": {
    summary: "Environmental geography studies human-environment interactions and resource management. Natural resources: renewable (solar, wind, water) and non-renewable (fossil fuels, minerals). Resource distribution is uneven globally. Environmental issues: pollution, deforestation, climate change, biodiversity loss. Sustainability balances current needs with future generations. Conservation protects ecosystems. Renewable energy reduces fossil fuel dependence. Environmental policies address pollution and climate change. Sustainable development promotes economic growth with environmental protection. Understanding environmental geography is crucial for addressing global environmental challenges.",
    whyItMatters: "Environmental geography is essential for understanding resource management, sustainability, and addressing global environmental challenges like climate change.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  },
  "Geographic Information Systems (GIS) Basics": {
    summary: "GIS (Geographic Information Systems) are computer systems for capturing, storing, analyzing, and displaying geographic data. GIS combines maps with databases. Layers represent different features: roads, buildings, elevation, population. GIS functions: mapping, spatial analysis, querying, modeling. Applications: urban planning, disaster management, environmental monitoring, business location. Remote sensing uses satellites and aircraft to collect geographic data. GPS provides location data. GIS helps visualize patterns, analyze relationships, and make informed decisions. Understanding GIS basics is essential for modern geography and spatial analysis.",
    whyItMatters: "GIS is a powerful tool for spatial analysis, planning, and decision-making - essential for modern geography, urban planning, and environmental management.",
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  }
};

function generateTopicFile(topic: string, level: string, topicNumber: number) {
  const content = topicContent[topic] || {
    summary: `${topic} provides comprehensive coverage of geographic concepts, processes, and applications. This topic explores spatial patterns, relationships, and processes that shape our world. Students will gain deep understanding through detailed explanations, examples, and real-world applications.`,
    whyItMatters: `Understanding ${topic} is essential for geographic literacy, spatial thinking, and addressing global challenges.`,
    videoIds: ['3PKzJdXhWqk', '9vKqVkMQHKk', '9vKqVkMQHKk']
  };

  const topicFile = {
    topic: topic,
    detailedSummary: content.summary,
    whyItMatters: content.whyItMatters,
    materials: {
      videos: [
        {
          title: `${topic} | Crash Course Geography`,
          url: `https://www.youtube.com/watch?v=${content.videoIds[0]}`
        },
        {
          title: `${topic} | National Geographic`,
          url: `https://www.youtube.com/watch?v=${content.videoIds[1]}`
        },
        {
          title: `${topic} | Geography Realm`,
          url: `https://www.youtube.com/watch?v=${content.videoIds[2]}`
        }
      ],
      textbooks: [
        {
          title: "Introduction to Human Geography - OpenStax",
          url: "https://openstax.org/details/books/introduction-human-geography"
        },
        {
          title: "Physical Geography - LibreTexts",
          url: "https://geo.libretexts.org/"
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
        title: `Research Assignment: ${topic}`,
        description: `Conduct research on ${topic} and write a comprehensive report analyzing key concepts, examples, and real-world applications.`,
        tasks: [
          "Research the main concepts and theories related to this topic",
          "Identify and analyze at least 3 real-world examples",
          "Create maps, diagrams, or visual aids to illustrate key points",
          "Write a 1000-word report with proper citations",
          "Present your findings to the class"
        ]
      }
    ],
    quizzes: [
      {
        question: `What is the main focus of ${topic}?`,
        options: [
          "Geographic patterns and processes",
          "Historical events",
          "Mathematical calculations",
          "Literary analysis"
        ],
        correctAnswer: 0,
        explanation: `${topic} focuses on geographic patterns, processes, and spatial relationships.`,
        type: "multiple-choice"
      },
      {
        question: `Why is understanding ${topic} important?`,
        options: [
          "It helps understand spatial patterns and global issues",
          "It is only useful for academic purposes",
          "It has no real-world applications",
          "It is outdated information"
        ],
        correctAnswer: 0,
        explanation: `Understanding ${topic} is essential for geographic literacy and addressing global challenges.`,
        type: "multiple-choice"
      }
    ],
    images: {
      main: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800`,
      additional: [
        `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800`,
        `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800`
      ]
    },
    videoUrl: `https://www.youtube.com/watch?v=${content.videoIds[0]}`,
    fullTopicLesson: {
      introduction: `${topic} is a fundamental aspect of geography that explores spatial patterns, processes, and relationships.`,
      keyConcepts: [
        "Spatial patterns and distributions",
        "Geographic processes and interactions",
        "Human-environment relationships",
        "Regional characteristics and variations"
      ],
      detailedExplanations: [
        {
          concept: "Spatial Patterns",
          explanation: "Spatial patterns describe how geographic features are distributed across space, including clustering, dispersion, and linear arrangements."
        },
        {
          concept: "Geographic Processes",
          explanation: "Geographic processes are the mechanisms that create, modify, and maintain spatial patterns over time."
        }
      ],
      examples: [
        {
          description: "Real-world example",
          content: "Examples illustrate how geographic concepts apply to actual places and situations."
        }
      ],
      realWorldApplications: [
        "Urban planning and development",
        "Environmental management",
        "Resource allocation",
        "Disaster preparedness"
      ]
    },
    markingGuide: {
      quizGrading: "Each multiple-choice question is worth equal points. Correct answers demonstrate understanding of key concepts.",
      assignmentGrading: "Assignments are graded based on research quality, analysis depth, clarity of writing, and proper use of geographic concepts."
    }
  };

  return topicFile;
}

// Generate all missing topic files
const geographyDir = path.join(process.cwd(), 'seed', 'courses', 'geography');
let generated = 0;

// Generate Secondary topics (skip topic 1 as it exists)
for (let i = 1; i < geographyCurriculum.secondary.length; i++) {
  const topic = geographyCurriculum.secondary[i];
  const topicNumber = i + 1;
  const topicFile = generateTopicFile(topic, 'secondary', topicNumber);
  const filePath = path.join(geographyDir, 'secondary', `topic_${topicNumber}.json`);
  
  fs.writeFileSync(filePath, JSON.stringify(topicFile, null, 2), 'utf-8');
  console.log(`✅ Generated: ${topic} (Secondary - Topic ${topicNumber})`);
  generated++;
}

// Generate Advanced topics
for (let i = 0; i < geographyCurriculum.advanced.length; i++) {
  const topic = geographyCurriculum.advanced[i];
  const topicNumber = i + 1;
  const topicFile = generateTopicFile(topic, 'advanced', topicNumber);
  
  // Create advanced directory if it doesn't exist
  const advancedDir = path.join(geographyDir, 'advanced');
  if (!fs.existsSync(advancedDir)) {
    fs.mkdirSync(advancedDir, { recursive: true });
  }
  
  const filePath = path.join(advancedDir, `topic_${topicNumber}.json`);
  fs.writeFileSync(filePath, JSON.stringify(topicFile, null, 2), 'utf-8');
  console.log(`✅ Generated: ${topic} (Advanced - Topic ${topicNumber})`);
  generated++;
}

console.log(`\n🎉 Generated ${generated} Geography topic files!`);
console.log(`   - Secondary: ${geographyCurriculum.secondary.length - 1} new topics`);
console.log(`   - Advanced: ${geographyCurriculum.advanced.length} topics`);




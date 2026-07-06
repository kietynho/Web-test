const GE_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

/**
 * Each entry: { word, meaning, example, level }
 * Keyed by CEFR level for the level-based lists.
 */
const GE_VOCAB_BY_LEVEL = {
  A1: [
    { word: "house", meaning: "a building where people live", example: "My house has a small garden." },
    { word: "water", meaning: "the clear liquid that falls as rain and that we drink", example: "Can I have a glass of water?" },
    { word: "family", meaning: "a group of people related to each other, like parents and children", example: "I live with my family in Hanoi." },
    { word: "school", meaning: "a place where children go to learn", example: "She walks to school every morning." },
    { word: "friend", meaning: "a person you know well and like", example: "He is my best friend." },
    { word: "happy", meaning: "feeling pleased and cheerful", example: "I feel happy when the sun shines." },
    { word: "food", meaning: "things that people and animals eat", example: "Vietnamese food is delicious." },
    { word: "morning", meaning: "the early part of the day, before noon", example: "I drink coffee every morning." },
    { word: "book", meaning: "a set of printed pages you read", example: "She reads a book before bed." },
    { word: "weather", meaning: "the condition of the air: sun, rain, wind, etc.", example: "The weather is nice today." },
  ],
  A2: [
    { word: "journey", meaning: "the act of travelling from one place to another", example: "The journey to the coast took three hours." },
    { word: "healthy", meaning: "good for your body; not ill", example: "Eating vegetables keeps you healthy." },
    { word: "borrow", meaning: "to take and use something that you will give back", example: "Can I borrow your pen for a minute?" },
    { word: "neighbour", meaning: "a person who lives near you", example: "Our neighbour waters our plants when we travel." },
    { word: "improve", meaning: "to become or make something better", example: "Practice every day to improve your English." },
    { word: "decide", meaning: "to choose after thinking about the options", example: "We decided to take the early train." },
    { word: "invite", meaning: "to ask someone to come to an event", example: "They invited us to their wedding." },
    { word: "weekend", meaning: "Saturday and Sunday", example: "We often go hiking at the weekend." },
    { word: "expensive", meaning: "costing a lot of money", example: "That restaurant is too expensive for students." },
    { word: "promise", meaning: "to say you will certainly do something", example: "I promise to call you tomorrow." },
  ],
  B1: [
    { word: "achieve", meaning: "to succeed in reaching a goal after effort", example: "She achieved her dream of studying abroad." },
    { word: "encourage", meaning: "to give someone support or confidence to do something", example: "My teacher encouraged me to join the debate club." },
    { word: "environment", meaning: "the natural world: land, air, water, plants and animals", example: "Plastic waste damages the environment." },
    { word: "opportunity", meaning: "a chance to do something good or useful", example: "The internship is a great opportunity to learn." },
    { word: "responsible", meaning: "having the duty to take care of something", example: "Parents are responsible for their children's safety." },
    { word: "experience", meaning: "knowledge or skill gained from doing something", example: "She has five years of teaching experience." },
    { word: "recommend", meaning: "to suggest that something is good or useful", example: "I recommend this book to every learner." },
    { word: "confident", meaning: "sure of yourself and your abilities", example: "He felt confident before the interview." },
    { word: "necessary", meaning: "needed; that must be done or had", example: "A visa is necessary to enter that country." },
    { word: "solution", meaning: "a way of solving a problem", example: "Recycling is one solution to the waste problem." },
  ],
  B2: [
    { word: "sustainable", meaning: "able to continue for a long time without harming the environment", example: "The city is investing in sustainable transport." },
    { word: "significant", meaning: "large or important enough to be noticed", example: "There was a significant rise in temperatures last decade." },
    { word: "controversial", meaning: "causing a lot of disagreement or discussion", example: "The new law is highly controversial." },
    { word: "innovation", meaning: "a new idea, method or invention", example: "Technological innovation drives economic growth." },
    { word: "perspective", meaning: "a particular way of thinking about something", example: "Travelling gives you a broader perspective on life." },
    { word: "inevitable", meaning: "certain to happen; unavoidable", example: "Change is inevitable in a fast-moving industry." },
    { word: "consequence", meaning: "a result or effect of an action", example: "Deforestation has serious consequences for wildlife." },
    { word: "demonstrate", meaning: "to show something clearly by giving proof or examples", example: "The study demonstrates the benefits of exercise." },
    { word: "efficient", meaning: "working well without wasting time or energy", example: "Electric motors are more efficient than petrol engines." },
    { word: "phenomenon", meaning: "something that happens or exists, often unusual or notable", example: "Urban migration is a global phenomenon." },
  ],
  C1: [
    { word: "ubiquitous", meaning: "seeming to be everywhere at the same time", example: "Smartphones have become ubiquitous in modern life." },
    { word: "meticulous", meaning: "extremely careful about details", example: "She kept meticulous records of every experiment." },
    { word: "ambiguous", meaning: "having more than one possible meaning; unclear", example: "The ending of the novel is deliberately ambiguous." },
    { word: "resilient", meaning: "able to recover quickly from difficulties", example: "Coastal communities must be resilient to storms." },
    { word: "scrutinize", meaning: "to examine something very carefully", example: "Auditors scrutinized the company's accounts." },
    { word: "exacerbate", meaning: "to make a bad situation worse", example: "Traffic congestion exacerbates air pollution." },
    { word: "pragmatic", meaning: "dealing with problems in a practical, realistic way", example: "We need a pragmatic approach to the budget." },
    { word: "profound", meaning: "very great, deep or intense", example: "The internet has had a profound impact on education." },
    { word: "articulate", meaning: "able to express ideas clearly and effectively", example: "She is an articulate speaker on climate policy." },
    { word: "paradigm", meaning: "a typical model or pattern of something", example: "Remote work represents a new paradigm for offices." },
  ],
};

/**
 * Topic-based lists. Each entry additionally carries a CEFR level tag.
 */
const GE_TOPICS = [
  {
    id: "environment",
    title: "Environmental Pollution",
    icon: "trees",
    description: "Key vocabulary for talking about pollution, waste and protecting the planet.",
    level: "B1–C1",
    words: [
      { word: "pollution", level: "B1", meaning: "damage caused to air, water or land by harmful substances", example: "Air pollution is a major problem in big cities." },
      { word: "emission", level: "B2", meaning: "gas or other substance sent into the air", example: "Factories must cut their carbon emissions." },
      { word: "recycle", level: "A2", meaning: "to process used materials so they can be used again", example: "We recycle glass, paper and plastic." },
      { word: "contaminate", level: "C1", meaning: "to make something dirty or poisonous", example: "Chemicals contaminated the river." },
      { word: "renewable", level: "B2", meaning: "(of energy) from sources that never run out, like wind or sun", example: "Renewable energy is getting cheaper every year." },
      { word: "deforestation", level: "B2", meaning: "cutting down forests over a large area", example: "Deforestation destroys animal habitats." },
      { word: "biodegradable", level: "C1", meaning: "able to decay naturally without harming the environment", example: "The shop switched to biodegradable packaging." },
      { word: "conservation", level: "B2", meaning: "the protection of nature and wildlife", example: "The park was created for wildlife conservation." },
    ],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    icon: "brain-circuit",
    description: "Modern words for discussing AI, machine learning and smart systems.",
    level: "B1–C1",
    words: [
      { word: "algorithm", level: "B2", meaning: "a set of rules a computer follows to solve a problem", example: "The algorithm recommends videos you might like." },
      { word: "automation", level: "B2", meaning: "the use of machines to do work instead of people", example: "Automation has transformed car manufacturing." },
      { word: "chatbot", level: "B1", meaning: "a computer program that talks with people online", example: "The airline's chatbot answered my question instantly." },
      { word: "dataset", level: "B2", meaning: "a large collection of data used for analysis", example: "The model was trained on a huge dataset of images." },
      { word: "neural", level: "C1", meaning: "relating to networks modelled on the human brain", example: "Neural networks can recognize faces in photos." },
      { word: "autonomous", level: "C1", meaning: "able to operate without human control", example: "Autonomous vehicles are being tested in the city." },
      { word: "prediction", level: "B1", meaning: "a statement about what will happen in the future", example: "The AI makes accurate weather predictions." },
      { word: "ethics", level: "B2", meaning: "moral principles about what is right and wrong", example: "AI ethics is a growing field of study." },
    ],
  },
  {
    id: "future-tech",
    title: "Future Technology",
    icon: "rocket",
    description: "Vocabulary about innovation, space, robotics and tomorrow's world.",
    level: "B1–C1",
    words: [
      { word: "breakthrough", level: "B2", meaning: "an important discovery or development", example: "Scientists announced a breakthrough in battery technology." },
      { word: "prototype", level: "B2", meaning: "the first model of something new, used for testing", example: "Engineers unveiled a prototype of the flying taxi." },
      { word: "cutting-edge", level: "C1", meaning: "extremely modern and advanced", example: "The lab uses cutting-edge equipment." },
      { word: "virtual", level: "B1", meaning: "existing on computers or the internet, not physically", example: "We met in a virtual classroom." },
      { word: "quantum", level: "C1", meaning: "relating to the physics of very small particles, used in advanced computing", example: "Quantum computers could crack today's codes." },
      { word: "wearable", level: "B2", meaning: "(of technology) designed to be worn on the body", example: "Wearable devices track your heart rate." },
      { word: "colonize", level: "C1", meaning: "to settle in and take control of a new area, e.g. another planet", example: "Some believe humans will colonize Mars this century." },
      { word: "obsolete", level: "C1", meaning: "no longer used because something newer exists", example: "DVD players are becoming obsolete." },
    ],
  },
];

/**
 * Returns a flat list of {word, meaning, example, level} for a CEFR level.
 * Used by the Practice tab (flashcards + game).
 */
function geGetWordsForLevel(level) {
  return (GE_VOCAB_BY_LEVEL[level] || []).map((w) => ({ ...w, level }));
}
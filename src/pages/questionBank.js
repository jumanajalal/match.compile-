export const FOOTBALL_QUESTIONS = [
  { q: "How many teams are competing in the FIFA World Cup 2026?", options: ["32", "48", "40", "24"], answer: 1 },
  { q: "Which three countries are co-hosting the 2026 World Cup?", options: ["USA, Mexico, Canada", "Brazil, Argentina, Uruguay", "Spain, Portugal, France", "Germany, Italy, England"], answer: 0 },
  { q: "What does 'VAR' stand for?", options: ["Virtual Assist Referee", "Video Assistant Referee", "Verified Action Review", "Visual Aid Replay"], answer: 1 },
  { q: "How long is a standard football match, excluding stoppage time?", options: ["80 minutes", "90 minutes", "100 minutes", "120 minutes"], answer: 1 },
  { q: "How many players are on a football team on the pitch per side?", options: ["10", "11", "9", "12"], answer: 1 },
  { q: "What's awarded for a foul committed inside the penalty box?", options: ["Free kick", "Corner", "Penalty kick", "Throw-in"], answer: 2 },
  { q: "How many World Cups has Brazil won as of before 2026?", options: ["3", "4", "5", "6"], answer: 2 },
  { q: "What's the maximum number of substitutions allowed in a standard World Cup match?", options: ["3", "5", "7", "Unlimited"], answer: 1 },
  { q: "How many minutes is half-time in football?", options: ["10", "15", "20", "5"], answer: 1 },
  { q: "Who won the FIFA World Cup 2022?", options: ["France", "Argentina", "Brazil", "Croatia"], answer: 1 },
  { q: "How often is the FIFA World Cup held?", options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"], answer: 2 },
  { q: "Which player has won the most Ballon d'Or awards?", options: ["Cristiano Ronaldo", "Lionel Messi", "Pelé", "Zinedine Zidane"], answer: 1 },
  { q: "What color card results in a player being sent off?", options: ["Yellow", "Red", "Blue", "Orange"], answer: 1 },
  { q: "What is it called when a player scores three goals in one match?", options: ["Double", "Hat-trick", "Treble", "Triple"], answer: 1 },
  { q: "Which country hosted the very first FIFA World Cup in 1930?", options: ["Brazil", "Italy", "Uruguay", "France"], answer: 2 },
  { q: "What is the offside rule primarily designed to prevent?", options: ["Time-wasting", "Goal-hanging near the opponent's goal", "Rough tackles", "Handballs"], answer: 1 },
  { q: "Which country has won the most FIFA World Cups overall (as of before 2026)?", options: ["Germany", "Argentina", "Brazil", "Italy"], answer: 2 },
  { q: "How many players make up a full football squad in a World Cup roster?", options: ["18", "20", "23 or 26 (varies by tournament)", "30"], answer: 2 },
  { q: "What is the term for a goal scored directly from a corner kick?", options: ["Olympico", "Direct corner", "Golden goal", "Free header"], answer: 0 },
  { q: "In a penalty shootout, how many initial kicks does each team usually take before sudden death?", options: ["3", "5", "7", "10"], answer: 1 },
  { q: "Which position is primarily responsible for stopping goals?", options: ["Striker", "Midfielder", "Goalkeeper", "Winger"], answer: 2 },
  { q: "What's the term for when the ball fully crosses the goal line between the posts and under the bar?", options: ["Score", "Goal", "Point", "Strike"], answer: 1 },
  { q: "Which trophy is awarded to the FIFA World Cup winners?", options: ["The Golden Cup", "The FIFA World Cup Trophy", "The Jules Rimet Trophy (current era)", "The Champions Trophy"], answer: 1 },
  { q: "What is a 'clean sheet' in football?", options: ["Winning by 3+ goals", "Not conceding any goals in a match", "A perfect passing record", "Scoring in every half"], answer: 1 },
  { q: "Which award is given to the top goal scorer of a World Cup tournament?", options: ["Golden Ball", "Golden Boot", "Golden Glove", "Player of the Tournament"], answer: 1 },
  { q: "Which award goes to the best goalkeeper of a World Cup tournament?", options: ["Golden Boot", "Golden Glove", "Golden Ball", "Fair Play Award"], answer: 1 },
  { q: "What's the standard size of a football pitch length, roughly?", options: ["50-70 meters", "90-120 meters", "150-180 meters", "200+ meters"], answer: 1 },
  { q: "In football, what does a referee signal with an outstretched arm pointing to the corner?", options: ["Goal kick", "Corner kick", "Offside", "Free kick"], answer: 1 },
  { q: "Which confederation does Brazil's football federation belong to?", options: ["UEFA", "CONMEBOL", "CONCACAF", "AFC"], answer: 1 },
  { q: "How many referees (including assistants) typically officiate a top-level match on the pitch?", options: ["1", "2", "3", "4+ (with VAR team)"], answer: 3 },
];

export const TECH_QUESTIONS = [
  { q: "What does 'IDE' stand for?", options: ["Integrated Development Environment", "Internal Data Exchange", "Interface Design Engine", "Instant Debug Env"], answer: 0 },
  { q: "Which data structure works on First-In-First-Out (FIFO)?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1 },
  { q: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Process", "Home Tool Transfer Protocol", "HyperText Type Program"], answer: 0 },
  { q: "Which sorting algorithm has the best average time complexity?", options: ["Bubble Sort O(n²)", "Quick Sort O(n log n)", "Selection Sort O(n²)", "Insertion Sort O(n²)"], answer: 1 },
  { q: "What does 'API' stand for?", options: ["Application Programming Interface", "Automated Program Instruction", "Applied Protocol Integration", "App Process Interface"], answer: 0 },
  { q: "In Big-O notation, what's the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
  { q: "What does 'SQL' stand for?", options: ["Structured Query Language", "Simple Query Logic", "System Query List", "Sequential Query Language"], answer: 0 },
  { q: "Which of these is NOT a JavaScript data type?", options: ["Boolean", "Float", "String", "Undefined"], answer: 1 },
];

// Tagged by adopted nation — each player sees questions matching their pick
export const NATION_QUESTIONS = {
  Argentina: [
    { q: "How many World Cups has Argentina won as of before 2026?", options: ["2", "3", "4", "1"], answer: 1 },
    { q: "Argentina's home kit is famously which two colors?", options: ["Red and white", "Sky blue and white", "Blue and yellow", "Green and white"], answer: 1 },
    { q: "What is Argentina's national team nicknamed?", options: ["La Albiceleste", "La Roja", "Les Bleus", "Der Panzer"], answer: 0 },
  ],
  France: [
    { q: "How many World Cups has France won as of before 2026?", options: ["1", "2", "3", "4"], answer: 1 },
    { q: "France won their most recent World Cup title in which year (before 2026)?", options: ["2014", "2018", "2010", "2006"], answer: 1 },
    { q: "France's national team is nicknamed:", options: ["Les Bleus", "La Roja", "Die Mannschaft", "Azzurri"], answer: 0 },
  ],
  Spain: [
    { q: "In which year did Spain win their only World Cup title (before 2026)?", options: ["2006", "2010", "2014", "2018"], answer: 1 },
    { q: "Spain's national football team is nicknamed:", options: ["La Roja", "Les Bleus", "Die Mannschaft", "Azzurri"], answer: 0 },
  ],
  England: [
    { q: "In which year did England win their only World Cup title (before 2026)?", options: ["1958", "1966", "1970", "1978"], answer: 1 },
    { q: "England's national team is commonly nicknamed:", options: ["The Three Lions", "The Reds", "The Blues", "The Eagles"], answer: 0 },
  ],
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Football-heavy mix: 6 football + 2 tech + 2 nation-specific = 10 total, different draw per player
export function buildQuizForPlayer(adoptedNation) {
  const football = shuffle(FOOTBALL_QUESTIONS).slice(0, 6);
  const tech = shuffle(TECH_QUESTIONS).slice(0, 2);
  const nationSpecific = shuffle(NATION_QUESTIONS[adoptedNation] || []).slice(0, 2);
  return shuffle([...football, ...tech, ...nationSpecific]);
}
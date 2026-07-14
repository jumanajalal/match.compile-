export const GENERAL_QUESTIONS = [
  // --- Original Questions ---
  { q: "How many teams are competing in the FIFA World Cup 2026?", options: ["32", "48", "40", "24"], answer: 1 },
  { q: "Which three countries are co-hosting the 2026 World Cup?", options: ["USA, Mexico, Canada", "Brazil, Argentina, Uruguay", "Spain, Portugal, France", "Germany, Italy, England"], answer: 0 },
  { q: "What does 'VAR' stand for?", options: ["Virtual Assist Referee", "Video Assistant Referee", "Verified Action Review", "Visual Aid Replay"], answer: 1 },
  { q: "What does 'IDE' stand for?", options: ["Integrated Development Environment", "Internal Data Exchange", "Interface Design Engine", "Instant Debug Env"], answer: 0 },
  { q: "How long is a standard football match, excluding stoppage time?", options: ["80 minutes", "90 minutes", "100 minutes", "120 minutes"], answer: 1 },
  { q: "Which data structure works on First-In-First-Out (FIFO)?", options: ["Stack", "Queue", "Tree", "Graph"], answer: 1 },
  { q: "How many players are on a football team on the pitch per side?", options: ["10", "11", "9", "12"], answer: 1 },
  { q: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Process", "Home Tool Transfer Protocol", "HyperText Type Program"], answer: 0 },
  { q: "In football, what's awarded for a foul inside the penalty box?", options: ["Free kick", "Corner", "Penalty kick", "Throw-in"], answer: 2 },
  { q: "Which sorting algorithm has the best average time complexity?", options: ["Bubble Sort O(n²)", "Quick Sort O(n log n)", "Selection Sort O(n²)", "Insertion Sort O(n²)"], answer: 1 },
  { q: "How many World Cups has Brazil won (as of before 2026)?", options: ["3", "4", "5", "6"], answer: 2 },
  { q: "What does 'API' stand for?", options: ["Application Programming Interface", "Automated Program Instruction", "Applied Protocol Integration", "App Process Interface"], answer: 0 },
  { q: "What's the maximum number of substitutions allowed in a standard World Cup match?", options: ["3", "5", "7", "Unlimited"], answer: 1 },
  { q: "In Big-O notation, what's the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2 },
  { q: "How many minutes is half-time in football?", options: ["10", "15", "20", "5"], answer: 1 },
  
  // --- New Football Trivia ---
  { q: "Which player holds the record for the most goals scored in World Cup history?", options: ["Pele", "Miroslav Klose", "Lionel Messi", "Cristiano Ronaldo"], answer: 1 },
  { q: "What is the standard distance from the penalty spot to the goal line?", options: ["10 yards", "12 yards", "14 yards", "18 yards"], answer: 1 },
  { q: "Which country has hosted the World Cup the most times (including 2026)?", options: ["Brazil", "USA", "Mexico", "France"], answer: 2 },
  { q: "What material is the actual FIFA World Cup trophy made of?", options: ["Solid 18-carat gold", "Gold-plated bronze", "Solid Silver", "Platinum"], answer: 0 },
  { q: "What is the color of the card shown by a referee to permanently dismiss a player?", options: ["Yellow", "Black", "Red", "Blue"], answer: 2 },
  { q: "Which nation has reached the most World Cup finals without ever winning the tournament?", options: ["Netherlands", "Croatia", "Hungary", "Sweden"], answer: 0 },

  // --- New Tech & Logic Trivia ---
  { q: "In Python, which keyword is used to define a function?", options: ["func", "define", "def", "function"], answer: 2 },
  { q: "What is the primary difference between a List and a Tuple in Python?", options: ["Tuples are mutable", "Lists are immutable", "Tuples are immutable", "There is no difference"], answer: 2 },
  { q: "Which of these is NOT a primitive data type in Java?", options: ["int", "float", "String", "boolean"], answer: 2 },
  { q: "In C programming, which symbol is used to get the memory address of a variable?", options: ["*", "&", "%", "#"], answer: 1 },
  { q: "Which HTTP status code is universally known as 'Not Found'?", options: ["200", "403", "404", "500"], answer: 2 },
  { q: "In object-oriented programming, what concept restricts direct access to some of an object's components?", options: ["Polymorphism", "Inheritance", "Encapsulation", "Abstraction"], answer: 2 },
  { q: "What does SQL stand for?", options: ["Structured Query Language", "Standard Query Logic", "Simple Query Language", "System Query Link"], answer: 0 },
  { q: "Which memory allocation function in C is used to dynamically allocate memory at runtime?", options: ["alloc()", "malloc()", "memalloc()", "dynamic()"], answer: 1 },
  { q: "In Java, what is the default value of an uninitialized boolean variable inside a class?", options: ["true", "false", "null", "0"], answer: 1 }
];

// Tagged by adopted nation — each player sees questions matching their pick
export const NATION_QUESTIONS = {
  Argentina: [
    { q: "How many World Cups has Argentina won as of before 2026?", options: ["2", "3", "4", "1"], answer: 1 },
    { q: "Argentina's home kit is famously which two colors?", options: ["Red and white", "Sky blue and white", "Blue and yellow", "Green and white"], answer: 1 },
    { q: "Who was the captain of the Argentina team that won the 2022 World Cup?", options: ["Diego Maradona", "Lionel Messi", "Javier Mascherano", "Angel Di Maria"], answer: 1 },
    { q: "Which legendary Argentine player scored the famous 'Hand of God' goal?", options: ["Lionel Messi", "Mario Kempes", "Diego Maradona", "Gabriel Batistuta"], answer: 2 },
    { q: "How many goals did Lionel Messi score in the 2022 World Cup final match?", options: ["1", "2", "3", "0"], answer: 1 }
  ],
  France: [
    { q: "How many World Cups has France won as of before 2026?", options: ["1", "2", "3", "4"], answer: 1 },
    { q: "France won their most recent World Cup title in which year (before 2026)?", options: ["2014", "2018", "2010", "2006"], answer: 1 },
    { q: "Which French player scored a hat-trick in the 2022 World Cup Final?", options: ["Antoine Griezmann", "Olivier Giroud", "Kylian Mbappe", "Paul Pogba"], answer: 2 },
    { q: "Who is the all-time top goalscorer for the French national team?", options: ["Thierry Henry", "Michel Platini", "Olivier Giroud", "Zinedine Zidane"], answer: 2 },
    { q: "France's famous national football academy is known as:", options: ["La Masia", "Clairefontaine", "Cobham", "Castelo"], answer: 1 }
  ],
  Spain: [
    { q: "In which year did Spain win their only World Cup title (before 2026)?", options: ["2006", "2010", "2014", "2018"], answer: 1 },
    { q: "Spain's national football team is nicknamed:", options: ["La Roja", "Les Bleus", "Die Mannschaft", "Azzurri"], answer: 0 },
    { q: "Spain's 2010 World Cup winning goal was scored in extra time by:", options: ["Xavi", "Fernando Torres", "Andres Iniesta", "David Villa"], answer: 2 },
    { q: "Which famous short-passing tactical style is heavily associated with Spain?", options: ["Catenaccio", "Gegenpressing", "Tiki-taka", "Total Football"], answer: 2 },
    { q: "Who was the manager of the Spain team that won the 2010 World Cup?", options: ["Luis Enrique", "Vicente del Bosque", "Pep Guardiola", "Julen Lopetegui"], answer: 1 }
  ],
  England: [
    { q: "In which year did England win their only World Cup title (before 2026)?", options: ["1958", "1966", "1970", "1978"], answer: 1 },
    { q: "England's national team is commonly nicknamed:", options: ["The Three Lions", "The Reds", "The Blues", "The Eagles"], answer: 0 },
    { q: "Who is England's all-time top goalscorer in international football?", options: ["Wayne Rooney", "Bobby Charlton", "Harry Kane", "Gary Lineker"], answer: 2 },
    { q: "What is the name of England's primary national football stadium?", options: ["Old Trafford", "Anfield", "Wembley", "Emirates"], answer: 2 },
    { q: "Who managed the England national team to the Euro 2020 and 2024 finals?", options: ["Gareth Southgate", "Fabio Capello", "Roy Hodgson", "Sam Allardyce"], answer: 0 }
  ],
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// 6 random general + 2 nation-specific = 8 total, different draw per player
export function buildQuizForPlayer(adoptedNation) {
  const general = shuffle(GENERAL_QUESTIONS).slice(0, 6);
  const nationSpecific = shuffle(NATION_QUESTIONS[adoptedNation] || []).slice(0, 2);
  return shuffle([...general, ...nationSpecific]);
}
// TEMP: load data manually
// TODO: enable fetching
const data = [
  {
    question: "What was Tandem previous name?",
    incorrect: ["Tandem", "Burger Shack", "Extraordinary Humans"],
    correct: "Devmynd",
  },
  {
    question: "In Shakespeare's play Julius Caesar, Caesar's last words were...",
    incorrect: ["Iacta alea est!", "Vidi, vini, vici", "Aegri somnia vana"],
    correct: "Et tu, Brute?",
  },
  {
    question: "A group of tigers are referred to as:",
    incorrect: ["Chowder", "Pride", "Destruction"],
    correct: "Ambush",
  },
  {
    question: "What is the top speed an average cat can travel?",
    incorrect: ["42 mph", "13 mph", "9 mph"],
    correct: "31 mph",
  },
  {
    question: "A cat can jump to _____ times its own height:",
    incorrect: ["3", "9", "7"],
    correct: "5",
  },
  {
    question: "What is the only letter that doesn't appear in a US state name?",
    incorrect: ["M", "Z", "X"],
    correct: "Q",
  },
  {
    question: "What is the name for a cow-bison hybrid?",
    incorrect: ["Cowson", "Bicow", "Mooson"],
    correct: "Beefalo",
  },
  {
    question: "What is the largest freshwater lake in the world?",
    incorrect: ["Lake Baikal", "Lake Michigan", "Lake Victoria"],
    correct: "Lake Superior",
  },

  {
    question: "In a website address bar, what does WWW stand for?",
    incorrect: ["Wild Wild West", "War World Web"],
    correct: "World Wide Web",
  },
  {
    question: "In a game of bingo, what number is represented by the name two little ducks?",
    incorrect: ["20", "55", "77"],
    correct: "22",
  },
  {
    question: "According to Greek mythology, who was the first woman on Earth?",
    incorrect: ["Lilith", "Eve", "Hera"],
    correct: "Pandora",
  },
  {
    question: "In which European city would you find Orly airport?",
    incorrect: ["London", "Belgium", "Munich"],
    correct: "Paris",
  },
  {
    question: "Where would you find the Sea of Tranquility?",
    incorrect: ["California", "Siberia", "China"],
    correct: "The Moon",
  },
  {
    question: "Which artist painted 'Girl with a Pearl Earrin'?",
    incorrect: ["Van Gogh", "Picasso", "Da Vinci"],
    correct: "Vermeer",
  },
  {
    question: "What is the official name for the 'hashtag' symbol?",
    incorrect: ["Number sign", "Hash Sign", "Pound"],
    correct: "Octothorpe",
  },
  {
    question: "Not American at all, where is apple pie from?",
    incorrect: ["Japan", "Ethiopia", "Canada"],
    correct: "England",
  },
  {
    question: "What is the national animal of Scotland?",
    incorrect: ["Bear", "Rabbit", "Seal"],
    correct: "Unicorn",
  },
  {
    question: "Where in the world is the only place where Canada is *due south*",
    incorrect: ["Alaska", "Russia", "Washington"],
    correct: "Detroit",
  },
  {
    question: "Approximately how many grapes go into a bottle of wine?",
    incorrect: ["500", "200", "1000"],
    correct: "700",
  },
  {
    question: "How much does a US One Dollar Bill cost to make?",
    incorrect: ["$0.25", "$1", "$5"],
    correct: "$0.05",
  },
  {
    question: "The Vatican bank has the only ATM in the world that allows users to do what?",
    incorrect: ["Receive withdrawls in rosary beads", "Vote for the Pope", "Purchase indulgences"],
    correct: "Perform transactions in Latin",
  },
];

// set constants
const roundLength = 10;
const numberOfAnswers = 4;
const maxJSONLength = data.length;

// select DOM elements
const questionEl = document.querySelector("#question");
const answerEls = document.querySelectorAll('[id^="option-"]');
const modal = document.querySelector(".modal");
const scoreEl = document.getElementById("score");
const modalScoreEl = document.querySelector("#final-score");
const questionCounterEl = document.querySelector("#question-counter");
const newGameButton = document.querySelector(".play-new-btn");

const nextButton = document.querySelector(".next-btn");

/**
 * @desc randomly shuffles numbers from 0 to N-1 and from that the shuffled numbers
 *          chooses the subset of size numToChoose
 * @param number - N, numToChoose
 * @return array - a shuffled array of numbers
 */
function shuffle(N, numToChoose) {
  let seenNums = new Set();
  let shuffledQuestionsIdx = [];
  let i = 0;

  while (i < numToChoose) {
    // 1. generate a random number
    const currNum = Math.floor(Math.random() * Math.floor(N));

    // 2. check if random number has been seen before to avoid duplicates
    if (seenNums.has(currNum)) {
      continue;
    } else {
      seenNums.add(currNum);
      shuffledQuestionsIdx.push(currNum);
      i++;
    }
  }
  return shuffledQuestionsIdx;
}

/**
 * @desc starts a fresh trivia game with a new set of questions
 */
playGame = () => {
  questionCounter = 0;
  scoreSoFar = 0;
  modal.style.display = "none";

  selectedQuestionIdxs = shuffle(maxJSONLength, roundLength);

  getQuestion();
};

/**
 * @desc fills out the Q and A DOM elements with loaded JSON data
 */
getQuestion = () => {
  if (questionCounter < roundLength) {
    currQuestionIdx = selectedQuestionIdxs[questionCounter];
    currQuestion = data[currQuestionIdx];

    // 1. update the Q text
    question.innerText = currQuestion.question;

    // 2. prepare the answers
    currCorrectAns = currQuestion.correct;
    currAllAnswers = [...currQuestion.incorrect, currCorrectAns];

    shuffledAnsIdxs = shuffle(currAllAnswers.length, currAllAnswers.length);

    answerCounter = -1;

    answerEls.forEach((answer) => {
      answer.parentElement.classList.remove("correct", "incorrect");
      answer.parentElement.style.display = "block";

      // handle the case with less than 4 available answers:
      if (currAllAnswers[shuffledAnsIdxs[answerCounter + 1]] === undefined) {
        answer.parentElement.style.display = "none";
      } else {
        answer.innerText = currAllAnswers[shuffledAnsIdxs[answerCounter + 1]];
      }

      answerCounter++;

      answer.addEventListener("click", handleAnswerClick);
    });

    clicked = false;

    // display score and question number
    scoreEl.innerText = `Your score: ${scoreSoFar} / ${roundLength}`;
    questionCounterEl.innerText = `Question: ${questionCounter + 1} / ${roundLength}`;

    questionCounter++;
  } else {
    // handle end of game (no more available questions for this round)
    modal.style.display = "block";
    modalScoreEl.innerText = `Your final score: ${scoreSoFar} / ${roundLength}`;
  }
};

nextButton.addEventListener("click", getQuestion);
newGameButton.addEventListener("click", playGame);

/**
 * @desc handles click on an answer, both correct and incorrect
 */
handleAnswerClick = (e) => {
  if (clicked) return;

  clicked = true;

  const clickedAnswer = e.target;
  const ans = clickedAnswer.innerText;

  if (ans === currCorrectAns) {
    clickedAnswer.parentElement.classList.add("correct");
    scoreSoFar++;
  } else {
    clickedAnswer.parentElement.classList.add("incorrect");

    // go through all answers to highlight the correct one
    answerEls.forEach((answer) => {
      if (answer.innerText == currCorrectAns) {
        answer.parentElement.classList.add("correct");
      }
    });
  }
};

playGame();

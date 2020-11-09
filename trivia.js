// fetch data from provided json and start the game
fetch("data.json")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    const data = json;

    nextButton.addEventListener("click", () => getQuestion(data));
    newGameButton.addEventListener("click", () => playGame(data));

    playGame(data);
  })
  .catch((err) => {
    console.error(err);
  });

// set constants
const roundLength = 10;
const numberOfAnswers = 4;

// select DOM elements
const questionEl = document.querySelector("#question");
const answerEls = document.querySelectorAll('[id^="option-"]');
const modal = document.querySelector(".modal");
const scoreEl = document.getElementById("score");
const modalScoreEl = document.querySelector("#final-score");
const questionCounterEl = document.querySelector("#question-counter");
const newGameButton = document.querySelector(".play-new-btn");

const nextButton = document.querySelector(".next-btn");

// initiatlize variables
let clicked = false;
let questionCounter = 0;
let scoreSoFar = 0;
let currCorrectAns;
let selectedQuestionIdxs = [];

/**
 * @desc picks `numToChoose`-many non-duplicate randomly generated integers and saves them
 * @param number - N, numToChoose
 * @return array - a shuffled array of numbers
 */
const shuffle = (N, numToChoose) => {
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
};

/**
 * @desc starts a fresh trivia game with a new set of questions
 */
const playGame = (data) => {
  const maxJSONLength = data.length;
  questionCounter = 0;
  scoreSoFar = 0;
  modal.style.display = "none";

  selectedQuestionIdxs = shuffle(maxJSONLength, roundLength);

  getQuestion(data);
};

/**
 * @desc fills out the Q and A DOM elements with loaded JSON data
 */
const getQuestion = (data) => {
  if (questionCounter < roundLength) {
    let currQuestionIdx = selectedQuestionIdxs[questionCounter];
    let currQuestion = data[currQuestionIdx];

    // 1. update the Q text
    question.innerText = currQuestion.question;

    // 2. prepare the answers
    currCorrectAns = currQuestion.correct;
    let currAllAnswers = [...currQuestion.incorrect, currCorrectAns];

    let shuffledAnsIdxs = shuffle(currAllAnswers.length, currAllAnswers.length);

    let answerCounter = -1;

    // update answer elements' text and their styles
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

/**
 * @desc handles click on an answer, both correct and incorrect
 */
const handleAnswerClick = (e) => {
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

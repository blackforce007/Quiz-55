let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const quizContainer = document.getElementById("quiz-container");
const startScreen = document.getElementById("start-screen");
const resultContainer = document.getElementById("result-container");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("time");
const questionNumberEl = document.getElementById("question-number");

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);

async function loadQuestions() {
  const res = await fetch("questions.json");
  questions = await res.json();
}

async function startQuiz() {
  await loadQuestions();
  startScreen.classList.add("hide");
  quizContainer.classList.remove("hide");
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;

  const q = questions[currentQuestionIndex];
  questionNumberEl.textContent = `প্রশ্ন ${currentQuestionIndex + 1} / ${questions.length}`;
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.classList.add("answer-btn");
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(button, q.answer));
    answersEl.appendChild(button);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

function selectAnswer(selectedBtn, correctAnswer) {
  clearInterval(timer);
  const allBtns = document.querySelectorAll(".answer-btn");
  allBtns.forEach(btn => {
    btn.disabled = true;
    if(btn.textContent === correctAnswer){
      btn.classList.add("correct");
    }
    if(btn !== selectedBtn && btn.textContent !== correctAnswer){
      btn.classList.add("wrong");
    }
  });

  if(selectedBtn.textContent === correctAnswer){
    score += 10 + timeLeft; // base + time bonus
  }

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestionIndex++;
  if(currentQuestionIndex < questions.length){
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
  scoreEl.textContent = score;
  localStorage.setItem("lastScore", score);
}

function restartQuiz() {
  resultContainer.classList.add("hide");
  startScreen.classList.remove("hide");
}

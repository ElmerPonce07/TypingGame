const typingText = document.querySelector(".typing-text");
const inpField = document.querySelector(".wrapper .input-field");
const mistakeTag = document.querySelector(".mistake span");
const timeTag = document.querySelector(".time span b");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector("button");

let timer;
const maxTime = 60;
let timeLeft = maxTime;
let startTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;
let totalCharactersTyped = 0;
let totalWordsTyped = 0;

function randomParagraph() {
  if (!typingText) {
    console.error("Typing text element is not found.");
    return;
  }

  const randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = ""; // Clear previous content

  // Check if paragraphs[randIndex] is valid
  if (paragraphs[randIndex]) {
    typingText.innerHTML = paragraphs[randIndex]
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");

    // Reset state
    charIndex = 0;
    inpField.value = "";
    mistakes = 0;
    totalCharactersTyped = 0;
    totalWordsTyped = 0;
    mistakeTag.innerHTML = mistakes;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    isTyping = true;
    startTimer();
  } else {
    console.error("Selected paragraph is undefined or empty.");
  }
}

function startTimer() {
  if (timer) {
    clearInterval(timer);
  }

  timeLeft = maxTime;
  timeTag.innerText = timeLeft;
  startTime = new Date();

  timer = setInterval(initTimer, 1000);
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;

    const elapsedTimeInMinutes = (maxTime - timeLeft) / 60;
    const cpm = totalCharactersTyped / elapsedTimeInMinutes;
    const wpm = totalWordsTyped / elapsedTimeInMinutes || 0;

    cpmTag.innerText = Math.round(cpm);
    wpmTag.innerText = Math.round(wpm);
  } else {
    clearInterval(timer);
    isTyping = false;
  }
}

function initTyping() {
  if (!isTyping) return;

  const characters = typingText.querySelectorAll("span");
  const typedText = inpField.value.split("");

  characters.forEach((span) =>
    span.classList.remove("correct", "incorrect", "active")
  );

  let incorrectIndices = new Set();
  let wordCount = 0;

  typedText.forEach((char, index) => {
    if (index < characters.length) {
      if (characters[index].innerText === char) {
        characters[index].classList.add("correct");
        totalCharactersTyped++;
        if (char === " " || index === characters.length - 1) {
          wordCount++;
        }
      } else {
        characters[index].classList.add("incorrect");
        incorrectIndices.add(index);
      }
    }
  });

  if (wordCount > totalWordsTyped) {
    totalWordsTyped = wordCount;
  }

  mistakes = incorrectIndices.size;
  mistakeTag.innerHTML = mistakes;

  if (typedText.length < characters.length) {
    characters[typedText.length].classList.add("active");
  }

  charIndex = typedText.length;
}

function resetGame() {
 location.reload();
}

inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);

// Initialize with a random paragraph
randomParagraph();

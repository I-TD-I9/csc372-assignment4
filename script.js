let thinkingTimeoutId = null;
let thinkingIntervalId = null;
let isThinking = false;

const MOVES = ["rock", "paper", "scissors"];
const MOVE_IMG = {
  rock: "img/rock.png",
  paper: "img/paper.png",
  scissors: "img/scissors.png"
};

function clearSelection() {
  const choices = document.querySelectorAll(".choice");
  choices.forEach(function (choice) {
    choice.classList.remove("selected");
  });
}

function resultText(msg) {
  document.querySelector("#result-text").textContent = msg;
}

function computerSelection(move) {
  const img = document.querySelector("#computer-img");

  if (move === null) {
    img.src = "img/question-mark.png";
  } else {
    img.src = MOVE_IMG[move];
  }
}

function chooseRandomMove() {
  const idx = Math.floor(Math.random() * MOVES.length);
  return MOVES[idx];
}

function decideWinner(playerMove, computerMove) {
  if (playerMove === computerMove) {
    return "tie";
  }

  if (playerMove === "rock" && computerMove === "scissors") {
    return "win";
  }
  if (playerMove === "paper" && computerMove === "rock") {
    return "win";
  }
  if (playerMove === "scissors" && computerMove === "paper") {
    return "win";
  }

  return "loss";
}

function startThinking() {
  let frameIndex = 0;

  thinkingIntervalId = setInterval(function () {
    const img = document.querySelector("#computer-img");
    const move = MOVES[frameIndex];
    img.src = MOVE_IMG[move];
    frameIndex = (frameIndex + 1) % MOVES.length;
  }, 150);

  thinkingTimeoutId = setTimeout(finishRound, 3000);
}

function stopThinking() {
  if (thinkingIntervalId !== null) {
    clearInterval(thinkingIntervalId);
    thinkingIntervalId = null;
  }

  if (thinkingTimeoutId !== null) {
    clearTimeout(thinkingTimeoutId);
    thinkingTimeoutId = null;
  }
}

function finishRound() {
  stopThinking();

  const playerMove = document.querySelector("#player-section").getAttribute("data-player-move");
  const computerMove = chooseRandomMove();

  computerSelection(computerMove);

  const outcome = decideWinner(playerMove, computerMove);
  if (outcome === "win") {
    resultText("You win!");
  } else if (outcome === "loss") {
    resultText("You lose!");
  } else {
    resultText("It's a tie!");
  }

  document.querySelector("#play-again").disabled = false;
  isThinking = false;
}

function onChoiceClick(event) {
  if (isThinking) {
    return;
  }

  const figure = event.currentTarget;
  const move = figure.getAttribute("data-move");

  clearSelection();
  figure.classList.add("selected");

  document.querySelector("#player-section").setAttribute("data-player-move", move);

  computerSelection(null);
  resultText("Thinking...");

  document.querySelector("#play-again").disabled = true;

  isThinking = true;
  startThinking();
}

function onPlayAgain() {
  if (isThinking) {
    return;
  }
  clearSelection();
  document.querySelector("#player-section").removeAttribute("data-player-move");
  document.querySelector("#computer-img").src = "img/question-mark.png";
  document.querySelector("#result-text").textContent = "Make a choice!";
  document.querySelector("#play-again").disabled = true;
}

const choices = document.querySelectorAll(".choice");
choices.forEach(function (choice) {
  choice.addEventListener("click", onChoiceClick);
});

document.querySelector("#play-again").addEventListener("click", onPlayAgain);

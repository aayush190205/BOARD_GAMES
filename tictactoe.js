// ====================== Variables ======================
let currentPlayer = "X";
let board = Array(9).fill("");
let gameActive = false;
let timerEnabled = false;
let timerSeconds = 10;
let timerId = null;
let timeLeft = 0;
let scores = { X: 0, O: 0, D: 0 };
let playerNames = { X: "Player X", O: "Player O" };
let tournamentMode = false;
let roundsPlayed = 0;
let tournamentWins = { X: 0, O: 0 };
let aiEnabled = false;
let aiDifficulty = "hard";
let aiFirst = false;
let firstMoveDone = false;

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const timerBox = document.getElementById("timerBox");
const nameXEl = document.getElementById("nameX");
const nameOEl = document.getElementById("nameO");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDEl = document.getElementById("scoreD");

const playHumanBtn = document.getElementById("playHuman");
const playAIBtn = document.getElementById("playAI");
const restartBtn = document.getElementById("restart");
const backMenuBtn = document.getElementById("backMenu");
const themeToggle = document.getElementById("themeToggle");

const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const enableTimerInput = document.getElementById("enableTimer");
const timerSecondsInput = document.getElementById("timerSeconds");
const tournamentModeInput = document.getElementById("tournamentMode");

const aiOptions = document.getElementById("aiOptions");
const aiDifficultyInput = document.getElementById("aiDifficulty");
const aiFirstInput = document.getElementById("aiFirst");

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ====================== Start Game ======================
function startGame(vsAI = false) {
  aiEnabled = vsAI;
  aiDifficulty = aiDifficultyInput.value;
  aiFirst = aiFirstInput.checked;
  firstMoveDone = false;

  const nameX = playerXInput.value.trim();
  const nameO = playerOInput.value.trim();

  if (vsAI) {
    if (aiFirst) {
      playerNames.X = "Computer";
      playerNames.O = nameO || "Player O";
      currentPlayer = "X";
    } else {
      playerNames.X = nameX || "Player X";
      playerNames.O = "Computer";
      currentPlayer = "X";
    }
  } else {
    playerNames.X = nameX || "Player X";
    playerNames.O = nameO || "Player O";
    currentPlayer = "X";
  }

  nameXEl.textContent = playerNames.X;
  nameOEl.textContent = playerNames.O;

  timerEnabled = enableTimerInput.checked;
  timerSeconds = Math.max(3, Math.min(60, parseInt(timerSecondsInput.value || "10", 10)));
  timerBox.textContent = timerEnabled ? `Timer: ${timerSeconds}s` : "Timer: —";

  tournamentMode = tournamentModeInput.checked;
  roundsPlayed = 0;
  tournamentWins = { X: 0, O: 0 };

  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetBoard(true);
}

// ====================== Reset Board ======================
function resetBoard(startNew = false) {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  firstMoveDone = false;

  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = String(i);
    cell.addEventListener("click", onCellClick, { once: true });
    boardEl.appendChild(cell);
  }

  updateStatus(`${playerNames[currentPlayer]}'s Turn (${currentPlayer})`);

  stopTimer();
  if (timerEnabled) startTurnTimer();

  // Trigger AI move if AI plays first
  if (aiEnabled) {
    const aiMarker = aiFirst ? "X" : "O";
    if (currentPlayer === aiMarker && !firstMoveDone) {
      setTimeout(() => {
        const move = bestAIMove(aiMarker);
        makeMove(move, aiMarker);
        firstMoveDone = true;
      }, 300);
    }
  }
}

// ====================== Cell Click ======================
function onCellClick(e) {
  if (!gameActive) return;
  const idx = Number(e.currentTarget.dataset.index);
  if (board[idx] !== "") return;

  makeMove(idx, currentPlayer);
}

// ====================== Make Move ======================
function makeMove(idx, player) {
  board[idx] = player;
  const cell = boardEl.querySelector(`.cell[data-index="${idx}"]`);
  if (cell) {
    cell.textContent = player;
    cell.classList.add("disabled");
  }

  if (checkWinFor(player)) {
    endGame(`${playerNames[player]} Wins!`, player);
    return;
  }

  if (board.every(v => v !== "")) {
    endGame("It's a Draw!", "D");
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  updateStatus(`${playerNames[currentPlayer]}'s Turn (${currentPlayer})`);

  stopTimer();
  if (timerEnabled) startTurnTimer();

  // AI move
  if (aiEnabled && gameActive) {
    const aiMarker = aiFirst ? "X" : "O";
    if (currentPlayer === aiMarker) {
      setTimeout(() => {
        const move = bestAIMove(aiMarker);
        makeMove(move, aiMarker);
      }, 300);
    }
  }
}

// ====================== Check Win ======================
function checkWinFor(p) {
  return WIN_LINES.some(line => line.every(i => board[i] === p));
}

// ====================== End Game ======================
function endGame(message, resultKey) {
  gameActive = false;
  updateStatus(message);

  const cells = [...document.querySelectorAll(".cell")];
  const winLine = WIN_LINES.find(line => line.every(i => board[i] === resultKey));
  if (winLine && resultKey !== "D") winLine.forEach(i => cells[i].classList.add("win"));

  if (resultKey === "X" || resultKey === "O") {
    scores[resultKey] += 1;
    if (tournamentMode) tournamentWins[resultKey] += 1;
  } else {
    scores.D += 1;
  }
  renderScores();
  stopTimer();

  if (tournamentMode) {
    roundsPlayed++;
    if (tournamentWins.X === 2 || tournamentWins.O === 2 || roundsPlayed >= 3) {
      alert(`Tournament Over!\nWinner: ${tournamentWins.X > tournamentWins.O ? playerNames.X : (tournamentWins.O > tournamentWins.X ? playerNames.O : "Draw")}`);
      backMenuBtn.click();
      return;
    } else {
      setTimeout(() => resetBoard(true), 1000);
    }
  }
}

// ====================== Scores ======================
function renderScores() {
  scoreXEl.textContent = String(scores.X);
  scoreOEl.textContent = String(scores.O);
  scoreDEl.textContent = String(scores.D);
}

// ====================== Status ======================
function updateStatus(text) { statusEl.textContent = text; }

// ====================== Timer ======================
function startTurnTimer() {
  stopTimer();
  timeLeft = timerSeconds;
  timerBox.textContent = `Timer: ${timeLeft}s`;
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerBox.textContent = `Timer: ${timeLeft}s`;
    if (timeLeft <= 0) {
      stopTimer();
      autoMoveForCurrent();
    }
  }, 1000);
}

function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

function autoMoveForCurrent() {
  if (!gameActive) return;
  const empty = board.map((v,i)=>v===""?i:-1).filter(i=>i!==-1);
  if (empty.length===0) return;
  const idx = empty[Math.floor(Math.random()*empty.length)];
  makeMove(idx, currentPlayer);
}

// ====================== AI Logic ======================
// ====================== AI Logic ======================
function bestAIMove(aiMarker) {
  const humanMarker = aiMarker === "X" ? "O" : "X";
  const empty = board.map((v,i)=>v===""?i:-1).filter(i=>i!==-1);

  let depthLimit;
  if (aiDifficulty === "easy") depthLimit = 1;
  else if (aiDifficulty === "medium") depthLimit = 3;
  else depthLimit = Infinity; // hard

  let bestScore = -Infinity;
  let bestMoves = [];

  for (const idx of empty) {
    board[idx] = aiMarker;
    const score = minimax(board, 0, false, aiMarker, humanMarker, depthLimit);
    board[idx] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMoves = [idx];
    } else if (score === bestScore) {
      bestMoves.push(idx);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function minimax(newBoard, depth, isMax, aiMarker, humanMarker, depthLimit, alpha = -Infinity, beta = Infinity) {
  // Terminal states
  if (checkWinFor(aiMarker)) return 10 - depth;
  if (checkWinFor(humanMarker)) return depth - 10;
  if (newBoard.every(v => v !== "")) return 0;

  // Depth cutoff for easier AI
  if (depth >= depthLimit) {
    return heuristicScore(newBoard, aiMarker, humanMarker);
  }

  const empty = newBoard.map((v, i) => v === "" ? i : -1).filter(i => i !== -1);

  if (isMax) {
    let best = -Infinity;
    for (const idx of empty) {
      newBoard[idx] = aiMarker;
      const score = minimax(newBoard, depth + 1, false, aiMarker, humanMarker, depthLimit, alpha, beta);
      newBoard[idx] = "";
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of empty) {
      newBoard[idx] = humanMarker;
      const score = minimax(newBoard, depth + 1, true, aiMarker, humanMarker, depthLimit, alpha, beta);
      newBoard[idx] = "";
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  }
}


// Simple heuristic to make easy/medium weaker
function heuristicScore(board, aiMarker, humanMarker) {
  const center = 4;
  const corners = [0,2,6,8];
  let score = 0;

  if (board[center] === aiMarker) score += 2;
  if (corners.some(c => board[c] === aiMarker)) score += 1;

  if (board[center] === humanMarker) score -= 2;
  if (corners.some(c => board[c] === humanMarker)) score -= 1;

  return score;
}

// ====================== Event Listeners ======================
playHumanBtn.addEventListener("click", () => {
  aiOptions.classList.add("hidden");
  startGame(false);
});

playAIBtn.addEventListener("click", () => {
  aiOptions.classList.remove("hidden");
  startGame(true);
});

restartBtn.addEventListener("click", () => resetBoard(false));

backMenuBtn.addEventListener("click", () => {
  stopTimer();
  gameActive = false;
  gameScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeToggle.textContent = `Theme: ${isLight ? "Light" : "Royal"}`;
});


renderScores();



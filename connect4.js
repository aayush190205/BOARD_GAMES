/* Connect 4 game script */

// Board size
const ROWS = 6;
const COLS = 7;

// Game state
let board = [];
let currentPlayer = "R"; // R = Red, Y = Yellow
let gameActive = false;

let timerEnabled = false;
let timerSeconds = 10;
let timerId = null;
let timeLeft = 0;

let scores = { R: 0, Y: 0, D: 0 };
let playerNames = { R: "Red", Y: "Yellow" };

let tournamentMode = false;
let roundsPlayed = 0;
let tournamentWins = { R: 0, Y: 0 };

let aiEnabled = false;
let aiDifficulty = "hard";
let aiFirst = false;

// DOM
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const timerBox = document.getElementById("timerBox");
const nameREl = document.getElementById("nameR");
const nameYEl = document.getElementById("nameY");
const scoreREl = document.getElementById("scoreR");
const scoreYEl = document.getElementById("scoreY");
const scoreDEl = document.getElementById("scoreD");

const playHumanBtn = document.getElementById("playHuman");
const playAIBtn = document.getElementById("playAI");
const restartBtn = document.getElementById("restart");
const backMenuBtn = document.getElementById("backMenu");
const themeToggle = document.getElementById("themeToggle");

const playerRedInput = document.getElementById("playerRed");
const playerYellowInput = document.getElementById("playerYellow");
const enableTimerInput = document.getElementById("enableTimer");
const timerSecondsInput = document.getElementById("timerSeconds");
const tournamentModeInput = document.getElementById("tournamentMode");

const aiOptions = document.getElementById("aiOptions");
const aiDifficultyInput = document.getElementById("aiDifficulty");
const aiFirstInput = document.getElementById("aiFirst");

// Utilities
function createEmptyBoard() {
  const b = [];
  for (let r = 0; r < ROWS; r++) {
    b.push(new Array(COLS).fill(null));
  }
  return b;
}

function copyBoard(b) {
  return b.map(row => row.slice());
}

// Start game
function startGame(vsAI = false) {
  aiEnabled = vsAI;
  aiDifficulty = aiDifficultyInput.value;
  aiFirst = aiFirstInput.checked;

  const rName = playerRedInput.value.trim();
  const yName = playerYellowInput.value.trim();

  if (vsAI) {
    if (aiFirst) {
      playerNames.R = "Computer";
      playerNames.Y = yName || "Yellow";
    } else {
      playerNames.R = rName || "Red";
      playerNames.Y = "Computer";
    }
  } else {
    playerNames.R = rName || "Red";
    playerNames.Y = yName || "Yellow";
  }
   currentPlayer = "R";

  nameREl.textContent = playerNames.R;
  nameYEl.textContent = playerNames.Y;

  timerEnabled = enableTimerInput.checked;
  timerSeconds = Math.max(3, Math.min(60, parseInt(timerSecondsInput.value || "10", 10)));
  timerBox.textContent = timerEnabled ? `Timer: ${timerSeconds}s` : "Timer: —";

  tournamentMode = tournamentModeInput.checked;
  roundsPlayed = 0;
  tournamentWins = { R: 0, Y: 0 };

  menuScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resetBoard(true);
}

// Reset board
function resetBoard(startNew = false) {
  board = createEmptyBoard();
  currentPlayer = "R";
  gameActive = true;

  boardEl.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const slot = document.createElement("div");
      slot.className = "connect4-slot";
      slot.dataset.row = r;
      slot.dataset.col = c;
      slot.addEventListener("click", onSlotClick);
      boardEl.appendChild(slot);
    }
  }

  updateStatus(`${playerNames[currentPlayer]}'s Turn`);

  stopTimer();
  if (timerEnabled) startTurnTimer();

  // If AI plays first, let it move
  if (aiEnabled && gameActive) {
    const aiMarker = playerNames.R === "Computer" ? "R" : "Y";
    if (currentPlayer === aiMarker) {
      setTimeout(aiMove, 350);
    }
  }
}

// Handle click (drop in column)
function onSlotClick(e) {
  if (!gameActive) return;
  const col = Number(e.currentTarget.dataset.col);
  handlePlayerMove(col);
}

function handlePlayerMove(col) {
  if (!gameActive) return;

  // *** BUG FIX 1: Prevent human from moving during AI's turn ***
  if(aiEnabled) {
      const aiColor = playerNames.R === "Computer" ? "R" : "Y";
      if(currentPlayer === aiColor) return;
  }

  const row = getDropRow(board, col);
  if (row === -1) return; // Column is full

  placePiece(row, col, currentPlayer);
  renderBoard();

  if (checkWin(board, currentPlayer)) {
    endGame(`${playerNames[currentPlayer]} Wins!`, currentPlayer);
    return;
  }
  if (isBoardFull(board)) {
    endGame("It's a Draw!", "D");
    return;
  }

  currentPlayer = currentPlayer === "R" ? "Y" : "R";
  updateStatus(`${playerNames[currentPlayer]}'s Turn`);
  stopTimer();
  if (timerEnabled) startTurnTimer();

  if (aiEnabled && gameActive) {
    const aiMarker = playerNames.R === "Computer" ? "R" : "Y";
    if (currentPlayer === aiMarker) {
      setTimeout(aiMove, 500);
    }
  }
}

function getDropRow(b, col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (b[r][col] === null) return r;
  }
  return -1;
}

function placePiece(r, c, marker) {
  board[r][c] = marker;
}

// *** BUG FIX 2: Correctly render pieces by adding them, not modifying them ***
function renderBoard() {
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            if(cell !== null) {
                const slot = boardEl.querySelector(`[data-row='${r}'][data-col='${c}']`);
                // Only add a piece element if the slot doesn't have one yet
                if (!slot.querySelector('.piece')) {
                    const piece = document.createElement("div");
                    piece.className = "piece";
                    piece.classList.add(cell === "R" ? "red" : "yellow");
                    slot.appendChild(piece);
                    slot.classList.add("disabled");
                }
            }
        });
    });
}

// Game end
function endGame(message, resultKey) {
  gameActive = false;
  updateStatus(message);

  if (resultKey === "R" || resultKey === "Y") {
    scores[resultKey] += 1;
    if (tournamentMode) tournamentWins[resultKey] += 1;
  } else {
    scores.D += 1;
  }
  renderScores();
  stopTimer();

  if (tournamentMode) {
    roundsPlayed++;
    const winner = tournamentWins.R > tournamentWins.Y ? playerNames.R : (tournamentWins.Y > tournamentWins.R ? playerNames.Y : "Draw");
    if (tournamentWins.R === 2 || tournamentWins.Y === 2 || (roundsPlayed >= 3 && tournamentWins.R !== tournamentWins.Y)) {
      setTimeout(() => {
        alert(`Tournament Over!\nWinner: ${winner}`);
        backMenuBtn.click();
      }, 1500);
      return;
    } else {
      setTimeout(() => resetBoard(true), 1500);
    }
  }
}

function renderScores() {
  scoreREl.textContent = String(scores.R);
  scoreYEl.textContent = String(scores.Y);
  scoreDEl.textContent = String(scores.D);
}

function updateStatus(text) { statusEl.textContent = text; }

// Timer
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
  const legalCols = getLegalCols(board);
  if (!legalCols.length) return;
  const col = legalCols[Math.floor(Math.random() * legalCols.length)];
  handlePlayerMove(col);
}

// Board utilities
function isBoardFull(b) {
  return b[0].every(cell => cell !== null);
}

function checkWin(b, marker) {
  // horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (b[r][c] === marker && b[r][c+1] === marker && b[r][c+2] === marker && b[r][c+3] === marker) return true;
    }
  }
  // vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      if (b[r][c] === marker && b[r+1][c] === marker && b[r+2][c] === marker && b[r+3][c] === marker) return true;
    }
  }
  // diag down-right
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (b[r][c] === marker && b[r+1][c+1] === marker && b[r+2][c+2] === marker && b[r+3][c+3] === marker) return true;
    }
  }
  // diag down-left
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 3; c < COLS; c++) {
      if (b[r][c] === marker && b[r+1][c-1] === marker && b[r+2][c-2] === marker && b[r+3][c-3] === marker) return true;
    }
  }
  return false;
}

// ============ AI ============
function scorePosition(b, marker) {
  const opp = marker === "R" ? "Y" : "R";
  let score = 0;

  const centerCol = Math.floor(COLS/2);
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) if (b[r][centerCol] === marker) centerCount++;
  score += centerCount * 3;

  function evalWindow(window) {
    const countMarker = window.filter(x => x === marker).length;
    const countOpp = window.filter(x => x === opp).length;
    const countEmpty = window.filter(x => x === null).length;
    if (countMarker === 4) return 10000;
    if (countMarker === 3 && countEmpty === 1) return 5;
    if (countMarker === 2 && countEmpty === 2) return 2;
    if (countOpp === 3 && countEmpty === 1) return -4;
    return 0;
  }

  // horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [b[r][c], b[r][c+1], b[r][c+2], b[r][c+3]];
      score += evalWindow(window);
    }
  }
  // vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS - 3; r++) {
      const window = [b[r][c], b[r+1][c], b[r+2][c], b[r+3][c]];
      score += evalWindow(window);
    }
  }
  // diag down-right
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window = [b[r][c], b[r+1][c+1], b[r+2][c+2], b[r+3][c+3]];
      score += evalWindow(window);
    }
  }
  // diag down-left
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 3; c < COLS; c++) {
      const window = [b[r][c], b[r+1][c-1], b[r+2][c-2], b[r+3][c-3]];
      score += evalWindow(window);
    }
  }

  return score;
}

function getLegalCols(b) {
  const cols = [];
  for (let c = 0; c < COLS; c++) if (getDropRow(b, c) !== -1) cols.push(c);
  return cols;
}

function minimax(b, depth, alpha, beta, maximizingPlayer, aiMarker, depthLimit) {
  const validCols = getLegalCols(b);
  const isTerminal = checkWin(b, "R") || checkWin(b, "Y") || validCols.length === 0;

  if (depth >= depthLimit || isTerminal) {
    if (isTerminal) {
      if (checkWin(b, aiMarker)) return { score: 1000000 - depth };
      if (checkWin(b, aiMarker === "R" ? "Y" : "R")) return { score: -1000000 + depth };
      return { score: 0 };
    } else {
      return { score: scorePosition(b, aiMarker) };
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = validCols[Math.floor(Math.random() * validCols.length)];
    for (const col of validCols) {
      const row = getDropRow(b, col);
      const bCopy = copyBoard(b);
      bCopy[row][col] = aiMarker;
      const newScore = minimax(bCopy, depth + 1, alpha, beta, false, aiMarker, depthLimit).score;
      if (newScore > value) { value = newScore; column = col; }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, column };
  } else {
    let value = Infinity;
    let column = validCols[Math.floor(Math.random() * validCols.length)];
    const opp = aiMarker === "R" ? "Y" : "R";
    for (const col of validCols) {
      const row = getDropRow(b, col);
      const bCopy = copyBoard(b);
      bCopy[row][col] = opp;
      const newScore = minimax(bCopy, depth + 1, alpha, beta, true, aiMarker, depthLimit).score;
      if (newScore < value) { value = newScore; column = col; }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { score: value, column };
  }
}

// Choose AI move
function aiMove() {
  if (!gameActive) return;
  
  const aiColor = playerNames.R === "Computer" ? "R" : "Y";
  const humanColor = aiColor === "R" ? "Y" : "R";

  // AI's move logic, not the human's
  const aiPlayerMove = (col) => {
    if (!gameActive) return;
    const row = getDropRow(board, col);
    if (row === -1) return;

    placePiece(row, col, currentPlayer);
    renderBoard();

    if (checkWin(board, currentPlayer)) {
      endGame(`${playerNames[currentPlayer]} Wins!`, currentPlayer);
      return;
    }
    if (isBoardFull(board)) {
      endGame("It's a Draw!", "D");
      return;
    }

    currentPlayer = humanColor;
    updateStatus(`${playerNames[currentPlayer]}'s Turn`);
    stopTimer();
    if (timerEnabled) startTurnTimer();
  }


  if (aiDifficulty === "easy") {
    const legal = getLegalCols(board);
    const col = legal[Math.floor(Math.random() * legal.length)];
    aiPlayerMove(col);
    return;
  }

  let depthLimit;
  if (aiDifficulty === "medium") depthLimit = 4;
  else depthLimit = 7; 

  const result = minimax(board, 0, -Infinity, Infinity, true, aiColor, depthLimit);
  const chosenCol = (result && typeof result.column !== "undefined") ? result.column : (getLegalCols(board)[0] || 0);

  aiPlayerMove(chosenCol);
}

// Event listeners
playHumanBtn.addEventListener("click", () => startGame(false));

playAIBtn.addEventListener("click", () => startGame(true));

restartBtn.addEventListener("click", () => resetBoard(false));

backMenuBtn.addEventListener("click", () => {
  stopTimer();
  gameActive = false;
  gameScreen.classList.add("hidden");
  menuScreen.classList.remove("hidden");
});

themeToggle.addEventListener("click", () => {
  const light = document.body.classList.toggle("light-theme");
  themeToggle.textContent = `Theme: ${light ? "Light" : "Royal"}`;
});

// Initialize scores on load
renderScores();
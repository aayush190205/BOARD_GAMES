// --- Auth Check ---
authCheck();
document.getElementById("logoutBtn").addEventListener("click", handleLogout);

// --- DOM Elements ---
const tttBoardEl = document.getElementById("tttBoard");
const c4BoardEl = document.getElementById("c4Board");
const titleEl = document.getElementById("replayTitle");
const subtitleEl = document.getElementById("replaySubtitle");
const controlsEl = document.getElementById("controls");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// --- Replay State ---
let replay;
let moves;
let currentMove = 0;
let replayInterval = null;
const REPLAY_SPEED = 1000; // 1 second per move

// --- 1. Get Replay from URL ---
function loadReplay() {
  const urlParams = new URLSearchParams(window.location.search);
  const replayId = Number(urlParams.get('id'));

  if (!replayId) {
    subtitleEl.textContent = "Error: No replay ID provided.";
    return;
  }

  const allReplays = getDb("gameReplays");
  const userReplays = allReplays[loggedInUser];
  replay = userReplays.find(r => r.id === replayId);

  if (!replay) {
    subtitleEl.textContent = "Error: Replay not found.";
    return;
  }

  moves = replay.moves;
  initBoard();
}

// --- 2. Initialize Board ---
function initBoard() {
  currentMove = 0;
  controlsEl.classList.remove("hidden");
  subtitleEl.textContent = `${replay.game} vs ${replay.opponent} (${replay.result})`;
  
  if (replay.game === "Tic Tac Toe") {
    tttBoardEl.classList.remove("hidden");
    c4BoardEl.classList.add("hidden");
    tttBoardEl.innerHTML = "";
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.index = String(i);
      tttBoardEl.appendChild(cell);
    }
  } else { // Connect 4
    c4BoardEl.classList.remove("hidden");
    tttBoardEl.classList.add("hidden");
    c4BoardEl.innerHTML = "";
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        const slot = document.createElement("div");
        slot.className = "connect4-slot";
        slot.dataset.row = r;
        slot.dataset.col = c;
        c4BoardEl.appendChild(slot);
      }
    }
  }
}

// --- 3. Replay Controls ---
function play() {
  pause(); // Clear any existing interval
  if (currentMove >= moves.length) return; // Replay finished

  replayInterval = setInterval(nextMove, REPLAY_SPEED);
  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
}

function pause() {
  clearInterval(replayInterval);
  replayInterval = null;
  playBtn.classList.remove("hidden");
  pauseBtn.classList.add("hidden");
}

function reset() {
  pause();
  initBoard();
}

function nextMove() {
  if (currentMove >= moves.length) {
    pause();
    subtitleEl.textContent = "Replay finished!";
    return;
  }

  const move = moves[currentMove];
  
  if (replay.game === "Tic Tac Toe") {
    const cell = tttBoardEl.querySelector(`.cell[data-index="${move.index}"]`);
    if (cell) {
      cell.innerHTML = `<span>${move.player}</span>`;
      cell.classList.add("disabled");
    }
  } else { // Connect 4
    // Find the *actual* row the piece landed in
    const c = move.col;
    let r = 5; // Start from bottom
    while (r >= 0) {
        const slot = c4BoardEl.querySelector(`[data-row='${r}'][data-col='${c}']`);
        if (!slot.hasChildNodes()) {
            // This is the correct slot
            const piece = document.createElement("div");
            piece.className = "piece";
            piece.classList.add(move.player === "R" ? "red" : "yellow");
            slot.appendChild(piece);
            break; // Exit loop
        }
        r--; // Move up one row
    }
  }
  
  currentMove++;
  if (currentMove === moves.length) {
      pause();
      subtitleEl.textContent = "Replay finished!";
  }
}

// --- Event Listeners ---
playBtn.addEventListener("click", play);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);

// --- Load on page start ---
loadReplay();

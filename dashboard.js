// --- Auth Check ---
authCheck();
document.getElementById("logoutBtn").addEventListener("click", handleLogout);

// --- Set Title ---
const dashTitle = document.getElementById("dashTitle");
if (loggedInUser) {
  dashTitle.textContent = `${loggedInUser}'s Dashboard`;
}

// --- Chart Colors ---
// Get CSS variables for chart colors
const style = getComputedStyle(document.body);
const colorNeon = style.getPropertyValue('--accent-neon');
const colorDanger = style.getPropertyValue('--danger-color');
const colorMuted = style.getPropertyValue('--text-muted');
const colorText = style.getPropertyValue('--text-light');

Chart.defaults.color = colorText;
Chart.defaults.borderColor = style.getPropertyValue('--line-color');

// --- 1. Load Stats & Render Charts ---
function loadStats() {
  const allStats = getDb("gameStats");
  if (!allStats || !allStats[loggedInUser]) {
    console.error("No stats found for user");
    return;
  }
  const userStats = allStats[loggedInUser];
  
  // --- Tic Tac Toe Chart ---
  const tttCtx = document.getElementById('tttChart').getContext('2d');
  const tttData = userStats.ticTacToe;
  if (tttData.wins === 0 && tttData.losses === 0 && tttData.draws === 0) {
      document.getElementById('tttChart').parentElement.innerHTML = "<h3>Tic Tac Toe</h3><p>No AI games played yet.</p>";
  } else {
      new Chart(tttCtx, {
        type: 'pie',
        data: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [{
            label: 'Tic Tac Toe',
            data: [tttData.wins, tttData.losses, tttData.draws],
            backgroundColor: [colorNeon, colorDanger, colorMuted]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Tic Tac Toe (vs AI)' }
          }
        }
      });
  }

  // --- Connect 4 Chart ---
  const c4Ctx = document.getElementById('c4Chart').getContext('2d');
  const c4Data = userStats.connect4;
   if (c4Data.wins === 0 && c4Data.losses === 0 && c4Data.draws === 0) {
      document.getElementById('c4Chart').parentElement.innerHTML = "<h3>Connect 4</h3><p>No AI games played yet.</p>";
  } else {
      new Chart(c4Ctx, {
        type: 'pie',
        data: {
          labels: ['Wins', 'Losses', 'Draws'],
          datasets: [{
            label: 'Connect 4',
            data: [c4Data.wins, c4Data.losses, c4Data.draws],
            backgroundColor: [colorNeon, colorDanger, colorMuted]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Connect 4 (vs AI)' }
          }
        }
      });
  }
}

// --- 2. Load Replays ---
function loadReplays() {
  const allReplays = getDb("gameReplays");
  const replayListEl = document.getElementById("replayList");
  
  if (!allReplays || !allReplays[loggedInUser] || allReplays[loggedInUser].length === 0) {
    replayListEl.innerHTML = "<p>No replays saved. Go play a game!</p>";
    return;
  }
  
  const userReplays = allReplays[loggedInUser];
  replayListEl.innerHTML = ""; // Clear list
  
  userReplays.forEach(replay => {
    const li = document.createElement("li");
    li.className = "replay-item";
    
    li.innerHTML = `
      <div class="replay-item-info">
        <strong>${replay.game}</strong> vs ${replay.opponent}<br>
        <span>${replay.result} on ${replay.date}</span>
      </div>
      <a href="replay.html?id=${replay.id}" class="btn">Watch</a>
    `;
    replayListEl.appendChild(li);
  });
}


// --- Run on page load ---
loadStats();
loadReplays();

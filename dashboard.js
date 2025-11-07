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
      // Updated to just show a message inside the canvas's parent
      document.getElementById('tttChart').parentElement.innerHTML = "<h2>Tic Tac Toe Stats</h2><p style='padding: 20px 0; text-align: center;'>No AI games played yet.</p>";
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
            title: { display: false } // Title is in HTML H2 now
          }
        }
      });
  }

  // --- Connect 4 Chart ---
  const c4Ctx = document.getElementById('c4Chart').getContext('2d');
  const c4Data = userStats.connect4;
   if (c4Data.wins === 0 && c4Data.losses === 0 && c4Data.draws === 0) {
      // Updated to just show a message inside the canvas's parent
      document.getElementById('c4Chart').parentElement.innerHTML = "<h2>Connect 4 Stats</h2><p style='padding: 20px 0; text-align: center;'>No AI games played yet.</p>";
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
            title: { display: false } 
          }
        }
      });
  }
}


function loadReplays() {
  const allReplays = getDb("gameReplays");
  const replayListEl = document.getElementById("replayList");
  
  if (!allReplays || !allReplays[loggedInUser] || allReplays[loggedInUser].length === 0) {
    replayListEl.innerHTML = "<p style='padding: 20px 0; text-align: center;'>No replays saved. Go play a game!</p>";
    return;
  }
  
  const userReplays = allReplays[loggedInUser];
  replayListEl.innerHTML = ""; 
  
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

loadStats();
loadReplays();

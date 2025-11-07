// Check auth status (this is the auth page)
authCheck(true);

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

// --- Initialize DB if it doesn't exist ---
if (!getDb("gameHubUsers")) {
  setDb("gameHubUsers", []);
}
if (!getDb("gameStats")) {
  setDb("gameStats", {});
}
if (!getDb("gameReplays")) {
  setDb("gameReplays", {});
}

function showMessage(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function handleLogin(e) {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (!username || !password) {
    showMessage("Please enter both username and password.");
    return;
  }
  
  const users = getDb("gameHubUsers");
  const user = users.find(u => u.username === username);
  
  if (user && user.password === password) {
    // --- LOGIN SUCCESS ---
    localStorage.setItem("currentUser", user.username);
    window.location.href = 'hub.html';
  } else {
    // --- LOGIN FAIL ---
    showMessage("Invalid username or password.");
  }
}

function handleRegister() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (!username || !password) {
    showMessage("Please enter both username and password.");
    return;
  }

  const users = getDb("gameHubUsers");
  const userExists = users.some(u => u.username === username);
  
  if (userExists) {
    showMessage("Username already exists. Please try another.");
  } else {
    // --- REGISTER SUCCESS ---
    users.push({ username, password });
    setDb("gameHubUsers", users);
    
    // Also create empty stats & replay records
    const stats = getDb("gameStats");
    stats[username] = {
      ticTacToe: { wins: 0, losses: 0, draws: 0 },
      connect4: { wins: 0, losses: 0, draws: 0 }
    };
    setDb("gameStats", stats);
    
    const replays = getDb("gameReplays");
    replays[username] = [];
    setDb("gameReplays", replays);
    
    // Log them in
    localStorage.setItem("currentUser", username);
    window.location.href = 'hub.html';
  }
}

// --- Event Listeners ---
loginForm.addEventListener("submit", handleLogin);
registerBtn.addEventListener("click", handleRegister);

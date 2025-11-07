// Auth check (this is a protected page)
authCheck();

const welcomeTitle = document.getElementById("welcomeTitle");
const logoutBtn = document.getElementById("logoutBtn");

// Greet the user
if (loggedInUser) {
  welcomeTitle.textContent = `Welcome, ${loggedInUser}!`;
}

// Handle logout
logoutBtn.addEventListener("click", handleLogout);

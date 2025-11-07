
function getDb(key) {
  return JSON.parse(localStorage.getItem(key)) || null;
}

function setDb(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Auth & Session ---
const loggedInUser = localStorage.getItem("currentUser");

/**
 * Checks if a user is logged in.
 * If not, redirects to the login page (index.html).
 * @param {boolean} isAuthPage - Set to true if this is the login/register page itself.
 */
function authCheck(isAuthPage = false) {
  if (isAuthPage && loggedInUser) {
    // User is on login page but is already logged in
    window.location.href = 'hub.html';
  } else if (!isAuthPage && !loggedInUser) {
    // User is on a protected page but is not logged in
    alert("You must be logged in to view this page.");
    window.location.href = 'index.html';
  }
}

function handleLogout() {
  localStorage.removeItem("currentUser");
  window.location.href = 'index.html';
}

// --- Theme Management ---
const themeToggle = document.getElementById("themeToggle");

function applyTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    if (themeToggle) themeToggle.textContent = "Theme: Light";
  } else {
    document.body.classList.remove("light-theme");
    if (themeToggle) themeToggle.textContent = "Theme: Royal";
  }
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    if (isLight) {
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "Theme: Light";
    } else {
      localStorage.setItem("theme", "royal");
      themeToggle.textContent = "Theme: Royal";
    }
  });
}


applyTheme();

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  if (document.body.classList.contains("light-theme")) {
    themeToggle.textContent = "Theme: Light";
  } else {
    themeToggle.textContent = "Theme: Royal";
  }
});

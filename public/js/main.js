//toggle theme 
const mode = document.getElementById("modetoggle");
const setTheme = (theme) => {
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
  if (mode) {
    mode.src = theme === "dark" ? "images/light.png" : "images/dark.png";
  }
};
document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  const savedTheme = localStorage.getItem("theme") || "dark";//default to dark i think
  setTheme(savedTheme);
  if (mode) {
    mode.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  }
});
//displays current tab in navigation
function highlightActiveNav() {
  const links = document.querySelectorAll("nav a");
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.style.color = "#e10600";
    }
  });
}
//brand logo click to root
const logo = document.getElementById("brand");
if (logo) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
        window.location.href = "/";
    });
}
//logout here
document.addEventListener("DOMContentLoaded", async () => {
  const authLink = document.getElementById("auth-link");
  if (!authLink) 
    return;
  try {
    const res = await fetch("/auth/status");
    const data = await res.json();
    if (data.loggedIn) {
      authLink.innerHTML = `<a href="/auth/logout">Logout</a>`;
    } else {
      authLink.innerHTML = `<a href="/login">Login</a>`;
    }
  } catch (err) {
    console.error("Failed to get auth status", err);
  }
});
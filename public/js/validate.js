document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  if (!form) 
    return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const username = document.getElementById("username")?.value.trim();
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format.");
      return;
    }
    if (username !== undefined && username === "") {
      alert("Username is required.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters."); return;
    }
    if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter."); return;
    }
    if (!/[a-z]/.test(password)) {
      alert("Password must contain at least one lowercase letter."); return;
    }
    if (!/\d/.test(password)) {
      alert("Password must contain at least one number."); return;
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      alert("Password must contain at least one special character."); return;
    }
    console.log("passed!");
    form.submit();    
  });
});

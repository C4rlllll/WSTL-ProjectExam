document.addEventListener("DOMContentLoaded", () => {
 const loginForm = document.getElementById("loginForm");
 const cancelBtn = document.getElementById("cancelBtn");
 loginForm.addEventListener("submit", function (e) {
   e.preventDefault();
   const username = document.getElementById("username").value.trim();
   const password = document.getElementById("password").value.trim();
   const validUsername = "Carl";
   const validPassword = "1234";
   if (username === validUsername && password === validPassword) {
     alert("Login successful!");
     window.location.href = "shop.html";
   } else {
     alert("Invalid username or password.");
   }
 });
 cancelBtn.addEventListener("click", () => {
   loginForm.reset();
 });
});
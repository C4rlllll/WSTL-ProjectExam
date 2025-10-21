document.addEventListener("DOMContentLoaded", () => {
 // Q&A toggle
 document.querySelectorAll(".q").forEach(q => {
   q.addEventListener("click", () => {
     const a = q.nextElementSibling;
     const open = a.style.display === "block";
     document.querySelectorAll(".a").forEach(ans => ans.style.display = "none");
     a.style.display = open ? "none" : "block";
   });
 });
 // Terms modal
 const modal = document.getElementById("termsModal");
 const termsLink = document.getElementById("termsLink");
 const closeModal = document.getElementById("closeModal");
 termsLink.addEventListener("click", () => modal.style.display = "flex");
 closeModal.addEventListener("click", () => modal.style.display = "none");
 window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
});
document.addEventListener("DOMContentLoaded", () => {
 const cartCount = document.getElementById("cartCount");
 const bidModal = document.getElementById("bidModal");
 const successModal = document.getElementById("successModal");
 const itemNameEl = document.getElementById("itemName");
 const bidAmountInput = document.getElementById("bidAmount");
 const confirmBid = document.getElementById("confirmBid");
 const cancelBid = document.getElementById("cancelBid");
 const closeSuccess = document.getElementById("closeSuccess");
 let cart = JSON.parse(localStorage.getItem("cart")) || [];
 let currentProduct = null;
 cartCount.textContent = cart.length;
 // Countdown timer
 document.querySelectorAll(".product").forEach(product => {
   const timerEl = product.querySelector(".timer");
   const endTime = new Date(product.dataset.time).getTime();
   function updateTimer() {
     const now = new Date().getTime();
     const diff = endTime - now;
     if (diff <= 0) {
       timerEl.textContent = "Expired";
       return;
     }
     const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
     const minutes = Math.floor((diff / (1000 * 60)) % 60);
     const seconds = Math.floor((diff / 1000) % 60);
     timerEl.textContent = `${hours}:${minutes}:${seconds}s`;
     setTimeout(updateTimer, 1000);
   }
   updateTimer();
 });
 // When "Place Bid" clicked
 document.querySelectorAll(".bid-btn").forEach(btn => {
   btn.addEventListener("click", e => {
     currentProduct = e.target.closest(".product");
     itemNameEl.textContent = currentProduct.dataset.name;
     bidAmountInput.value = "";
     bidModal.style.display = "flex";
   });
 });
 // Confirm bid
 confirmBid.addEventListener("click", () => {
   const bidValue = parseFloat(bidAmountInput.value);
   if (!bidValue || bidValue <= 0) {
     alert("Please enter a valid bid amount.");
     return;
   }
   const name = currentProduct.dataset.name;
   const image = currentProduct.dataset.img;
   const currentBidDisplay = currentProduct.querySelector(".currentBid");
   currentBidDisplay.textContent = bidValue.toFixed(2);
   const item = { name, bidValue, image };
   cart.push(item);
   localStorage.setItem("cart", JSON.stringify(cart));
   cartCount.textContent = cart.length;
   bidModal.style.display = "none";
   successModal.style.display = "flex";
 });
 // Cancel bid
 cancelBid.addEventListener("click", () => {
   bidModal.style.display = "none";
 });
 // Close success modal
 closeSuccess.addEventListener("click", () => {
   successModal.style.display = "none";
 });
 window.addEventListener("click", (e) => {
   if (e.target === bidModal) bidModal.style.display = "none";
   if (e.target === successModal) successModal.style.display = "none";
 });
});
document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cartCount");
  const bidModal = document.getElementById("bidModal");
  const successModal = document.getElementById("successModal");
  const itemNameEl = document.getElementById("itemName");
  const modalCurrentBid = document.getElementById("modalCurrentBid"); // New helper element
  const bidAmountInput = document.getElementById("bidAmount");
  const confirmBid = document.getElementById("confirmBid");
  const cancelBid = document.getElementById("cancelBid");
  const closeSuccess = document.getElementById("closeSuccess");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let currentProduct = null;

  cartCount.textContent = cart.length;

  // --- 1. COUNTDOWN TIMER & EXPIRATION LOGIC ---
  document.querySelectorAll(".product").forEach(product => {
    const timerEl = product.querySelector(".timer");
    const bidBtn = product.querySelector(".bid-btn");
    const endTime = new Date(product.dataset.time).getTime();

    function updateTimer() {
      const now = new Date().getTime();
      const diff = endTime - now;

      // IF EXPIRED:
      if (diff <= 0) {
        timerEl.textContent = "EXPIRED";
        timerEl.style.color = "grey";
        
        // Disable the button visually and functionally
        if (bidBtn) {
          bidBtn.textContent = "Auction Ended";
          bidBtn.disabled = true; 
        }
        return; // Stop the timer
      }

      // Format Time
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;

      setTimeout(updateTimer, 1000);
    }

    updateTimer();
  });

  // --- 2. OPEN MODAL LOGIC ---
  document.querySelectorAll(".bid-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      // Find the specific product card
      currentProduct = e.target.closest(".product");
      
      const endTime = new Date(currentProduct.dataset.time).getTime();
      const now = new Date().getTime();

      // Double check expiration just in case
      if (now >= endTime) {
        alert("This auction has expired. You cannot bid.");
        btn.disabled = true;
        return;
      }

      // Get current price to show in modal
      const currentPriceSpan = currentProduct.querySelector(".currentBid");
      const currentPrice = parseFloat(currentPriceSpan.textContent);

      itemNameEl.textContent = currentProduct.dataset.name;
      modalCurrentBid.textContent = currentPrice.toFixed(2); // Show user what they must beat
      bidAmountInput.value = ""; // Clear previous input
      bidModal.style.display = "flex";
    });
  });

  // --- 3. CONFIRM BID LOGIC (Where we block low bids) ---
  confirmBid.addEventListener("click", () => {
    if (!currentProduct) return;

    // A. Re-check Expiration
    const endTime = new Date(currentProduct.dataset.time).getTime();
    const now = new Date().getTime();
    if (now >= endTime) {
      alert("Too late! The auction just expired.");
      bidModal.style.display = "none";
      currentProduct.querySelector(".bid-btn").disabled = true;
      return;
    }

    // B. Get Values
    const bidValue = parseFloat(bidAmountInput.value);
    const currentBidDisplay = currentProduct.querySelector(".currentBid");
    const currentBid = parseFloat(currentBidDisplay.textContent) || 0;

    // C. Validate Input Amount
    if (!bidValue || bidValue <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    // --- KEY LOGIC: BLOCK LOWER OR EQUAL BIDS ---
    if (bidValue <= currentBid) {
      alert(`⚠️ Bid too low!\n\nThe current price is ₱${currentBid.toFixed(2)}.\nYou must bid higher than this.`);
      return; // Stop here, do not add to cart
    }

  
    const name = currentProduct.dataset.name;
    const image = currentProduct.dataset.img;

    // Update the visual price on the HTML card
    currentBidDisplay.textContent = bidValue.toFixed(2);

    // Add to cart object
    const item = { name, bidValue, image };
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = cart.length;

    // Close Modal & Show Success
    bidModal.style.display = "none";
    successModal.style.display = "flex";
  });

  // --- 4. CLOSE MODALS ---
  cancelBid.addEventListener("click", () => {
    bidModal.style.display = "none";
  });

  closeSuccess.addEventListener("click", () => {
    successModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === bidModal) bidModal.style.display = "none";
    if (e.target === successModal) successModal.style.display = "none";
  });
});
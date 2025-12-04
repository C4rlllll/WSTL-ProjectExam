document.addEventListener("DOMContentLoaded", () => {
  let checkoutCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  const cartSummary = document.getElementById("cartSummary");
  const paymentSelect = document.getElementById("payment");

  let total = 0;
  cartSummary.innerHTML = "<h4>Order Summary</h4>";

  if (checkoutCart.length === 0) {
    const p = document.createElement("p");
    p.textContent = "You have no winning bids to checkout.";
    cartSummary.appendChild(p);
    document.getElementById("payBtn").disabled = true;
  } else {
    checkoutCart.forEach(item => {
      const p = document.createElement("p");
      p.innerHTML = `${item.name} <span>₱${Number(item.bidValue).toFixed(2)}</span>`;
      cartSummary.appendChild(p);
      total += Number(item.bidValue);
    });

    const totalP = document.createElement("p");
    totalP.innerHTML = `<strong>Total:</strong> <span>₱${total.toFixed(2)}</span>`;
    cartSummary.appendChild(totalP);
  }

  const cardFields = document.getElementById("cardFields");
  const paypalFields = document.getElementById("paypalFields");
  const cashFields = document.getElementById("cashFields");
  const gcashFields = document.getElementById("gcashFields");

  paymentSelect.addEventListener("change", () => {
    const method = paymentSelect.value;
    cardFields.style.display = method === "card" ? "block" : "none";
    paypalFields.style.display = method === "paypal" ? "block" : "none";
    cashFields.style.display = method === "cash" ? "block" : "none";
    gcashFields.style.display = method === "gcash" ? "block" : "none";
  });

  document.getElementById("payBtn").addEventListener("click", () => {
    
    if (checkoutCart.length === 0) return alert("No items to checkout.");
    if (paymentSelect.value === "") return alert("Please select a payment method.");

    let valid = true;
    if (paymentSelect.value === "card") {
      if (!document.getElementById("cardNumber").value || !document.getElementById("cvv").value) valid = false;
    } else if (paymentSelect.value === "cash") {
      const val = Number(document.getElementById("cashAmount").value);
      if (!val || val < total) valid = false;
    } else if (paymentSelect.value === "gcash") {
      const val = Number(document.getElementById("gcashAmount").value);
      if (!val || val < total) valid = false;
    }

    if (!valid) {
      alert("Please fill all fields correctly and ensure payment amount is enough.");
      return;
    }

    alert("✅ Payment successful! Thank you for your purchase.");

   
    let mainCart = JSON.parse(localStorage.getItem("cart")) || [];

  
    const WINNING_BID_THRESHOLD = 2500;

    let updatedCart = mainCart.filter(item => Number(item.bidValue) < WINNING_BID_THRESHOLD);


    if (updatedCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      localStorage.removeItem("cart"); 
    }

    localStorage.removeItem("checkoutCart");


    window.location.replace("shop.html");
  });
});
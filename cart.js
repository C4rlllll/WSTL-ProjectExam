document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cartItems");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const WINNING_BID_THRESHOLD = 2500;

    function renderCart() {
        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p style='text-align:center'>Your cart is empty.</p>";
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;

        cart.forEach((item, index) => {
            const bid = Number(item.bidValue);

            // Determine if won
            item.won = bid >= WINNING_BID_THRESHOLD;

            const status = item.won ? "✅ Won" : "❌ Lost";

            // Remove button only for lost items
            const removeButtonHTML = item.won ? "" : `<button class="remove-btn" data-index="${index}">Remove</button>`;

            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <img src="${item.image}" class="cart-img">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>Bid Amount: ₱${bid}</p>
                    <p>Status: ${status}</p>
                </div>
                ${removeButtonHTML}
            `;

            cartContainer.appendChild(div);
        });

        // Remove button logic
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }

    checkoutBtn.addEventListener("click", () => {
        // Calculate won status for each item before filtering
        const itemsWithStatus = cart.map(item => ({
            ...item,
            won: Number(item.bidValue) >= WINNING_BID_THRESHOLD
        }));

        // Only include won items
        const wonItems = itemsWithStatus.filter(item => item.won);

        if (wonItems.length === 0) {
            alert("⚠️ You have no winning bids. Cannot proceed to checkout.");
            return; // stop if no won bids
        }

        // Save only won items for checkout
        localStorage.setItem("checkoutCart", JSON.stringify(wonItems));
        window.location.href = "checkout.html";
    });

    renderCart();
});


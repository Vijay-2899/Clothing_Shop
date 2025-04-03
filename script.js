document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;

        cartItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.name} - €${item.price}`;
            
            // Remove Button
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.classList.add("remove-item");
            removeBtn.setAttribute("data-index", index);
            removeBtn.addEventListener("click", removeFromCart);

            li.appendChild(removeBtn);
            cartList.appendChild(li);

            total += item.price;
        });

        cartTotal.textContent = total;
        cartCount.textContent = cartItems.length;
        localStorage.setItem("cart", JSON.stringify(cartItems));  // Persist data
    }

    function addToCart(event) {
        const button = event.target;
        const item = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseInt(button.dataset.price),
        };

        cartItems.push(item);
        updateCart();
    }

    function removeFromCart(event) {
        const index = event.target.getAttribute("data-index");
        cartItems.splice(index, 1);
        updateCart();
    }

    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", addToCart);
    });

    updateCart();  // Ensure cart persists across page refreshes
});

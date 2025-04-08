// Cart System
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
        localStorage.setItem("cart", JSON.stringify(cartItems));  // Save cart in local storage
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

// Signup
document.getElementById("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById("signup-message");
        if (data.error) {
            message.textContent = data.error;
            message.style.color = "red";
        } else {
            message.textContent = "Signup successful! You can now log in.";
            message.style.color = "green";
        }
    });
});

// Login
document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById("login-message");
        if (data.error) {
            message.textContent = data.error;
            message.style.color = "red";
        } else {
            message.textContent = `Welcome, ${data.username}!`;
            message.style.color = "green";
        }
    });
});

// Product Search
document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;

    fetch(`http://localhost:3000/api/products?name=${query}`)
    .then(response => response.json())
    .then(products => {
        const resultsDiv = document.getElementById("search-results");
        resultsDiv.innerHTML = ""; // Clear previous results
        if (products.length === 0) {
            resultsDiv.textContent = "No products found.";
        } else {
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product-result");
                productDiv.innerHTML = `
                    <strong>${product.name}</strong> - €${product.price}<br>
                    ${product.description}
                `;
                resultsDiv.appendChild(productDiv);
            });
        }
    });
});

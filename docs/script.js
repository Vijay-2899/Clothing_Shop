const backend = "https://verbose-cod-46jw9vq5qv63x6-4000.app.github.dev/api";

// ===== SIGNUP =====
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    try {
      const res = await fetch(`${backend}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        alert('Signup successful!');
        window.location.href = 'login.html';
      } else {
        document.getElementById('signup-message').textContent = data.message;
      }
    } catch {
      document.getElementById('signup-message').textContent = 'Something went wrong';
    }
  });
}

// ===== LOGIN =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${backend}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
      } else {
        document.getElementById('login-message').textContent = data.message;
      }
    } catch {
      document.getElementById('login-message').textContent = 'Something went wrong';
    }
  });
}

// ===== LOAD PRODUCTS =====
async function loadProducts(category) {
  const res = await fetch(`${backend}/products?category=${category}`);
  const products = await res.json();
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.innerHTML = `
      <img src="${p.image}" width="150" />
      <h3>${p.name}</h3>
      <p>€${p.price}</p>
      <button class="add-btn">Add to Cart</button>
    `;
    card.querySelector('.add-btn').addEventListener('click', () => addToCart(p));
    container.appendChild(card);
  });
}

// ===== CART =====
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;
  cartItems.forEach(item => {
    const el = document.createElement('div');
    el.innerHTML = `<p>${item.name} - €${item.price}</p>`;
    container.appendChild(el);
    total += item.price;
  });
  document.getElementById('total').textContent = `Total: €${total}`;
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

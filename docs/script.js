const apiBase = 'https://clothing-shop-7qq6.onrender.com/api';

// -------------------- SIGNUP --------------------
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    try {
      const res = await fetch(`${apiBase}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        alert('Signup successful! Redirecting to login...');
        window.location.href = 'login.html';
      } else {
        document.getElementById('signup-message').textContent = data.message;
      }
    } catch (err) {
      console.error('Signup error:', err);
      document.getElementById('signup-message').textContent = 'Something went wrong. Try again.';
    }
  });
}

// -------------------- LOGIN --------------------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', username);
        alert('Login successful! Redirecting to home...');
        window.location.href = 'index.html';
      } else {
        document.getElementById('login-message').textContent = data.message;
      }
    } catch (err) {
      console.error('Login error:', err);
      document.getElementById('login-message').textContent = 'Something went wrong. Try again.';
    }
  });
}

// -------------------- PRODUCT LOADING (men/women) --------------------
async function loadProducts(category) {
  const container = document.getElementById('product-list');
  if (!container) return;

  const res = await fetch(`${apiBase}/products?category=${category}`);
  const products = await res.json();

  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.innerHTML = `
      <img src="${p.image}" width="150" />
      <h3>${p.name}</h3>
      <p>€${p.price}</p>
      <button class="add-btn">Add to Cart</button>
    `;
    const btn = card.querySelector('.add-btn');
    btn.addEventListener('click', () => addToCart(p));
    container.appendChild(card);
  });
}

// -------------------- CART --------------------
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  if (!container) return;

  let total = 0;
  container.innerHTML = '';

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${item.name} - €${item.price}</p>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    container.appendChild(div);
  });

  const totalDiv = document.getElementById('total');
  if (totalDiv) totalDiv.textContent = `Total: €${total}`;
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// -------------------- LOGOUT --------------------
function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = 'login.html';
}

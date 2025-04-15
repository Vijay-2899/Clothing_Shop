
// SIGNUP
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      alert('Signup successful! Login now.');
      window.location.href = 'login.html';
    } else {
      document.getElementById('signup-message').textContent = data.message;
    }
  });
}

// LOGIN
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      window.location.href = 'home.html';
    } else {
      document.getElementById('login-message').textContent = data.message;
    }
  });
}

// PRODUCTS & CART
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

// Render Men Products
if (document.getElementById('men-products')) {
  fetch('http://localhost:5000/api/products?category=men')
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('men-products');
      products.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${p.name} - $${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>`;
        container.appendChild(div);
      });
    });
}

// Render Women Products
if (document.getElementById('women-products')) {
  fetch('http://localhost:5000/api/products?category=women')
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('women-products');
      products.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${p.name} - $${p.price}</p>
          <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>`;
        container.appendChild(div);
      });
    });
}

// Render Cart Page
if (document.getElementById('cart-items')) {
  const container = document.getElementById('cart-items');
  let total = 0;
  cart.forEach(p => {
    total += p.price;
    const div = document.createElement('div');
    div.innerHTML = `<p>${p.name} - $${p.price}</p>`;
    container.appendChild(div);
  });
  document.getElementById('total').textContent = `$${total}`;
}

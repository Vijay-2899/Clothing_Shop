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
        if (username === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      } else {
        document.getElementById('login-message').textContent = data.message || 'Login failed';
      }
    } catch {
      document.getElementById('login-message').textContent = 'Something went wrong';
    }
  });
}

// ===== LOAD PRODUCTS FOR USERS =====
async function loadProducts(category) {
  try {
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
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ===== CART FUNCTIONS =====
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
  cartItems.forEach((item, index) => {
    const row = document.createElement('div');
    row.style.marginBottom = '10px';
    const text = document.createElement('span');
    text.textContent = `${item.name} - €${item.price} `;
    row.appendChild(text);
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      removeFromCart(index);
    });
    row.appendChild(removeBtn);
    container.appendChild(row);
    total += item.price;
  });
  document.getElementById('total').textContent = `Total: €${total}`;
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// ===== ADMIN: LOAD ALL PRODUCTS =====
async function loadAdminProducts() {
  const container = document.getElementById('admin-product-list');
  if (!container) return;
  try {
    const res = await fetch(`${backend}/products`);
    const products = await res.json();
    container.innerHTML = '';
    products.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('admin-card');
      card.innerHTML = `
        <img src="${p.image}" width="100" />
        <h3>${p.name}</h3>
        <p>€${p.price}</p>
        <p><small>${p.category}</small></p>
        <button onclick='editProduct(${JSON.stringify(p)})'>✏️ Edit</button>
        <button onclick='deleteProduct(${p.id})'>🗑️ Delete</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading admin products:', err);
  }
}

function editProduct(product) {
  localStorage.setItem('editProduct', JSON.stringify(product));
  window.location.href = 'edit.html';
}

async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await fetch(`${backend}/products/${id}`, { method: 'DELETE' });
      alert('Product deleted!');
      loadAdminProducts();
    } catch (err) {
      alert('Delete failed.');
    }
  }
}

// ===== EDIT PRODUCT PAGE =====
const editForm = document.getElementById('edit-form');
if (editForm) {
  const product = JSON.parse(localStorage.getItem('editProduct'));
  if (product) {
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-price').value = product.price;
    document.getElementById('edit-category').value = product.category;
    document.getElementById('edit-image').value = product.image;
  }

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const price = document.getElementById('edit-price').value;
    const category = document.getElementById('edit-category').value;
    const image = document.getElementById('edit-image').value;

    try {
      const res = await fetch(`${backend}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, category, image })
      });
      const data = await res.json();
      if (data.updated) {
        alert('Product updated!');
        window.location.href = category === 'men' ? 'men.html' : 'women.html';
      } else {
        document.getElementById('edit-message').textContent = 'Update failed.';
      }
    } catch (err) {
      document.getElementById('edit-message').textContent = 'Something went wrong.';
    }
  });
}

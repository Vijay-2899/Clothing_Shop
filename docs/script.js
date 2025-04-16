const backend = "https://clothing-shop-7qq6.onrender.com/api";

// === SIGNUP ===
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
    } catch (err) {
      console.error('Signup error:', err);
      document.getElementById('signup-message').textContent = 'Something went wrong';
    }
  });
}

// === LOGIN ===
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
        alert('Login successful!');
        window.location.href = 'index.html';
      } else {
        document.getElementById('login-message').textContent = data.message;
      }
    } catch (err) {
      console.error('Login error:', err);
      document.getElementById('login-message').textContent = 'Something went wrong';
    }
  });
}

// === LOGOUT (Optional) ===
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  });
}

// === REDIRECT IF NOT LOGGED IN ===
window.addEventListener('load', () => {
  const protectedPages = ['index.html', 'men.html', 'women.html', 'cart.html'];
  const isProtected = protectedPages.some(page => window.location.pathname.includes(page));
  const currentUser = localStorage.getItem('currentUser');

  if (isProtected && !currentUser) {
    window.location.href = 'login.html';
  }
});

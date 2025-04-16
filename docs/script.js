const backendURL = "https://redesigned-happiness-xx5vqpr7ppwhqg-4000.app.github.dev";

// --- SIGNUP ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;

    try {
      const res = await fetch(`${backendURL}/api/signup`, {
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
    } catch (error) {
      console.error('Signup error:', error);
      document.getElementById('signup-message').textContent = 'Something went wrong. Try again.';
    }
  });
}

// --- LOGIN ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch(`${backendURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success) {
        alert('Login successful! Redirecting to home...');
        window.location.href = 'index.html'; // or home.html if that was your original
      } else {
        document.getElementById('login-message').textContent = data.message;
      }
    } catch (error) {
      console.error('Login error:', error);
      document.getElementById('login-message').textContent = 'Something went wrong. Try again.';
    }
  });
}

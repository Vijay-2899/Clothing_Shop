// Auth functions
async function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Account created! Please login.');
        window.location.href = 'login.html';
      } else {
        showAuthError(data.error || 'Signup failed');
      }
    } catch (error) {
      showAuthError('Network error. Please try again.');
    }
  }
  
  async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'index.html';
      } else {
        showAuthError(data.error || 'Login failed');
      }
    } catch (error) {
      showAuthError('Network error. Please try again.');
    }
  }
  
  // Helper function
  function showAuthError(message) {
    const errorElement = document.getElementById('auth-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  // Check if user is logged in
  function checkAuth() {
    const token = localStorage.getItem('authToken');
    const allowedPages = ['login.html', 'signup.html'];
    const currentPage = window.location.pathname.split('/').pop();
  
    if (!token && !allowedPages.includes(currentPage)) {
      window.location.href = 'login.html';
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', checkAuth);
async function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      window.location.href = 'login.html';
    } else {
      const error = await response.json();
      document.getElementById('error').textContent = error.error;
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Network error';
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      document.getElementById('error').textContent = error.error;
    }
  } catch (err) {
    document.getElementById('error').textContent = 'Network error';
  }
}

// Check auth status on homepage
if (window.location.pathname.endsWith('index.html')) {
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
  }
}
// SIGNUP Handler
document.getElementById("signup-form").addEventListener("submit", handleSignup);

async function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  console.log("Signup:", username, password);

  if (username && password) {
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = document.getElementById("signup-message");
        if (data.error) {
          message.textContent = data.error;
          message.style.color = "red";
        } else {
          message.textContent = "Signup successful! You can now log in.";
          message.style.color = "green";
        }
      });
  }
}

// LOGIN Handler
document.getElementById("login-form").addEventListener("submit", handleLogin);

async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  console.log("Login:", username, password);

  if (username && password) {
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
  }
}


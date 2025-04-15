const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFile = path.join(__dirname, '../db/users.json');

// Helper to safely read users
function readUsers() {
  try {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

// Helper to write users
function writeUsers(data) {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

// ✅ SIGNUP ROUTE
router.post('/signup', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    const users = readUsers();

    if (users.find(u => u.username === username)) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    users.push({ username, password });
    writeUsers(users);

    res.json({ success: true, message: 'Signup successful' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ LOGIN ROUTE
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = readUsers();

    const match = users.find(u => u.username === username && u.password === password);
    if (match) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

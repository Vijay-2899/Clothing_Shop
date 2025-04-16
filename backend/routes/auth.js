const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFile = path.join(__dirname, '../db/users.json');

router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Missing credentials' });
  }

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]');
  }

  const users = JSON.parse(fs.readFileSync(usersFile));
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.status(200).json({ success: true, message: 'Signup successful' });
});

module.exports = router;

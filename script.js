require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('./database.db');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    category TEXT CHECK(category IN ('men', 'women'))
  )`);
});

// Middleware
app.use(cors());
app.use(express.json());

// CRUD Endpoints
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.all(query, params, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  db.run(
    'INSERT INTO products (name, price, category) VALUES (?, ?, ?)',
    [name, price, category],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Add PUT and DELETE endpoints similarly

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
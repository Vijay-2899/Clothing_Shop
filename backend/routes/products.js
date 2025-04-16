const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const db = new sqlite3.Database(path.join(__dirname, '../../database.sqlite'));

// Create products table
db.run(`CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price INTEGER,
  category TEXT,
  image TEXT
)`);

// GET all or by category
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new product
router.post('/', (req, res) => {
  const { name, price, category, image } = req.body;
  db.run(
    `INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)`,
    [name, price, category, image],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, price, category, image });
    }
  );
});

// PUT update product
router.put('/:id', (req, res) => {
  const { name, price, category, image } = req.body;
  db.run(
    `UPDATE products SET name = ?, price = ?, category = ?, image = ? WHERE id = ?`,
    [name, price, category, image, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE product
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM products WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

module.exports = router;

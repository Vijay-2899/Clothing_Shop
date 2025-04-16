const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// GET all products or filter by category
router.get('/', (req, res) => {
  const { category } = req.query;
  let sql = 'SELECT * FROM products';
  const params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new product
router.post('/', (req, res) => {
  const { name, price, category, image } = req.body;
  const sql = 'INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)';
  const params = [name, price, category, image];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, price, category, image });
  });
});

// PUT update a product
router.put('/:id', (req, res) => {
  const { name, price, category, image } = req.body;
  const sql = 'UPDATE products SET name = ?, price = ?, category = ?, image = ? WHERE id = ?';
  const params = [name, price, category, image, req.params.id];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

// DELETE a product
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  const params = [req.params.id];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

module.exports = router;

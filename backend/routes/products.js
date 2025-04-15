const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFile = path.join(__dirname, '../db/products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(productsFile));
}

function writeProducts(data) {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
}

// GET all products or by category
router.get('/', (req, res) => {
  const { category } = req.query;
  let products = readProducts();
  if (category) {
    products = products.filter(p => p.category === category);
  }
  res.json(products);
});

// POST a new product
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT update a product
router.put('/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: 'Not found' });

  products[index] = { ...products[index], ...req.body };
  writeProducts(products);
  res.json(products[index]);
});

// DELETE a product
router.delete('/:id', (req, res) => {
  let products = readProducts();
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  writeProducts(products);
  res.status(204).end();
});

module.exports = router;

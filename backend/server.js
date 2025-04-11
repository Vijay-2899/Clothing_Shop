const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory data store
let products = [
  { id: 1, name: 'T-Shirt', price: 20 },
  { id: 2, name: 'Jeans', price: 40 }
];

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Add new product
app.post('/products', (req, res) => {
  const newProduct = req.body;
  newProduct.id = products.length + 1;
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedProduct = req.body;
  const index = products.findIndex(p => p.id === id);

  if (index !== -1) {
    products[index] = { id, ...updatedProduct };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete product
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

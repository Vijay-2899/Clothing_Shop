require('dotenv').config();
import express, { json } from 'express';
import cors from 'cors';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const PRODUCTS_FILE = join(__dirname, 'products.json');
const CART_FILE = join(__dirname, 'cart.json');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(json());

// Data Helper Functions
const readData = (file) => {
  try {
    if (!existsSync(file)) return [];
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};

const writeData = (file, data) => {
  writeFileSync(file, JSON.stringify(data, null, 2));
};

// Initialize data files
if (!existsSync(PRODUCTS_FILE)) {
  writeData(PRODUCTS_FILE, [
    { id: 1, name: 'Cotton T-Shirt', price: 19.99, image: 'tshirt.jpg' },
    { id: 2, name: 'Slim Fit Jeans', price: 49.99, image: 'jeans.jpg' }
  ]);
}

if (!existsSync(CART_FILE)) {
  writeData(CART_FILE, []);
}

// Validation Middleware
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  if (isNaN(price) {
    return res.status(400).json({ error: 'Price must be a number' });
  }
  
  next();
};

// ======================
// PRODUCT ROUTES (CRUD)
// ======================

app.get('/products', (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/products', validateProduct, (req, res) => {
  try {
    const products = readData(PRODUCTS_FILE);
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body
    };
    products.push(newProduct);
    writeData(PRODUCTS_FILE, products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/products/:id', validateProduct, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = { id, ...req.body };
    products[index] = updatedProduct;
    writeData(PRODUCTS_FILE, products);
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/products/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let products = readData(PRODUCTS_FILE);
    const initialLength = products.length;
    
    products = products.filter(p => p.id !== id);
    
    if (products.length === initialLength) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    writeData(PRODUCTS_FILE, products);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ======================
// CART ROUTES
// ======================

app.get('/cart', (req, res) => {
  try {
    const cart = readData(CART_FILE);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/cart/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const products = readData(PRODUCTS_FILE);
    const cart = readData(CART_FILE);
    
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    cart.push(product);
    writeData(CART_FILE, cart);
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.delete('/cart/:productId', (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    let cart = readData(CART_FILE);
    const initialLength = cart.length;
    
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    writeData(CART_FILE, cart);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

// ======================
// DOCUMENTATION & SERVER
// ======================

app.get('/api-docs', (req, res) => {
  res.send(`
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
      ul { list-style-type: none; padding: 0; }
      li { margin-bottom: 10px; }
      code { background: #f4f4f4; padding: 2px 5px; }
    </style>
    <h1>Clothing Shop API Documentation</h1>
    <h2>Products Endpoints</h2>
    <ul>
      <li><code>GET /products</code> - Get all products</li>
      <li><code>POST /products</code> - Create product (requires <code>name</code> and <code>price</code>)</li>
      <li><code>PUT /products/:id</code> - Update product</li>
      <li><code>DELETE /products/:id</code> - Delete product</li>
    </ul>
    <h2>Cart Endpoints</h2>
    <ul>
      <li><code>GET /cart</code> - Get cart contents</li>
      <li><code>POST /cart/:productId</code> - Add to cart</li>
      <li><code>DELETE /cart/:productId</code> - Remove from cart</li>
    </ul>
  `);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
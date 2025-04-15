const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname)); // Serve your HTML/CSS/JS files

// Database setup
const dataFile = path.join(__dirname, 'products-data.json');

// CRUD Operations

// CREATE
app.post('/api/products', (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: Date.now().toString(),
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        description: req.body.description || ''
    };
    products.push(newProduct);
    saveProducts(products);
    res.status(201).json(newProduct);
});

// READ ALL
app.get('/api/products', (req, res) => {
    res.json(getProducts());
});

// READ ONE
app.get('/api/products/:id', (req, res) => {
    const product = getProducts().find(p => p.id === req.params.id);
    product ? res.json(product) : res.status(404).json({error: 'Not found'});
});

// UPDATE
app.put('/api/products/:id', (req, res) => {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({error: 'Not found'});
    
    products[index] = {...products[index], ...req.body};
    saveProducts(products);
    res.json(products[index]);
});

// DELETE
app.delete('/api/products/:id', (req, res) => {
    const products = getProducts().filter(p => p.id !== req.params.id);
    saveProducts(products);
    res.status(204).end();
});

// Helper functions
function getProducts() {
    try {
        return fs.existsSync(dataFile) 
            ? JSON.parse(fs.readFileSync(dataFile)) 
            : [];
    } catch (err) {
        return [];
    }
}

function saveProducts(products) {
    fs.writeFileSync(dataFile, JSON.stringify(products));
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`API Endpoint: http://localhost:${port}/api/products`);
});
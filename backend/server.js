const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = './backend/db.json';

// Read all products
app.get('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// Add a new product
app.post('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const newProduct = { id: Date.now(), ...req.body };
    data.push(newProduct);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = Number(req.params.id);
    const updated = req.body;

    const index = data.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).send('Product not found');

    data[index] = { ...data[index], ...updated };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(data[index]);
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    const id = Number(req.params.id);
    data = data.filter(item => item.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("./database.sqlite", (err) => {
    if (err) {
        console.error("Error connecting to SQLite:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create a table for products
db.run(
    `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        inStock BOOLEAN DEFAULT 1
    )`
);

// Define routes
app.get("/", (req, res) => {
    res.send("Welcome to the Clothing Shop API powered by SQLite!");
});

// POST route to create a product with validation
app.post("/api/products", (req, res) => {
    const { name, price, description, inStock } = req.body;

    // Validate input
    if (!name || !price || !description || inStock === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.run(
        `INSERT INTO products (name, price, description, inStock) VALUES (?, ?, ?, ?)`,
        [name, price, description, inStock],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID, name, price, description, inStock });
            }
        }
    );
});

// GET route to fetch all products with pagination and search/filter
app.get("/api/products", (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page
    const offset = (page - 1) * limit; // Calculate offset
    const name = req.query.name || ''; // Search keyword
    const inStock = req.query.inStock; // Filter by stock status

    let query = `SELECT * FROM products WHERE name LIKE ?`;
    let params = [`%${name}%`];

    if (inStock !== undefined) {
        query += ` AND inStock = ?`;
        params.push(inStock);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

// GET route to fetch a product by ID with error handling
app.get("/api/products/:id", (req, res) => {
    db.get(`SELECT * FROM products WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(row);
        }
    });
});

// PUT route to update a product with validation
app.put("/api/products/:id", (req, res) => {
    const { name, price, description, inStock } = req.body;

    // Validate input
    if (!name || !price || !description || inStock === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.run(
        `UPDATE products SET name = ?, price = ?, description = ?, inStock = ? WHERE id = ?`,
        [name, price, description, inStock, req.params.id],
        function (err) {
            if (err) {
                res.status(400).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.status(200).json({ id: req.params.id, name, price, description, inStock });
            }
        }
    );
});

// DELETE route to delete a product with error handling
app.delete("/api/products/:id", (req, res) => {
    db.run(`DELETE FROM products WHERE id = ?`, [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json({ message: "Product deleted successfully" });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("./models/product"); // Import the Product model

const app = express();
app.use(express.json());
app.use(cors());

// Updated MongoDB connection string (URL-encoded)
const mongoURI = "mongodb+srv://vjk2899:Vijay%402899@vijay02.llwgkkw.mongodb.net/Zudio?retryWrites=true&w=majority";


mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Define routes
app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to the Clothing Shop API!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

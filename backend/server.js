const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose"); // Import Mongoose

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://vjk2899:<db_password>@vijay02.llwgkkw.mongodb.net/?appName=Zudio";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Atlas connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Define routes
app.get("/", (req, res) => {
    res.send("Backend is running and connected to MongoDB Atlas!");
});

app.get("/test-db", async (req, res) => {
    try {
        // Replace 'yourCollection' with an actual collection name
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ collections });
    } catch (err) {
        res.status(500).send("Error connecting to MongoDB: " + err.message);
    }
});
                 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

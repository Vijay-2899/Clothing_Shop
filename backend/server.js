const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: "https://verbose-cod-46jw9vq5qv63x6-5500.app.github.dev",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Serve static files from docs folder
app.use(express.static(path.join(__dirname, '..', 'docs')));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

// Catch-all for SPA (optional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'docs', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

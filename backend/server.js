const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware FIRST
app.use(cors());
app.use(express.json()); // 🔥 THIS MUST COME BEFORE ROUTES

// ✅ Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

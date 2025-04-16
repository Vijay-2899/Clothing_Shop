const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// ✅ CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ✅ Body parser (must come before routes)
app.use(express.json());

// ✅ Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

// ✅ Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

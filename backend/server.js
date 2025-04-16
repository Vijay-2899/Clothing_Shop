const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;



const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  

app.use('/api', authRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

const express = require('express');
const cors = require('cors');
const path = require('path');

const productsRouter = require('./routes/products.js');
const ordersRouter = require('./routes/orders.js');
const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users.js'));
app.use('/api/stats', require('./routes/stats.js'));

// Basic health check
app.get('/', (req, res) => {
    res.send('DIYAMGAZ API is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

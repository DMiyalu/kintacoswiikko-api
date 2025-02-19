require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Import des routes
const ordersRouter = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/orders', ordersRouter);

// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur KinTacosWiikko API' });
});

// Port configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoute.js');
const { Pool } = require('pg');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Create an Express application
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// PostgreSQL configuration
const pool = new Pool({
  user: 'dyjfpsho',
  host: 'flora.db.elephantsql.com',
  database: 'dyjfpsho',
  password: 'a0N5GKX2kyBNAZ68w8Gpaw8AsGShUH6j',
  port: 5432,
});

// Define Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CourtMaster API',
      version: '1.0.0',
      description: 'API documentation for CourtMaster',
    },
    tags: [
      {
        name: 'User', // Set your custom tag here
        description: 'Apis regarding Users',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/users', userRoutes(pool));

app.get('/', (req, res) => {
    res.send('Welcome to the CourtMaster API. Available endpoint: users/v1');
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

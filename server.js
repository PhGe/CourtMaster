// server.js
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { insertUser, pool, getUserByUsername } = require('./database.js');
const bodyParser = require('body-parser');
const userRoute = require('./src/routes/userRoute.js');
const { compare: bcryptCompare } = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json());


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
        description: 'APIs regarding Users',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route for API
app.use('/users', userRoute(pool));


app.post('/users/signup', async (req, res) => {
  const { username, password, role } = req.body;

  // Hash the password
  try {
    const insertedUser = await insertUser(username, password, role);

    // Send a response (you can customize the response as needed)
    res.json({ success: true, user: insertedUser });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/example', async (req, res) => {
  const username = 'Master3';
  const user = await getUserByUsername(username);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    // Add other relevant user information
  };

  // Sign the token with a secret key
  const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
  return token;
}

app.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Retrieve the user from the database by username
    const user = await getUserByUsername(username);

    if (user && user.password_hash) {
      // Hash the entered password
      const hashedPassword = await bcryptCompare(password, user.password_hash);

      if (hashedPassword) {
        // Passwords match, generate a token
        const token = generateToken(user);

        // Send the token in the response
        res.json({ success: true, token, message: 'Login successful' });
      } else {
        // Passwords don't match, deny access
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } else {
      // User not found or missing password_hash
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/', (req, res) => {
  res.send('Welcome to the CourtMaster API. Available endpoint: users/v1');
});

// Start the server
app.listen(port ,   () => {
  console.log(`Server is running on https://courtmasterapp.azurewebsites.net`);
});

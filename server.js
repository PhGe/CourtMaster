// server.js
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { insertUser, pool, getUserByUsername } = require('./database.js');
const bodyParser = require('body-parser');
const userRoute = require('./src/routes/userRoute.js');
const bookingRoute = require('./src/routes/bookingRoute.js');
const courtRoute = require('./src/routes/courtRoute.js');
const { compare: bcryptCompare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./middleware/authenticate.js');
const {
  setTokenAndExpiration,
  checkTokenExpiration,
} = require('./src/utils/authUtils.js');


// Create an Express application
const app = express();
const port = process.env.PORT || '3000';

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
    components: {
      securitySchemes: {
        apikeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
    security: [
      {
        apikeyAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};



// Initialize Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);



// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Function to generate a JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };

  // Sign the token with a secret key
  const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '10m' });
  return token;
}

function handleError(req, res, next) {
  const error = new Error('Test error');
  next(error);
}
// Route for API

app.use('/booking', bookingRoute(pool));
app.use('/courts', courtRoute(pool));
app.use('/users' ,userRoute(pool));
app.get('/error', handleError);

app.get('/userlist', authenticateToken, (req, res) => {
  // Only logged-in users can access this route
  res.send('Welcome to /userlist');
});


app.post('/users/signup', async (req, res) => {
  const { username, password, role } = req.body;
  console.log('server test');
  // Hash the password
  try {
    const insertedUser = await insertUser(username, password, role);

    // Send a response (you can customize the response as needed)
    res.json({ success: true, user: insertedUser });
  } catch (error) {
    console.log('server test2');
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

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
        console.log("generateToken")
        const token = generateToken(user);
        const userId = user.id;
        const expirationTime = 120;
        setTokenAndExpiration(token, expirationTime)

        //on every request check if expired
        checkTokenExpiration();
        // Send the token in the response
        res.json({ success: true, token, userId, message: 'Login successful' });
        
      } else {
        // Passwords don't match, deny access
        res.status(401).json({ success: false, message: 'Invalid password' });
      }
    } else {
      // User not found or missing password_hash
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.log("test2")
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.get('/', (req, res) => {
  res.send('Welcome to the CourtMaster API. Available endpoint: users/all ');
});


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

startServer(port)
// Start the server
function startServer(port,) {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Starting server...'); // Add this line for debugging
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }
}


module.exports ={ app, startServer};
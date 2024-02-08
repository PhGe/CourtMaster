// Import necessary modules
const express = require('express');
const authenticateToken = require('../../middleware/authenticate.js');
const router = express.Router();

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get a list of users
 *     description: Returns a list of users from the database.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 username: JaneDoe
 *                 password_hash: 5f4dcc3b5aa765d61d8327deb882cf99
 *                 role: Admin
 *                 created_at: 2023-11-27T22:53:08.931Z
 *                 updated_at: 2023-12-25T11:22:16.532Z
 *               - id: 2
 *                 username: JohnDoe
 *                 password_hash: 6c569aabbf7775ef8fc5705a9f1f9b2f
 *                 role: Admin
 *                 created_at: 2023-11-27T22:53:08.931Z
 *                 updated_at: 2023-12-25T11:22:16.532Z
 */

// Define a route to get user data

const userRoute = (pool) => {
  
// Define a route to get all users
router.get('/all',authenticateToken, async (req, res) => {
  try {
    // Query to get all users
    const result = await pool.query('SELECT * FROM users');
    const users = result.rows;

    // Send the user data as a JSON response
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

/**
 * @swagger
 * /users/names:
 *   get:
 *     summary: Get a list of usernames
 *     description: Returns a list of usernames from the database.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of usernames.
 *         content:
 *           application/json:
 *             example:
 *               - username: JaneDoe
 *               - username: JohnDoe
 */

// Define a route to get user names
router.get('/names', authenticateToken,async (req, res) => {
  try {
    // Query to get user names
    const result = await pool.query('SELECT username FROM users');
    const usernames = result.rows;

    // Send the user data as a JSON response
    res.json(usernames);
  } catch (error) {
    console.error('Error fetching user names:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/authenticate', async (req, res) => {
  try {
    console.log(req.body.token)
    // Assuming the token is sent in the request body during login
    console.log(req.headers.authorization)
    const token = req.headers.authorization;
    console.log("token: " + token)
    // You might want to perform additional verification or checks on the token here

    res.json({ token });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.post('/authenticate-token', async (req, res) => {
  // If the execution reaches here, it means the token is valid
  res.json({ success: true, message: 'Token is valid' });
  
});


  return router;
};


// Export the router
module.exports = userRoute;

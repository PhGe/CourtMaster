// Import necessary modules
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /users/v1:
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
 *                 password : 123
 *                 role: Admin
 *               - id: 2
 *                 username: JohnDoe
 *                 password : 789
 *                 role: User
 */


// Define a route to get user data

const userRoute = (pool) => {
router.get('/v1', async (req, res) => {
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
})


return router;
};

// Export the router
module.exports = userRoute;

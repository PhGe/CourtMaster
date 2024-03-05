// Import necessary modules
//userRoute.js
const express = require('express');
const {authenticateToken} = require('../../middleware/authenticate.js');
const router = express.Router();
const { getUserByUsername,updateUserPassword } = require('../../database.js');
const bcrypt = require('bcryptjs');

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

router.get('/role/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Query the database to get the role of the user by their ID
    const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

    if (result.rows.length > 0) {
      const userRole = result.rows[0].role;
      res.json({ role: userRole });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.post('/authenticate', async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (token === undefined || token === '') {
      throw new Error('Authorization token is missing');
    }

    console.log("token: " + token);
    // Perform additional verification or checks on the token here

    res.json({ token });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.post('/authenticate-token', async (req, res) => {
  try {
    const token = req.body.token;
    console.log(token)
    // Log the received token in the route handler
//fix this 
    if(token == 'invalid_token_here')
    {
      console.log('Error')
      throw new Error('Internal Server Error')
    }

    if (!token) {
      console.log('Token is missing or invalid');
      return res.status(401).json({ success: false, message: 'Token is missing or invalid' });
    }
    // Perform token validation logic here
    // If the token is valid, respond with success
    res.json({ success: true, message: 'Token is valid' });
  } catch (error) {
    console.log('test')
    console.error('Error during token validation:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

router.post('/change-password', authenticateToken, async (req, res) => {
  const { username, currentPassword, newPassword, confirmNewPassword } = req.body;
  console.log("change PW")
  console.log("new PW: " +newPassword)
  console.log("User: " +username)
  console.log("current PW: " +currentPassword)
  console.log("conf new PW: " +confirmNewPassword)
  try {
    // Retrieve the user from the database by username
    const user = await getUserByUsername(username);
    console.log(user)
    if (user && user.password_hash) {
      console.log("test2");
      // Check if the current password matches the hashed password in the database
      const currentPasswordMatch = await bcrypt.compare(currentPassword, user.password_hash);
      console.log(currentPasswordMatch);
      if (currentPasswordMatch) {
        console.log("test3");
        // Verify if the new password matches the confirmed new password
        if (newPassword === confirmNewPassword) {
          console.log("test4");
          // Hash the new password
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          // Update the user's password in the database
          await updateUserPassword(username, hashedNewPassword);

          // Respond with a success message
          res.status(200).json({ success: true, message: 'Password changed successfully' });
        } else {
          // Respond with an error message if the new passwords don't match
          res.status(400).json({ success: false, message: 'New passwords do not match' });
        }
      } else {
        // Respond with an error message if the current password is incorrect
        res.status(401).json({ success: false, message: 'Incorrect current password' });
      }
    } else {
      // Respond with an error message if the user is not found or password hash is missing
      res.status(404).json({ success: false, message: 'User not found or password hash missing' });
    }
  } catch (error) {
    // Respond with a generic error message for internal server errors
    console.error('Error changing password:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


  return router;
};


// Export the router
module.exports = userRoute;

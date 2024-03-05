//authenticate.js

const jwt = require('jsonwebtoken');

function getToken(req) {
  const token = req.headers.authorization; 
  return token || null; // Return null if token is not provided
}

function extractUserId(req) {
  const token = getToken(req);
  if (!token) {
    return null; // Token not provided
  }
  try {
    const decodedToken = jwt.verify(token, 'your-secret-key');
   // console.log("AHUGA"+ decodedToken.userId)
    return decodedToken.userId; // Extract user ID from the decoded token
  } catch (error) {
    console.error('Error extracting user ID:', error);
    return null; // Error occurred while extracting user ID
  }
}

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  // Log the received token
  console.log('Received token:', token);

  // No token provided
  if (!token) {
    console.log('Token not provided');
    return res.status(401).json({ success: false, message: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token expired');
        // Respond with token expired message
        return res.status(401).json({ success: false, message: 'Token expired' });
      } else {
        console.log('Invalid token:', err.message);
        // Throw an error for other types of errors
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' })
      }
    }
    // Continue to the next middleware or route
    next();
  });
}




module.exports = {authenticateToken, extractUserId ,getToken};
//authenticate.js

const jwt = require('jsonwebtoken');

function getToken(req)
{
  const token = req.headers.authorization; 
  return token
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

  //no Token at all
  if (!token) {
    return res.status(401).json({  success: false, message: 'Unauthorized - Token not provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log("Token expired");
        // Token has expired, redirect to login page
        return res.redirect('/login');
      } else {
        return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
      }
    }
    //console.log('Decoded user information:', user);
    // Continue to the next middleware or route
    next();
  });
}


module.exports = authenticateToken, extractUserId ,getToken;
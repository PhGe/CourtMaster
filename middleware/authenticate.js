const jwt = require('jsonwebtoken');

function getToken(req)
{
  const token = req.headers.authorization; 
  return token
}

function authenticateToken(req, res, next) {
  console.log(req.headers.authorization)
  console.log("auth")
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
    console.log('Decoded user information:', user);
    // Continue to the next middleware or route
    next();
  });
}


module.exports = authenticateToken, getToken;
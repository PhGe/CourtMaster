// middleware/authenticate.js
function authenticateToken(req, res, next) {

    const token = req.header('Authorization');
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token not provided' });
    }
  
    // For testing purposes, you can check if the token is equal to a hardcoded value
    if (token !== 'Bearer TestToken') {
      return res.status(403).json({ message: 'Forbidden - Invalid token' });
    }
  
    // Continue to the next middleware or route
    next();
  }
  
  module.exports = authenticateToken;
  
/* eslint-disable no-undef */
// authenticate.test.js

const { getToken, extractUserId, authenticateToken } = require('../../../middleware/authenticate');
const jwt = require('jsonwebtoken');

describe('getToken', () => {
  it('should extract token from request headers', () => {
    const req = {
      headers: {
        authorization: 'Bearer dummyToken'
      }
    };
    const token = getToken(req);
    expect(token).toBe('Bearer dummyToken');
  });

  it('should return null if token is not provided', () => {
    const req = {
      headers: {}
    };
    const token = getToken(req);
    expect(token).toBeNull();
  });
});

describe('extractUserId', () => {
  it('should extract user ID from a valid token', () => {
    // Mock a valid token
    const token = jwt.sign({ userId: '33' }, 'your-secret-key');
    const req = {
      headers: {
        authorization: `${token}`
      }
    };
    const userId = extractUserId(req);
    expect(userId).toBe('33');
  });

  it('should return null if token is not provided', () => {
    const req = {
      headers: {}
    };
    const userId = extractUserId(req);
    expect(userId).toBeNull();
  });

  it('should return null if token is invalid', () => {
    // Mock an invalid token
    const req = {
      headers: {
        authorization: 'Bearer invalidToken'
      }
    };
    const userId = extractUserId(req);
    expect(userId).toBeNull();
  });
  it('should return null if an error occurs during token decoding', () => {
    // Mock a scenario where an error occurs during decoding
    const req = {
      headers: {
        authorization: 'Bearer invalidToken' // Invalid token to trigger decoding error
      }
    };
    const userId = extractUserId(req);
    expect(userId).toBeNull();
  });
});

// Note: You can write more tests for different scenarios of token validity and invalidity.

describe('authenticateToken', () => {
    it('should call next() if token is valid', () => {
        // Mock a valid token
        const validToken = jwt.sign({ userId: '33' }, 'your-secret-key');
        const req = {
          headers: {
            authorization: `${validToken}`
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(), // Mock the status function
          json: jest.fn()
        };
        const next = jest.fn();
      
        authenticateToken(req, res, next);
      
        // Verify that next() is called
        expect(next).toHaveBeenCalled();
      });
      

    it('should return 401 if token is not provided', () => {
        const req = {
          headers: {}
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        const next = jest.fn();
    
        authenticateToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized - Token not provided' });
        expect(next).not.toHaveBeenCalled();
      });
    
      it('should return 403 if token is invalid', () => {
        const req = {
          headers: {
            authorization: 'Bearer invalidToken'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        const next = jest.fn();
    
        authenticateToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Forbidden: Invalid token' });
        expect(next).not.toHaveBeenCalled();
      });

      it('should return 401 if token has expired', () => {
        // Mock a scenario where the token has expired
        const expiredToken = jwt.sign({ userId: '33' }, 'your-secret-key', { expiresIn: '0s' });
        const req = {
          headers: {
            authorization: `${expiredToken}`
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
        const next = jest.fn();
    
        authenticateToken(req, res, next);
    
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Token expired' });
        expect(next).not.toHaveBeenCalled();
      });
});

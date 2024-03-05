/* eslint-disable no-undef */
const { loginAndGetToken }  = require('../../../src/utils/loginUtilsTwo');
const request = require('supertest');
const {app} = require('../../../server');
const {pool} = require('../../../database');
const {authenticateToken} = require('../../../middleware/authenticate');
const authenticate = require('../../../middleware/authenticate')

const database = require('../../../database');
let authToken;


beforeAll(async () => {
  try {
    authToken = await loginAndGetToken(); // Obtain the authentication token using your login function
    console.log(authToken)
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Login failed');
  }
});

describe('GET /users/all', () => {
  it('should respond with a list of users', async () => {


    const response = await request(app)
      .get('/users/all')
      .set('Authorization',  `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
  it('should respond with an error if fetching users fails', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/users/all')
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
});

describe('GET /users/names', () => {
  it('should respond with a list of usernames', async () => {
    const response = await request(app)
      .get('/users/names')
      .set('Authorization',  `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    // Add more assertions based on the expected response body or status code
  });
  it('should respond with an error if fetching users fails', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/users/names')
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
});

describe('GET /users/role/:id', () => {
  it('should respond with the role of the user with the provided ID', async () => {
    const userId = 1; // Provide a valid user ID from your database
    const response = await request(app)
      .get(`/users/role/${userId}`)
      .set('Authorization', `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.role).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should respond with a 404 error if the user is not found', async () => {
    // Mock the database query to throw a 404 error
    jest.spyOn(pool, 'query').mockResolvedValueOnce({ rows: [] });

    const userId = 999; // Provide a non-existent user ID
    const response = await request(app)
      .get(`/users/role/${userId}`)
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'User not found' });
  });

  it('should respond with a 500 error if an internal server error occurs', async () => {
    // Mock the database query to throw a server error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const userId = 33; // Provide a valid user ID
    const response = await request(app)
      .get(`/users/role/${userId}`)
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('POST /users/authenticate', () => {
  it('should authenticate the user based on the provided token', async () => {
    const response = await request(app)
      .post('/users/authenticate')
      .set('Authorization', `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should handle errors during authentication', async () => {
    // Simulate an error by sending a request without the required token
    const response = await request(app)
      .post('/users/authenticate')
      .set('Authorization', ''); // Sending an empty authorization token
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('POST /users/authenticate-token', () => {
  it('should respond with success if the token is valid', async () => {
    const validToken = authToken; // Provide a valid token for testing

    const response = await request(app)
      .post('/users/authenticate-token')
      .send({ token: validToken });

    // Change the expected status code to 200
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Token is valid');
  });
  it('should respond with 401 if the token is missing or invalid', async () => {
    const response = await request(app)
      .post('/users/authenticate-token')
      .send({ token: '' }); // Sending an empty token to trigger the 401 response

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ success: false, message: 'Token is missing or invalid' });
  });
  it('should respond with 500 if an internal server error occurs', async () => {
    // Mock the authenticateToken function to throw an error
    jest.spyOn(authenticate, 'authenticateToken').mockImplementation((req, res, next) => {
      next(new Error('Internal Server Error')); // Simulate an internal server error
    });

    const response = await request(app)
      .post('/users/authenticate-token')
      .send({ token: 'invalid_token_here' }); // Send an invalid token

    // Expected status code should be 500
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Internal Server Error' });
  });

});


describe('POST /users/change-password', () => {

  it('should change the user password when provided with correct credentials', async () => {
    const username = 'Phil'; // valid username from database
    const currentPassword = '123'; // the current password for the user
    const newPassword = 'Nadia56775'; // the new password for the user
    const confirmNewPassword = 'Nadia56775'; // Confirm the new password
    console.log("start")
    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Password changed successfully');
  });

  it('should change the user password back when provided with correct credentials', async () => {
    const username = 'Phil'; // valid username from database
    const currentPassword = 'Nadia56775'; // the current password for the user
    const newPassword = '123'; // the new password for the user
    const confirmNewPassword = '123'; // Confirm the new password
    console.log("start")
    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Password changed successfully');
  });

  it('should respond with an error if the current password is incorrect', async () => {
    const username = 'Nick'; //valid username from database
    const currentPassword = '1234'; // incorrect current password
    const newPassword = 'Nadia56775'; // the new password for the user
    const confirmNewPassword = 'Nadia56775'; // Confirm the new password

    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });

  it('should respond with an error if the new passwords do not match', async () => {
    const username = 'Nick'; // Provide a valid username from your database
    const currentPassword = 'Nadia56775'; // Provide the current password for the user
    const newPassword = '123'; // Provide the new password for the user
    const confirmNewPassword = 'Martin3214'; // Provide a different new password

    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });

  it('should respond with an error if the user is not found or password hash is missing', async () => {
    const username = 'HumbaLumba'; // Provide a username that doesn't exist in your database
    const currentPassword = '123'; // Provide the current password for the user
    const newPassword = '4515123'; // Provide the new password for the user
    const confirmNewPassword = '4515123'; // Confirm the new password

    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should respond with a 500 error if an internal server error occurs', async () => {
    const username = 'Nick'; // Provide a valid username from your database
    const currentPassword = 'Nadia56775'; // Provide the current password for the user
    const newPassword = '123'; // Provide the new password for the user
    const confirmNewPassword = '123'; // Confirm the new password

    // Mocking the updateUserPassword function to throw an error
    jest.spyOn(pool, 'query').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    const response = await request(app)
      .post('/users/change-password')
      .set('Authorization', `${authToken}`)
      .send({
        username,
        currentPassword,
        newPassword,
        confirmNewPassword
      });

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });


});
afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 3000)); // Delay to allow server to close properly
});
// Add more test suites for other routes in your userRoute as needed

/* eslint-disable no-undef */
const { loginAndGetToken }  = require('../../../src/utils/loginUtilsTwo');
const request = require('supertest');
const app = require('../../../server');

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

test('Login and get authentication token', async () => {
  try {
    // Assert that the authentication token obtained in beforeAll is not empty or undefined
    expect(authToken).toBeTruthy();
  } catch (error) {
    // If there's an error while logging in, throw an error to fail the test
    throw new Error('Error logging in: ' + error.message);
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
});

describe('POST /users/change-password', () => {
  let originalPassword; // Variable to store the original password before changing

  beforeAll(async () => {
    // Retrieve the original password of the user
    originalPassword = '123'; 
  });

  afterAll(async () => {
    // Reset the password of the user to the original password after all tests are done
      // Reset the password of the user to the original password after all tests are done
      await request(app)
        .post('/users/change-password')
        .set('Authorization', `${authToken}`)
        .send({
          username: 'Nick',
          currentPassword: 'Nadia56775',
          newPassword: '123',
          confirmNewPassword: '123'
        });
  });

  it('should change the user password when provided with correct credentials', async () => {
    const username = 'Nick'; // valid username from database
    const currentPassword = '123'; // the current password for the user
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
});

describe('POST /users/authenticate-token', () => {
  it('should respond with success if the token is valid', async () => {
    const validToken = authToken; // Provide a valid token for testing

    const response = await request(app)
      .post('/users/authenticate-token')
      .send({ token: validToken });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Token is valid');
  });

  it('should respond with an error if the token is missing or invalid', async () => {
    const invalidToken = authToken-2; // Provide an invalid token for testing
    const response = await request(app)
      .post('/users/authenticate-token')
      .send({ token: invalidToken });

    expect(response.status).toBe(401);
    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Token is missing or invalid');
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 3000)); // Delay to allow server to close properly
});
// Add more test suites for other routes in your userRoute as needed

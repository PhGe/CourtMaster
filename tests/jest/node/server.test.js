//server.test.js
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../../server'); // Assuming your server file is named server.js
const { loginAndGetToken } = require('../../../src/utils/loginUtilsTwo');
const { deleteUserByUsername } = require('../../../database');
const database = require('../../../database');
const loginUtilsTwo = require('../../../src/utils/loginUtilsTwo');
const authUtils = require('../../../src/utils/authUtils');
jest.spyOn(database, 'insertUser');


afterEach(async () => {
    // Delete the user created during signup after each test
    await deleteUserByUsername('testuser');
});

let authToken; // Define authToken globally to use across test cases

beforeAll(async () => {
    try {
        authToken = await loginAndGetToken(); // Obtain the authentication token using your login function
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Login failed');
    }
});

describe('Server Routes', () => {
    describe('GET /', () => {
        it('responds with welcome message', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('Welcome to the CourtMaster API');
        });
    });

    describe('GET /userlist', () => {
        it('responds with welcome message for authenticated users', async () => {
            const res = await request(app)
                .get('/userlist')
                .set('Authorization', `${authToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('Welcome to /userlist');
        });

        it('responds with unauthorized status for unauthenticated users', async () => {
            const res = await request(app).get('/userlist');
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('POST /users/signup', () => {
        it('signs up a new user', async () => {
            const res = await request(app)
                .post('/users/signup')
                .send({ username: 'testuser', password: 'testpassword', role: 'user' });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('user');
        });
        it('responds with 500 and appropriate error message when signup fails', async () => {
            // Mock the function responsible for signing up a user to throw an error
            jest.spyOn(database, 'insertUser').mockImplementation(() => {
                throw new Error('Signup failed');
            });
        
            try {
                // Make a request to the signup route
                const res = await request(app)
                    .post('/users/signup')
                    .send({ username: 1, password: 'testpassword', role: 'asdfafasf' });
        
                // Expect that the response status code is 500
                console.log('Response status code:', res.status); // Add this line for debugging
                expect(res.status).toEqual(500);
        
                // Expect that the response body contains the appropriate error message
                console.log('Response body:', res.body); // Add this line for debugging
                expect(res.body).toEqual({ success: false, error: 'Internal Server Error' });
            } catch (error) {
                // Catch any unexpected errors
                console.error('Error in test case:', error); // Add this line for debugging
                throw error;
            } finally {
                // Restore the original implementation of the mocked function
                database.insertUser.mockRestore();
            }
        });        
        
    });

    describe('POST /users/login', () => {
        it('logs in a user with valid credentials', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({ username: 'Phil', password: '123' });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('success', true);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('userId');
        });

        it('responds with unauthorized status for invalid credentials', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({ username: 'Phil', password: '1234' });
            expect(res.statusCode).toEqual(401);
        });

        it('responds with not found status for non-existing user', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({ username: 'nonexistinguser', password: 'nonexistingpassword' });
            expect(res.statusCode).toEqual(404);
        });
        it('responds with 500 and appropriate error message when login fails', async () => {
            // Mock the function responsible for logging in a user to throw an error
            jest.spyOn(loginUtilsTwo, 'loginAndGetToken').mockImplementation(() => {
                throw new Error('Login failed');
            });
        
            try {
                // Make a request to the login route
                const res = await request(app)
                    .post('/users/login')
                    .send({ username: 2, password: '1234' }); // Sending wrong credentials intentionally
        
                // Expect that the response status code is 500
                console.log('Response status code:', res.status); // Add this line for debugging
                expect(res.status).toEqual(500);
        
                // Expect that the response body contains the appropriate error message
                console.log('Response body:', res.body); // Add this line for debugging
                expect(res.body).toEqual({ success: false, error: 'Internal Server Error' });
            } catch (error) {
                // Catch any unexpected errors
                console.error('Error in test case:', error); // Add this line for debugging
                throw error;
            }
        });
        
    });
});

describe('Functions', () => {
    describe('generateToken()', () => {
        it('generates a JWT token', () => {
            // Write test case for generateToken function
            // For example, test whether the token generated is valid
        });
    });

    describe('checkTokenExpiration()', () => {
        it('checks token expiration', () => {
            // Write test case for checkTokenExpiration function
            // For example, test whether the function correctly identifies expired tokens
        });
    });

    // Add test cases for other functions used in server.js
});








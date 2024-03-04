/* eslint-disable no-undef */

const axios = require('axios');
const { loginAndGetToken } = require('../../../src/utils/loginUtilsTwo');

// Mock axios post method
jest.mock('axios');

let authToken; // Declare authToken variable to store the authentication token

beforeAll(async () => {
    try {
        // Mock successful response from the authentication endpoint
        axios.post.mockResolvedValueOnce({
            data: {
                token: 'mockAuthToken'
            }
        });

        // Obtain the authentication token using your login function
        authToken = await loginAndGetToken();
        console.log('Authentication token obtained:', authToken);
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Login failed');
    }
    
});

describe('loginAndGetToken', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return an authentication token upon successful login', async () => {
        // Verify that the authToken matches the mocked value
        expect(authToken).toBe('mockAuthToken');
    });

    it('should throw an error if login fails', async () => {
        // Mock error response from the authentication endpoint
        axios.post.mockRejectedValueOnce({ response: { status: 500 } });
        
        // Expect the function to throw an error
        await expect(loginAndGetToken()).rejects.toThrow('Login failed');
    });

    it('should throw an error if token is not found in the response', async () => {
        // Mock response without a token
        axios.post.mockResolvedValueOnce({
            data: {} // Simulating a response without a token
        });
    
        // Expect the function to throw an error
        await expect(loginAndGetToken()).rejects.toThrow('Token not found in response');
    });
    
});

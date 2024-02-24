// loginUtilTwo.js

const axios = require('axios');

async function loginAndGetToken() {
    const authEndpoint = 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login';
    
    try {
        const response = await axios.post(authEndpoint, {
            username: 'Phil',
            password: '123'
        });

        // Assuming the authentication token is returned in the response data

        const authToken = response.data.token;
        
        return authToken;
    } catch (error) {
        console.error('Error logging in:', error);
        throw new Error('Login failed');
    }
}

module.exports = loginAndGetToken;

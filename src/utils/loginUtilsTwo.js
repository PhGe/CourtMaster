// loginUtilTwo.js

const axios = require('axios');

async function loginAndGetToken() {
    const authEndpoint = 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login';

    try {
        const response = await axios.post(authEndpoint, {
            username: 'Phil',
            password: '123'
        });

        if (response && response.data && response.data.token) {
            return response.data.token;
        } else {
            throw new Error('Token not found in response');
        }
    } catch (error) {
        if (error.response && error.response.status === 500) {
            throw new Error('Login failed'); // Change the error message here
        } else {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}
module.exports = { loginAndGetToken }
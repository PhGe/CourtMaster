<template>
    <div>
      <h1>Signup</h1>
      <form @submit.prevent="signup">
        <label for="username">Username:</label>
        <input v-model="username" type="text" id="username" required>
        <br>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>
        <br>
        <label for="confirmPassword">Confirm Password:</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" required>
        <br>
        <button type="submit">Signup</button>
      </form>
    </div>
  </template>

  <script>
    const { hash: bcryptHash } = require('bcryptjs');
    import axios from 'axios';
  export default {
    name: 'SignUpView',
    //returns object with init values
    data() {
      return {
        username: '',
        password: '',
        confirmPassword: '',
      };
    },
    methods: {
    async signup() {
      if (this.password !== this.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

  async function hashPassword(password) {
  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcryptHash(password, saltRounds);

  console.log(hashedPassword);

  return hashedPassword; // Optionally, you might want to return the hashed password
}
    const userData = {
        username: this.username,
        password: await hashPassword(this.password),
        role: 'user',
    }
    console.log(userData)
      // Make an HTTP request to your server
      try {
        const response = await axios.post('https://20.79.208.63/users/signup', userData);

        // Handle the response as needed
        console.log(response.data);
      } catch (error) {
        console.error('Error signing up:', error);
      }

      // Redirect or perform additional actions after signup
      this.$router.push('/');
    },
  },
};
  </script>
  
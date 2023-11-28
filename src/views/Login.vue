<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="username">Username:</label>
        <input v-model="username" type="text" id="username" required>
        <br>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>
        <br>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
    import axios from 'axios';
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
    async  login() {

        const userData = {
        username: this.username,
        password: this.password,
    }
        try {
        console.log("userdata: " + userData.username + "::: " + userData.password)
        const response = await axios.post('http://localhost:3000/users/login', userData);

        // Handle the response as needed
        console.log(response.data);
      } catch (error) {
        console.error('Error signing up:', error);
      }

      // Redirect or perform additional actions after signup
        this.$router.push('/subpage');// TODO push to main screen
      },
    },
  };
  </script>
  
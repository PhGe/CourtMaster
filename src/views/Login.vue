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
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      /*login() {
        // Add login logic here
        // Redirect to the main app if login is successful
        this.$router.push('/');
      },*/
    },
  };
  </script>
  
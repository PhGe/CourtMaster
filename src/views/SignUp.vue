<template>
  <div class="signup-container">
    <el-card class="signup-card">
      <h2 class="signup-title">Signup</h2>
      <el-form class="form" @submit.prevent="signup">
        <el-form-item for="username">Username:
          <el-input class="test" clearable maxlength="20" show-word-limit v-model="username" type="text" id="username" required @keyup.enter="signup"></el-input>
        </el-form-item>
        <el-form-item for="password">Password:
          <el-input class="test" clearable v-model="password" type="password" id="password" required @keyup.enter="signup"></el-input>
        </el-form-item>
        <el-form-item for="confirmPassword">Confirm Password:
          <el-input class="test" clearable v-model="confirmPassword" type="password" id="confirmPassword" required @keyup.enter="signup"></el-input>
        </el-form-item>
        <el-form-item class="signup-btn">
          <el-button round type="primary" @click="signup">Signup</el-button>
        </el-form-item>
      </el-form>
    </el-card>
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
        apiUrl: process.env.API_BASE_URL || 'http://localhost:3000' // Default to localhost
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
        const response = await axios.post(`${this.apiUrl}/users/signup`, userData);

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

  <style scoped>
  .signup-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  
  .signup-card {
    width: 400px;
  }
  
  .signup-title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .signup-btn {
    text-align: center;
    margin-top: 20px;
  }
</style>
  
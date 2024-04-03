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
  import { ElNotification } from 'element-plus'
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
        apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com' // Default to localhost
      };
    },
    methods: {
  async signup() {
    // Check if passwords match
    if (this.password !== this.confirmPassword) {
      ElNotification.error('Passwords do not match');
      return;
    }

    // Check password complexity
    if (!this.isPasswordComplex(this.password)) {
      ElNotification.error('Password must contain at least one letter, one number, one special character, and be between 1 and 35 characters long');
      return;
    }

    // Check username length
    if (this.username.length < 3 || this.username.length > 35) {
      ElNotification.error('Username must be between 3 and 35 characters long');
      return;
    }

    // Hash the password
    const hashedPassword = await this.hashPassword(this.password);

    const userData = {
      username: this.username,
      password: hashedPassword,
      role: 'user',
    };

    // Make an HTTP request to your server
    try {
      const response = await axios.post(`${this.apiUrl}/users/signup`, userData);

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error('Error signing up:', error);
    }

    // Redirect or perform additional actions after signup
    this.$router.push('/home');
  },

  async hashPassword(password) {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcryptHash(password, saltRounds);

    return hashedPassword;
  },

  isPasswordComplex(password) {
    // Password must contain at least one letter, one number, one special character,
    // and be between 8 and 35 characters long
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{1,35}$/;
    return passwordRegex.test(password);
  }
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
  
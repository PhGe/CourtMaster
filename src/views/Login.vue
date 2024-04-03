<template>
  <div class="login-container">
    <el-card class="login-card">
        <h2 class="login-title">Login</h2>      
      <el-form class="form" @submit.prevent="login">
        <el-form-item  for="username">
          <el-input placeholder="Username" class="test"  clearable maxlength="20" show-word-limit v-model="username" type="text" id="username" required @keyup.enter="login"></el-input>
        </el-form-item>
        <el-form-item  for="password">
          <el-input placeholder="Password" class="test" clearable v-model="password" type="password" id="password" required @keyup.enter="login"></el-input>
        </el-form-item>
        <el-form-item  class="login-btn">
          <el-button  round type="primary" @click="login">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
  
<script>
  import { ElNotification } from 'element-plus'
  import axios from 'axios';
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      token: null,
      apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com' // Default to localhost
    };
  },
  methods: {
    async login() {
  const userData = {
    username: this.username,
    password: this.password,
  };

  try {
    console.log("userdata: " + userData.username + "::: " + userData.password)
    const response = await axios.post(`${this.apiUrl}/users/login`, userData);
    console.log('Login response:', response.data);

    if (response.data.success) {
      // Store the user and token in local state
      this.user = response.data.user;
      this.token = response.data.token;
      this.$store.dispatch('login', { token: this.token, userId: response.data.userId, username: userData.username }); 
      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', userData.username);

      // Redirect to /userlist only if login is successful
      this.$router.push('/userlist');
    } else {
      // Handle unsuccessful login (e.g., show an error message)
      console.error('Login unsuccessful:', response.data.message);

      // Check if the error is due to an expired token
      if (response.data.message === 'Forbidden: Invalid token') {
        // Redirect to login page or handle it as appropriate
        this.$router.push('/login');
      }
    }
  } catch (error) {
    console.error('Error logging in:', error);
    ElNotification.error("Falscher Login");
    // Redirect to login page or handle the error as appropriate
    this.$router.push('/login');
  }
},  
  },
};
</script>
  
<style scoped>


.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}

.login-card {
  width: 400px;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.login-btn {
  text-align: center;
  margin-top: 20px;
}
  
</style>
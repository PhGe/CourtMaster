<template>
  <Header></Header>
  <h1 class="page-title">Settings</h1>
  <div class="settings-container">
    <el-card class="password-card">
      <h3 slot="header">Change Password </h3>
      <el-form ref="passwordForm" :model="passwordForm" class="password-form">
        <el-form-item label="Current Password" prop="currentPassword" class="form-item">
          <el-input type="password" v-model="passwordForm.currentPassword" placeholder="Enter current password"></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPassword" class="form-item">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="Enter new password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm New Password" prop="confirmNewPassword" class="form-item">
          <el-input type="password" v-model="passwordForm.confirmNewPassword" placeholder="Confirm new password"></el-input>
        </el-form-item>
        <el-form-item class="button-item">
          <el-button type="primary" @click="changePassword" :loading="loading">Change Password</el-button>
        </el-form-item>
        <el-alert v-if="errorMessage" title="Error" type="error" :closable="false" center>{{ errorMessage }}</el-alert>
        <el-alert v-if="successMessage" title="Success" type="success" :closable="false" center>{{ successMessage }}</el-alert>
      </el-form>
    </el-card>
  </div>
</template>


<script>
import axios from 'axios';
import Header from '../components/Header.vue'

export default {
  name: 'SettingsComponent',
  components: { Header },
  data() {
    return {
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      loading: false,
      errorMessage: '',
      successMessage: '',
      apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login' // Default to localhost
    };
  },
  methods: {
    async changePassword() {
      try {
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm;
        
        // Check if new passwords match
        if (newPassword !== confirmNewPassword) {
          throw new Error('New passwords do not match');
        }

        // Send a POST request to the server to change the password
        const authToken = localStorage.getItem('authToken');
        const username = localStorage.getItem('username')
        const response = await axios.post(`${this.apiUrl}/users/change-password`, {
          username: username, // You need to replace 'username' with the actual username of the logged-in user
          currentPassword,
          newPassword,
          confirmNewPassword
        }, {
          headers: {
            'Authorization': authToken,
          }
        });

        // Handle the response from the server
        if (response.data.success) {
          // Password changed successfully
          this.successMessage = 'Password changed successfully';
        } else {
          // Password change failed
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        // Handle any errors that occur during password change process
        this.errorMessage = "current password is wrong or new passwords didn't match";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>

.password-card{
  width: fit-content;
}

.settings-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.password-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-item {
  margin-bottom: 15px;
}

.button-item {
  text-align: center;
  margin-top: 20px;
}

.el-alert {
  margin-top: 10px;
}

@media (max-width: 600px) {
  .password-form {
    max-width: 90%; /* Adjust max-width for smaller screens */
  }
}
</style>


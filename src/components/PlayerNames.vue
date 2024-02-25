
  <template>
    <div>
      <el-container>
        <el-row>
         <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="user in users" :key="user.id">
        <el-descriptions
        direction="vertical"
        border>
          <el-descriptions-item>{{ user.username }} 
            <el-tag size="small" :type="user.role === 'admin' ? 'danger' : (user.role === 'trainer' ? 'warning' : '')" >{{ user.role }}</el-tag>
          </el-descriptions-item>
      </el-descriptions>
    </el-col>
   </el-row>
  </el-container>
</div>
  </template>

  <script>
  export default {
    methods: {
      async authenticateWithToken() {
        try {
          // Retrieve the token from localStorage
          const authToken = await this.getToken();
          console.log(authToken)
  
          // Make a request to /authenticate with the token
          const responseAuthenticate = await fetch(`${this.apiUrl}/users/authenticate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
          });
          console.log(responseAuthenticate)
          // Handle the response from /authenticate
          const dataAuthenticate = await responseAuthenticate.json();
          console.log(dataAuthenticate)
          // Use the obtained token from /authenticate to make another request to /users/all
          await this.fetchUserData(dataAuthenticate.token);
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      },
      async fetchUserData(authToken) {
        try {
          // Make an authenticated request to get user data using the obtained token
          const responseUserData = await fetch(`${this.apiUrl}/users/all`, {
            headers: {
              'Authorization': authToken,
            },
          });
  
          // Handle the response from /users/all
          const userData = await responseUserData.json();
          this.users = userData;
        } catch (error) {
          console.error('Error fetching users:', error);
          this.$router.push('/login');
        }
      },
      async getToken() {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');
        console.log(token)
        return token;
      },
    },
    data() {
      return {
        users: [], // This is where you store the fetched users
        apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login' // Default to localhost
      };
    },
    mounted() {
      // Call the authenticateWithToken method to use the token and fetch user data
      this.authenticateWithToken();
    },
  };
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  
  </style>

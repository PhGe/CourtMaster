
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
    data() {
      return {
        users: [], // This is where you store the fetched users
      };
    },
    mounted() {
  // Make an HTTP request to your backend API to authenticate and get a token
  fetch('https://courtmasterapp.azurewebsites.net/users/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const authToken = data.token;

      // Make an authenticated request to get user data using the obtained token
      fetch('https://courtmasterapp.azurewebsites.net/users/all', {
        headers: {
          Authorization: authToken,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          this.users = userData;
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
        });
    })
    .catch((error) => {
      console.error('Authentication failed:', error);
    });
},
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  
  </style>

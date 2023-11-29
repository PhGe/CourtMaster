<template>
    <div>
      <el-descriptions
      title="User"
      direction="vertical"
      :column="4"
      :size="size"
      border>
      <el-descriptions-item v-for="user in users" :key="user.id" >{{ user.username }} <el-tag size="small">{{ user.role }}</el-tag></el-descriptions-item>
    </el-descriptions>
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
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li::before {
    content: '•'; /* Use a bullet point as the content before the li */
    color: blue;
    margin-right: 5px; /* Adjust margin if needed */

  }
  
  </style>

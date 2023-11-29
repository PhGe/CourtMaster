<template>
    <div>
      <h1>List of current users</h1>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.username }} - {{ user.role }}
        </li>
      </ul>
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
  fetch('http://localhost:3000/users/authenticate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const authToken = data.token;

      // Make an authenticated request to get user data using the obtained token
      fetch('http://localhost:3000/users/all', {
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

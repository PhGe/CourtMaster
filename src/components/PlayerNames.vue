<template>
    <div>
      <h1>User Lista</h1>
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
      // Make an HTTP request to your backend API
      fetch('http://localhost:3000/users/v1')
        .then((response) => response.json())
        .then((data) => {
          // Update the users data with the fetched data
          this.users = data;
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
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

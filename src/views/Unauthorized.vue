<template>
    <div class="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>Sorry, you are not authorized to access this page.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UnauthorizedView',
  }
  </script>
  
  <style scoped>
  .unauthorized-container {
    background-color: #f8d7da; /* Light red background color */
    color: #721c24; /* Dark red text color */
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  </style>
  
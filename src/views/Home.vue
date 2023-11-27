<!-- Home.vue -->
<template>
    <div>
      <h1>Welcome to My App</h1>
      <router-link to="/subpage">Go to Subpage</router-link>
      <router-link to="/login">Go to login</router-link>
    </div>
  </template>

  <script>
  export default {
    name: 'HomeView',

    };
</script>
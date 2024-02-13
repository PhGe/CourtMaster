<!-- App.vue -->
<template>
  <div>
   <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    if (authToken && userId && username && userRole) {
      this.$store.commit('setAuthToken', authToken);
      this.$store.commit('setUserId', userId);
      this.$store.commit('setUsername', username);
      this.$store.commit('setUserrole', userRole);
    }
  }
};

  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    
  }
  img{
    width: 150px;
    height: 150px;
  }
  </style>
  
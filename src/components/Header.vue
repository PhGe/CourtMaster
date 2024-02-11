<template>
    <div class="header-container">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="calendar" @click="goToRoute('calendar')">Calendar</el-menu-item>
        <el-menu-item index="userlist" @click="goToRoute('userlist')">Userlist</el-menu-item>
        <el-menu-item v-if="isAdmin" index="admin" @click="goToRoute('admin')">Admin</el-menu-item>
        <div class="flex-grow" />
  
        <!-- Add more route links as needed -->
        <el-sub-menu index="profile">
          <template #title>{{ username }}</template>
          <el-menu-item @click="goToRoute('bookings')">Bookings</el-menu-item>
          <el-menu-item @click="goToRoute('settings')">Settings</el-menu-item>
          <el-menu-item @click="handleLogout">Logout</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </template>
  
  <script>
  import { logout } from '../utils/authUtils';
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'HeaderComponent',
    data() {
      return {
        username: '',
        activeIndex: '',
        handleSelect: '',
      };
    },
    computed: {
    ...mapGetters(['getUsername', 'getUserRole']),
    isAdmin() {
      console.log("Role:" +this.getUserRole)
      return this.getUserRole === 'admin';
    }
  },
    mounted() {
      this.username = localStorage.getItem('username');
    },
    methods: {
      handleLogout() {
        logout();
        localStorage.removeItem('authToken');
        this.$router.push('/login');
      },
      goToRoute(routeName) {
        this.$router.push({ name: routeName });
      },
    },
  };
  </script>
  
  <style scoped>
  .header-container {
    background-color: #f0f0f0; /* Add a background color for the header */
    border-radius: 20px;
    padding: 10px 20px; /* Add padding to the header container */
  }
  
  .flex-grow {
    flex-grow: 1;
  }
  
  .el-menu-item {
    margin-left: 20px; 
  }
  
  /* Style for menu items */
  .el-menu-item,
  .el-submenu__title {
    color: #333; /* Set text color */
  }
  
  .el-menu-item:hover,
  .el-submenu__title:hover {
    background-color: #e0e0e0; /* Add background color on hover */
  }
  
  /* Style for active menu item */
  .el-menu-item.is-active,
  .el-submenu.is-active > .el-submenu__title {
    background-color: #007bff; /* Set active background color */
    color: #fff; /* Set active text color */
  }
  
  /* Style for submenu arrow */
  .el-submenu__icon-arrow {
    color: #555; /* Set color for submenu arrow */
  }
  
  </style>
  
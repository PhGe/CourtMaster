<template>
    <div class="header-container">
      <div class="profile-section">
        <img src="../assets/10015419.png" alt="Profile Picture" class="profile-picture">
        <div class="profile-menu">
          <el-dropdown>
            <span class="el-dropdown-link">
                {{ username }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleMenuClick('profile')" >Profile</el-dropdown-item>
                <el-dropdown-item @click="handleMenuClick('settings')">Settings</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </template>
  
  <script>
    import { logout } from '../utils/authUtils';

  export default {
    name: 'HeaderComponent',
    data() {
      return {
        isProfileMenuOpen: false,
        isBurgerMenuOpen: false,
        username: '',
      };
    },
    mounted() {
      this.username = localStorage.getItem('username');
    },
    methods: {
      openProfileMenu() {
        this.isProfileMenuOpen = true;
      },
      closeProfileMenu() {
        this.isProfileMenuOpen = false;
      },
      toggleBurgerMenu() {
        this.isBurgerMenuOpen = !this.isBurgerMenuOpen;
      },
      handleMenuClick(command) {
        // Handle menu click based on the command
        console.log('Menu item clicked:', command);
      },
      handleLogout() {
 
      logout();
      // Clear user session data
      localStorage.removeItem('authToken');
      // Optionally, redirect the user to the login page
      this.$router.push('/login');
    }
    }
  };
  </script>
  
  <style scoped>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
  }
  
  .profile-section {
    display: flex;
    align-items: center;
  }
  
  .profile-picture {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .burger-menu {
    cursor: pointer;
  }
  
  .username {
    cursor: pointer;
  }
  
  .profile-menu {
    position: relative;
  }
  
  .profile-dropdown-menu,
  .burger-dropdown-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 0;
    display: none;
    min-width: 160px;
  }
  
  .profile-menu:hover .profile-dropdown-menu,
  .burger-menu:hover .burger-dropdown-menu {
    display: block;
  }
  
  .profile-dropdown-menu li,
  .burger-dropdown-menu li {
    padding: 8px 20px;
    cursor: pointer;
    color: #333;
  }
  
  .profile-dropdown-menu li:hover,
  .burger-dropdown-menu li:hover {
    background-color: #cd0f0f;
  }
  </style>
  
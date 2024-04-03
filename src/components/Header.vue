<template>
  <div class="header-container">
    <!-- Burger Icon for Mobile Menu -->
    <el-icon class="burger-menu" @click="toggleMobileMenu" size="large" name="el-icon-menu"></el-icon>
    
    <!-- Menu Items -->
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      v-show="!isMobileMenuOpen"
      @select="handleSelect"
    >
      <el-menu-item index="calendar" @click="goToRoute('calendar')">Calendar
        <el-icon :size="20" style="margin-left: 20px"><Calendar /></el-icon>
      </el-menu-item>
      <el-menu-item index="userlist" @click="goToRoute('userlist')">Userlist
        <el-icon :size="20" style="margin-left: 20px"><List /></el-icon>
        </el-menu-item>
      <el-menu-item v-if="isAdmin" index="admin" @click="goToRoute('admin')">Admin
        <el-icon :size="20" style="margin-left: 20px"><Operation /></el-icon>
      </el-menu-item>
      <div class="flex-grow" />

      <!-- Add more route links as needed -->
      <el-sub-menu index="profile">
        <template #title>{{ username }}
          <el-icon :size="20" style="margin-left: 20px"><UserFilled /></el-icon>
        </template>
        <el-menu-item @click="goToRoute('bookings')">
          <el-icon :size="20" style="margin-left: 10px"><Document /></el-icon>
          Bookings</el-menu-item>
        <el-menu-item @click="goToRoute('settings')">
          <el-icon :size="20" style="margin-left: 10px"><Setting /></el-icon>
          Settings</el-menu-item>
        <el-menu-item @click="handleLogout">
          <el-icon :size="20" style="margin-left: 10px"><TurnOff /></el-icon>
          Logout</el-menu-item>
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
      isMobileMenuOpen: false // Flag to track mobile menu state
    };
  },
  computed: {
    ...mapGetters(['getUsername', 'getUserRole']),
    isAdmin() {
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
    toggleMobileMenu() {
      // Toggle mobile menu state
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
};
</script>

<style scoped>
/* Style for Burger Menu Icon */
.burger-menu {
  cursor: pointer;
}

/* Style for Desktop Menu */
.el-menu {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
}

/* Media Query for Mobile */
@media (max-width: 767px) {
  .burger-menu {
    display: flex; /* Show burger menu icon on smaller screens */
    justify-content: flex-end; /* Align burger menu icon to the right */
  }

  /* Hide menu items when mobile menu is open */
  .el-menu-demo {
    display: none;
  }

  /* Show menu items in a column when mobile menu is open */
  .el-menu-demo.show-mobile {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50px; /* Adjust this value as needed */
    right: 0;
    background-color: #f0f0f0;
    border-radius: 0 0 20px 20px;
  }
}
</style>

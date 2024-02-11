<template>
    <div>
      <Header></Header>
      <h1 class="page-title">Admin Board</h1>
      <div class="admin-container">
        <div class="admin-options">
          <el-card class="admin-option-card">
            <h3 slot="header">Manage Courts</h3>
            <!-- Elements for managing courts (e.g., add new court, edit court details) -->
          </el-card>
          <el-card class="admin-option-card">
            <h3 slot="header">Cancel Bookings</h3>
            <!-- Elements for canceling bookings (e.g., search bookings, cancel bookings) -->
          </el-card>
          <el-card class="admin-option-card">
            <h3 slot="header">Invoice</h3>
            <!-- Link to the invoice page for generating and viewing invoices -->
          </el-card>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Header from '../components/Header.vue'
  


  export default {
    name: 'AdminBoard',
    components: {
      Header
    },
    data() {
      return {
        // Data properties if needed
      };
    },
    methods: {
      // Methods for handling admin functionalities
    }
  };
  </script>
  
  <style scoped>
  .admin-container {
    padding: 20px;
  }
  
  .admin-options {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .admin-option-card {
    width: 300px;
    margin-bottom: 20px;
  }
  </style>
  
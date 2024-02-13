<template>
  <div>
    <Header></Header>
    <h1 class="page-title">Admin Board</h1>
    <div class="admin-container">
      <div class="admin-options">
        <el-card class="admin-option-card">
          <h3 slot="header">Manage Courts</h3>
          <CourtsManagement></CourtsManagement>
          <!-- Elements for managing courts (e.g., add new court, edit court details) -->
        </el-card>
        <el-card class="admin-option-card">
          <h3 slot="header">Cancel Bookings</h3>
          <AdminBooking :authToken="authToken" />
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
import Header from '../components/Header.vue';
import AdminBooking from '../components/AdminBooking.vue';
import CourtsManagement from '../components/CourtsManagement.vue';

export default {
  name: 'AdminBoard',
  components: {
    Header,
    AdminBooking,
    CourtsManagement
  },
  data() {
    return {
      authToken: localStorage.getItem('authToken')
    };
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

.booking-list {
  margin-top: 20px;
}

.booking-card {
  margin-bottom: 20px;
}

.booking-card-header {
  padding: 10px;
  background-color: #f0f0f0;
  font-weight: bold;
}

.booking-card-content {
  padding: 10px;
}

.booking-card-footer {
  padding: 10px;
  text-align: right;
}

.el-card{
  width: 700px;
}

</style>

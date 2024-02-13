<template>
    <div>
      <el-card v-for="booking in bookings" :key="booking.booking_id" class="booking-card">
        <!-- Booking card content -->
        <div slot="header" class="booking-card-header">
          <span>Booking ID: {{ booking.booking_id }}</span>
        </div>
        <div class="booking-card-content">
          <p>User ID: {{ booking.user_id }}</p>
          <p>Booking Date: {{ booking.booking_date }}</p>
          <p>Time Slot: {{`${booking.booking_starttime}-${booking.booking_endtime}`}}</p>
          <p>Court ID: {{ booking.court_id }}</p>
        </div>
        <div class="booking-card-footer">
          <el-button type="danger" @click="cancelBooking(booking.booking_id)">Cancel Booking</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'BookingsList',
    props: {
      authToken: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        bookings: [],
        apiUrl: process.env.API_BASE_URL || 'https://court-master-e4c0d72c16c5.herokuapp.com' // Default to localhost
      };
    },
    created() {
      this.fetchBookings();
    },
    methods: {
      async fetchBookings() {
        try {
          const response = await axios.get(`${this.apiUrl}/booking/all`, {
            headers: {
              'Authorization': this.authToken,
            }
          });
          this.bookings = response.data;
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      },
      async cancelBooking(bookingId) {
        try {
          await axios.delete(`${this.apiUrl}/booking/cancel/${bookingId}`, {
            headers: {
              'Authorization': this.authToken,
            }
          });
          console.log('Booking canceled successfully');
          this.fetchBookings();
        } catch (error) {
          console.error('Error canceling booking:', error);
        }
      },
    }
  };
  </script>
  
  <style scoped>
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
  </style>
  
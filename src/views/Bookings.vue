<template>
    <Header></Header>
    <div class="bookings-container">
      <h2>Your Bookings</h2>
      <el-card v-for="booking in bookings" :key="booking.booking_id" class="booking-card">
        <div slot="header" class="booking-card-header">
          <span>Booking ID: {{ booking.booking_id }}</span>
        </div>
        <div class="booking-card-content">
          <p>User ID: {{ booking.user_id }}</p>
          <p>Booking Date: {{ booking.booking_date }}</p>
          <p>Time Slot: {{`${booking.booking_starttime}-${booking.booking_endtime}`}}</p>
          <p>Court ID: {{ booking.court_id }}</p>
          <!-- Add more details as needed -->
        </div>
        <div class="booking-card-footer">
          <el-button type="danger" @click="cancelBooking(booking.booking_id)">Cancel Booking</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Header from '../components/Header.vue';
  import { mapGetters } from 'vuex';
  export default {
    name: 'BookingsComponent',
    components: {
      Header,
    },
    data() {
      return {
        bookings: [],
        userId: null,
      };
    },
    created() {
      this.fetchBookings();
    },
    computed: {
     ...mapGetters(['getUserId']),
    },
    methods: {
        async fetchBookings() {
      try {
        const authToken = localStorage.getItem('authToken');
        const userId = this.$store.getters.getUserId;
        console.log(userId)
        const response = await axios.get('http://localhost:3000/booking/allByUser', {
          headers: {
            'Authorization': authToken,
          },
          params: {
        userId: userId
      }
        });
        const bookings = response.data;
        console.log('Bookings fetched:', bookings);
        this.bookings = bookings;
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    },
    async cancelBooking(bookingId) {
      try {
        const authToken = localStorage.getItem('authToken');
        // Make a DELETE request to cancel the booking with the provided booking ID
        await axios.delete(`http://localhost:3000/booking/cancel/${bookingId}`, {
          headers: {
            'Authorization': authToken,
          }
        });
        console.log('Booking canceled successfully');
        // After canceling the booking, fetch the updated bookings list
        this.fetchBookings();
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    },
  }
};
  </script>
  
  <style scoped>
  .bookings-container {
    padding: 20px;
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
  </style>
  
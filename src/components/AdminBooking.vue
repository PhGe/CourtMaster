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
          <el-button type="primary" @click="generateInvoice(booking)">Generate Invoice</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import jsPDF from 'jspdf'; // Import jsPDF

  
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
      generateInvoice(booking) {
    try {
      const doc = new jsPDF(); // Create a new instance of jsPDF
      doc.text('Invoice', 105, 10, { align: 'center' });
      doc.text(`Booking ID: ${booking.booking_id}`, 20, 30);
      doc.text(`User ID: ${booking.user_id}`, 20, 40);
      doc.text(`Booking Date: ${booking.booking_date}`, 20, 50);
      doc.text(`Time Slot: ${booking.booking_starttime}-${booking.booking_endtime}`, 20, 60);
      doc.text(`Court ID: ${booking.court_id}`, 20, 70);
      doc.save(`invoice_${booking.booking_id}.pdf`);
      console.log(`Invoice generated for booking ID: ${booking.booking_id}`);
    } catch (error) {
      console.error('Error generating invoice:', error);
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
  
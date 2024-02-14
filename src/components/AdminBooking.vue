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
    
    // Add Logo (Assuming you have a logo image file named logo.png)
    const docWidth = doc.internal.pageSize.getWidth();
    const logoImg = new Image();
    logoImg.src = require('@/assets/STCLogo.png'); // Set the path to your logo image
    doc.addImage(logoImg, 'PNG', 80, 10, 35, 35); // Adjust coordinates and dimensions as needed

    // Add Tennisclub Blau-Weiss Saarlouis im Stadtgarten in bright blue
    doc.setTextColor(38,140,200); // Set text color to bright blue
    doc.setFontSize(25); // Set font size for the club name
    doc.text('Tennisclub Blau-Weiss Saarlouis im Stadtgarten', 105, 80, { align: 'center' });

    // Reset text color to black
    doc.setTextColor(0, 0, 0);

    // Add invoice details
    doc.setFontSize(12); // Set font size for invoice details

    // Add user details
    const userDetails = [
      //  `Gender: ${booking.gender}`,
      `Andrede: Herr`,
      // `${booking.firstname} ${booking.lastname}`,
      `Philipp Gerard`,
      //  `(${booking.email})`,
      `(gerard.philipp@web.de)`,
      '..........................................',
      // `${booking.citycode} ${booking.cityname}`,
      `66798 Wallerfangen`,
    ];

    const dateText = `Date: ${new Date().toLocaleDateString()}`;
    const dateTextWidth = doc.getStringUnitWidth(dateText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const dateX = docWidth - dateTextWidth - 20; // Adjust as needed

    userDetails.forEach((detail, index) => {
      doc.text(detail, 20, 100 + index * 10); // Adjust Y coordinate for spacing
    });

    doc.text(dateText, dateX, 100 + (userDetails.length - 1) * 10); // Adjust Y coordinate to align with city code

    // Add invoice type and booking number
    doc.setFont(undefined,'bold');
    doc.text(`Invoice Type: Hallen-Abo Saison 2023 / 2024 - Rechnungsnummer: ${booking.booking_id}`, 20, 180);

    // Add pricing details
    doc.setFont(undefined,'normal');
    const priceDetails = [
      `Court Price: 50€`,
      `Lighting Charge: 2€ *  45std`,
    ];

    // Calculate the maximum width of the price details
    let maxWidth = 0;
    priceDetails.forEach(detail => {
      const width = doc.getStringUnitWidth(detail) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      if (width > maxWidth) {
          maxWidth = width;
      }
    });

    // Adjust X coordinate for aligning the price details to the right side
    const startX = 200; // Start X coordinate for aligning to the right side

    priceDetails.forEach((detail, index) => {
      const startY = 200 + index * 10; // Adjust Y coordinate for spacing
      const adjustedX = startX - maxWidth; // Adjust X coordinate based on the maximum width
      doc.text(detail, adjustedX, startY);
    });

    // Calculate total sum
    const totalSum = 40; // Add more charges if needed

// Add the "Total Sum" as part of the price details
const totalSumText = `Total Sum: ${totalSum}€`;
const totalSumWidth = doc.getStringUnitWidth(totalSumText) * doc.internal.getFontSize() / doc.internal.scaleFactor;

// Adjust X coordinate for aligning the "Total Sum" to the right side
const totalSumX = startX - totalSumWidth - 10; // Adjust X coordinate based on the width of the "Total Sum" text

// Set text color of "Total Sum" to red
doc.setTextColor(255, 0, 0);

// Adjust Y coordinate to center the "Total Sum" text vertically
const totalSumY = 210 + priceDetails.length * 10 + 5;

// Add the "Total Sum" text
doc.text(totalSumText, totalSumX, totalSumY);

// Reset text color to black
doc.setTextColor(0, 0, 0);

    // Save the invoice with a filename including the booking ID
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
  
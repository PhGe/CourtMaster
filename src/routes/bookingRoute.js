// Import necessary modules
const express = require('express');
const authenticateToken = require('../../middleware/authenticate.js');
const router = express.Router();



// Define the booking route
const bookingRoute = (pool) => {

    router.post('/book', authenticateToken, async (req, res) => {
        try {
          // Extract booking data from the request body
          const { date, time, courtId, userId } = req.body;
          console.log(date, time, courtId, userId)
          
          // Save booking information to the database
          const query = `
            INSERT INTO bookings (user_id, court_id, booking_date, booking_time, booking_status)
            VALUES ($1, $2, $3, $4, $5)
          `;
          
          // Extract start time and end time from the time slot
          const [startTime, endTime] = time.split('-');
          
          // Execute the SQL query
          await pool.query(query, [userId, courtId, date, startTime, endTime]);
      
          // Send success response to the frontend
          res.status(200).json({ message: 'Booking confirmed successfully' });
        } catch (error) {
          console.error('Error confirming booking:', error);
          // Send error response to the frontend
          res.status(500).json({ error: 'Failed to confirm booking' });
        }
      });

  return router; // Return the router instance
};

module.exports = bookingRoute; // Export the bookingRoute function

//bookinRoute.js
// Import necessary modules
const express = require('express');
const authenticateToken = require('../../middleware/authenticate.js');
const router = express.Router();



// Define the booking route
const bookingRoute = (pool) => {

/**
 * @swagger
 * /booking/all:
 *   get:
 *     summary: Get a list of bookings
 *     description: Returns a list of bookings from the database.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of bookings.
 *         content:
 *           application/json:
 *             example:
 *               - booking_id: 69
 *                 user_id: 33
 *                 booking_date: 2024-02-10
 *                 booking_starttime: 10:00:00
 *                 court_id: 1
 *                 booking_status: pending
 *                 created_at: 2024-02-08 05:22:42 +0000
 *                 booking_endtime: 11:00:00
 *               - booking_id: 420
 *                 user_id: 341
 *                 booking_date: 2023-12-24
 *                 booking_starttime: 12:00:00
 *                 court_id: 3
 *                 booking_status: confirmed
 *                 created_at: 2024-02-10 16:35:41 +0000
 *                 booking_endtime: 13:00:00
 */

    // Define a route to get bookings
    router.get('/all',authenticateToken, async (req, res) => {
        try {
          // Query to get all bookings
          const result = await pool.query('SELECT * FROM bookings');
          const bookings = result.rows;
      
          // Send the bookings data as a JSON response
          res.json(bookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });

      router.get('/allByUser', authenticateToken, async (req, res) => {
        try {
          // Get the user ID from the query parameters
          console.log(req.query)
          const userId = req.query.userId;
          console.log(userId)
          // Query to get bookings associated with the user ID
          const query = 'SELECT * FROM bookings WHERE user_id = $1';
          const result = await pool.query(query, [userId]);
          const bookings = result.rows;
      
          // Send the bookings data as a JSON response
          res.json(bookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          res.status(500).json({ error: 'Internal Server Error' });

        }
      });
      

    router.post('/book', authenticateToken, async (req, res) => {
        try {
          // Extract booking data from the request body
          const { date, time, courtId, userId } = req.body;
          console.log(req.body)
          console.log(date, time, courtId, userId)

                    
          // Extract start time and end time from the time slot
          const [startTime, endTime] = time.split('-');

          
          const bookingStatus = 'confirmed';
          
          // Save booking information to the database
          const query = `
            INSERT INTO bookings (user_id, court_id, booking_date, booking_starttime , booking_endtime, booking_status)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;

            // Execute the SQL query
            await pool.query(query, [userId, courtId, date, startTime, endTime ,bookingStatus]);

            const updateQuery = ` UPDATE bookings SET booking_status = 'confirmed' 
            WHERE user_id = $1 AND court_id = $2 AND booking_date = $3 AND booking_starttime = $4 AND booking_endtime = $5;`;

            await pool.query(updateQuery, [userId, courtId, date, startTime, endTime]);         
      
          // Send success response to the frontend
          res.status(200).json({ message: 'Booking confirmed successfully' });
        } catch (error) {
          console.error('Error confirming booking:', error);
          // Send error response to the frontend
          res.status(500).json({ error: 'Failed to confirm booking' });
        }
      });

    router.delete('/cancel/:bookingId', authenticateToken, async (req, res) => {
      try {
          const { bookingId } = req.params;
  
          // Define the SQL query to delete the booking with the provided booking ID
          const query = `
              DELETE FROM bookings
              WHERE booking_id = $1
          `;
  
          // Execute the SQL query
          await pool.query(query, [bookingId]);
  
          // Send a success response to the client
          res.status(200).json({ message: 'Booking canceled successfully' });
      } catch (error) {
          console.error('Error canceling booking:', error);
          // Send an error response to the client
          res.status(500).json({ error: 'Failed to cancel booking' });
      }
  });
    

      /**
 * @swagger
 * /booking/availability:
 *   get:
 *     summary: Get a list of availability
 *     description: Returns a list of availability from the database.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of availability.
 *         content:
 *           application/json:
 *             example:
 *               - booking_starttime: 10:00:00
 *                 booking_endtime: 11:00:00
 *               - booking_starttime: 12:00:00
 *                 booking_endtime: 13:00:00
 */

    router.get('/availability', authenticateToken, async (req, res) => {
        try {
            const { courtId, date } = req.query;

            // Query to retrieve booked time slots for the specified court and date
            const query = `
                SELECT booking_starttime, booking_endtime
                FROM bookings
                WHERE court_id = $1 AND booking_date = $2 AND booking_status = 'confirmed'
            `;

            // Execute the SQL query
            const result = await pool.query(query, [courtId, date]);
            const bookedTimeSlots = result.rows.map(row => `${row.booking_starttime}-${row.booking_endtime}`);
            console.log(bookedTimeSlots)
            // Send the list of booked time slots as a JSON response
            res.json(bookedTimeSlots);
        } catch (error) {
            console.error('Error fetching booked time slots:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        });

    

  return router; // Return the router instance
};

module.exports = bookingRoute; // Export the bookingRoute function

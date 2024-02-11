// Import necessary modules
const express = require('express');
const authenticateToken = require('../../middleware/authenticate.js');
const router = express.Router();

// Define the booking route
const CourtRoute = (pool) => {

/**
 * @swagger
 * /courts/all:
 *   get:
 *     summary: Get a list of Courts
 *     description: Returns a list of Courts from the database.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of Courts.
 *         content:
 *           application/json:
 *             example:
 *               - court_id: 1
 *                 court_name: Platz 1
 *                 court_type: Tennis
 *                 location: 123 Hauptstraße, München, Deutschland
 *                 capacity: 4
 *                 available: true
 *                 created_at: 2023-12-25T11:22:16.532Z
 * 
 *               - court_id: 2
 *                 court_name: Platz 2
 *                 court_type: paddle
 *                 location: 123 Mönchplatz, Linz, Österreich
 *                 capacity: 2
 *                 available: false
 *                 created_at: 2023-12-26T11:23:11.212Z
 */

router.get('/all', authenticateToken, async (req, res) => {
    try {
      // Your booking logic goes here
      const result = await pool.query('SELECT * FROM courts');
      //console.log(result); // Log the query result for debugging purposes
      res.json(result.rows); // Send the query result as a JSON response
    } catch (error) {
      console.error('Error during booking:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  router.get('/:courtId/availability', authenticateToken, async (req, res) => {
    const { courtId } = req.params;

    try {
        // Query the database to retrieve existing time slots for the specified court
        const timeSlotsQuery = await pool.query('SELECT start_time, end_time FROM court_time_slots WHERE court_id = $1', [courtId]);
        // Extract start and end times from the query result
        console.log(timeSlotsQuery)
        const availableTimeSlots = timeSlotsQuery.rows.map(row => `${row.start_time}-${row.end_time}`);
        console.log(availableTimeSlots)
        // Send the list of available time slots as a JSON response
        res.json({ availableTimeSlots });
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});




  return router; // Return the router instance
};

module.exports = CourtRoute; // Export the bookingRoute function

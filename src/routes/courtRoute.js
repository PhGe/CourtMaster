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
      // Fetch data from courts and courts_time_slots tables
      const courtsResult = await pool.query('SELECT * FROM courts');
      const timeSlotsResult = await pool.query('SELECT * FROM court_time_slots');

      console.log(courtsResult)
      console.log(timeSlotsResult)
      // Process the results to include time slots in the courts data
      const courtsWithTimeSlots = courtsResult.rows.map(court => {
          // Filter time slots for the current court
          const courtTimeSlots = timeSlotsResult.rows.filter(slot => slot.court_id === court.court_id);

          // Format time slots as "start_time-end_time"
          const formattedTimeSlots = courtTimeSlots.map(slot => `${slot.start_time}-${slot.end_time}`);

          // Add formatted time slots to the court object
          return {
              ...court,
              timeSlots: formattedTimeSlots
          };
      });

      // Send the processed data as a JSON response
      res.json(courtsWithTimeSlots);
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


router.get('/all/:courtId', authenticateToken, async (req, res) => {
  const { courtId } = req.params;
  try {
      // Fetch data from courts and courts_time_slots tables
      const courtResult = await pool.query('SELECT * FROM courts WHERE court_id = $1', [courtId]);
      const timeSlotsResult = await pool.query('SELECT * FROM court_time_slots WHERE court_id = $1', [courtId]);

      console.log(courtResult);
      console.log(timeSlotsResult);

      // Check if the court with the specified ID exists
      if (courtResult.rows.length === 0) {
          return res.status(404).json({ error: 'Court not found' });
      }

      const court = courtResult.rows[0]; // Get the first (and only) court object

      // Process the results to include time slots in the court data
      const courtTimeSlots = timeSlotsResult.rows.map(slot => `${slot.start_time}-${slot.end_time}`);

      // Add formatted time slots to the court object
      court.timeSlots = courtTimeSlots;

      // Send the processed court data as a JSON response
      res.json(court);
  } catch (error) {
      console.error('Error during booking:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/:courtId', authenticateToken, async (req, res) => {
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


router.delete('/delete/:court_id', authenticateToken, async (req, res) => {
  try {
      const { court_id } = req.params;
      console.log(court_id)
      // Define the SQL query to delete the booking with the provided booking ID
      const query = `
          DELETE FROM courts
          WHERE court_id = $1
      `;

      // Execute the SQL query
      await pool.query(query, [court_id]);

      // Send a success response to the client
      res.status(200).json({ message: 'Court deleted successfully' });
  } catch (error) {
      console.error('Error deleting Court:', error);
      // Send an error response to the client
      res.status(500).json({ error: 'Failed to delete Court' });
  }
});

router.post('/new', authenticateToken, async (req, res) => {
  try {
    const { court_name, court_type, location, capacity, available } = req.body;

    const query = `
      INSERT INTO courts (court_name, court_type, location, capacity, available)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [court_name, court_type, location, capacity, available];
    const result = await pool.query(query, values);

    // Send the newly created court as a JSON response
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating new court:', error);
    res.status(500).json({ error: 'Failed to create new court' });
  }
});

router.put('/edit/:courtId', authenticateToken, async (req, res) => {
  try {
    const { courtId } = req.params;
    const { court_name, court_type, location, capacity, available } = req.body;

    const query = `
      UPDATE courts 
      SET court_name = $1, court_type = $2, location = $3, capacity = $4, available = $5
      WHERE court_id = $6
      RETURNING *;
    `;
    const values = [court_name, court_type, location, capacity, available, courtId];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }

    // Send the updated court as a JSON response
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({ error: 'Failed to update court' });
  }
});

router.post('/delete-timeslots/:courtId', authenticateToken, async (req, res) => {
  try {
      const { courtId } = req.params;
      const { unselectedTimeslots } = req.body;

      // Define the SQL query to delete the unselected time slots for the specified court
      let query = `
        DELETE FROM court_time_slots
        WHERE court_id = $1 AND (`;

      // Construct the query dynamically to include all the unselected time slots
      const values = [courtId];
      for (let i = 0; i < unselectedTimeslots.length; i++) {
        query += `(start_time = $${i * 2 + 2} AND end_time = $${i * 2 + 3})`;
        values.push(...unselectedTimeslots[i].split('-')); // Split the time slot string into start and end times
        if (i < unselectedTimeslots.length - 1) {
          query += ' OR ';
        }
      }

      query += ')';

      // Perform deletion of unselected time slots from the database for the specified court
      await pool.query(query, values);

      // Send a success response
      res.status(200).json({ message: 'Unselected time slots deleted successfully' });
  } catch (error) {
      console.error('Error deleting unselected time slots:', error);
      res.status(500).json({ error: 'Failed to delete unselected time slots' });
  }
});

// Define the route for adding timeslots to a court
router.post('/add-timeslots/:courtId', authenticateToken, async (req, res) => {
  console.log(req)
  const { courtId } = req.params;
  const  startTime  = req.body.startTime; // Assuming timeslots is an array of objects containing start and end times
  const  endTime  = req.body.endTime;
  try {
      // Iterate over the timeslots array and insert each timeslot into the database
          // Perform database insertion for each timeslot
          const query = `
              INSERT INTO court_time_slots (court_id, start_time, end_time)
              VALUES ($1, $2, $3);
          `;
          const values = [courtId, startTime, endTime];
          await pool.query(query, values);
      

      // Send a success response if all timeslots are added successfully
      res.status(201).json({ message: 'Timeslots added successfully' });
  } catch (error) {
      console.error('Error adding timeslots:', error);
      res.status(500).json({ error: 'Failed to add timeslots' });
  }
});



  return router; // Return the router instance
};

module.exports = CourtRoute; // Export the bookingRoute function

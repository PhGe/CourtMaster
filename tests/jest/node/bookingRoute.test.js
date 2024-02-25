/* eslint-disable no-undef */
const request = require('supertest');
const express = require('express');
const bookingRoute = require('../../../src/routes/bookingRoute'); // Import your booking route module
const loginAndGetToken = require('../../../src/utils/loginUtilsTwo');
const { Pool } = require('pg'); // Import Pool from pg for database connection

const app = express();
const mockPool = new Pool(); // Mock pool instance for testing

let authToken; // Declare the authToken variable

beforeAll(async () => {
  try {
    authToken = await loginAndGetToken(); // Obtain the authentication token using your login function
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error('Login failed');
  }
});

// Mock booking data for testing
const mockBookings = [
  {
    booking_id: 69,
    user_id: 33,
    booking_date: '2024-02-10',
    booking_starttime: '10:00:00',
    court_id: 1,
    booking_status: 'pending',
    created_at: '2024-02-08 05:22:42 +0000',
    booking_endtime: '11:00:00'
  },
  {
    booking_id: 420,
    user_id: 341,
    booking_date: '2023-12-24',
    booking_starttime: '12:00:00',
    court_id: 3,
    booking_status: 'confirmed',
    created_at: '2024-02-10 16:35:41 +0000',
    booking_endtime: '13:00:00'
  }
];

// Mock the booking route with a mock pool instance
app.use(express.json());
app.use('/booking', bookingRoute(mockPool));

describe('Booking Routes', () => {

    it('should return all bookings', async () => {
        // Mock the database query function to return a predefined list of bookings
        const mockQueryResult = {
            rows: [
                {
                    booking_id: 1,
                    user_id: 1,
                    booking_date: "2024-02-23",
                    booking_starttime: "18:00:00",
                    court_id: 8,
                    booking_status: "confirmed",
                    created_at: "2024-02-20 20:07:34 +0000",
                    booking_endtime: "19:00:00"
                },
                {
                    booking_id: 2,
                    user_id: 2,
                    booking_date: "2024-02-24",
                    booking_starttime: "19:00:00",
                    court_id: 2,
                    booking_status: "confirmed",
                    created_at: "2024-03-20 20:07:34 +0000",
                    booking_endtime: "20:00:00"
                },
            ],
        };
        mockPool.query = jest.fn().mockResolvedValueOnce(mockQueryResult);

        // Send a GET request to retrieve all bookings
        const response = await request(app)
            .get('/booking/all')
            .set('Authorization', `${authToken}`);

        // Assert the response status code and data
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQueryResult.rows);
    });

    it('should return bookings by user', async () => {
        const userId = 33; // Mock user ID

        // Mock the database query function to return bookings for the specified user
        const mockQueryResult = {
            rows: [
                {
                    booking_id: 1,
                    user_id: 1,
                    booking_date: "2024-02-23",
                    booking_starttime: "18:00:00",
                    court_id: 8,
                    booking_status: "confirmed",
                    created_at: "2024-02-20 20:07:34 +0000",
                    booking_endtime: "19:00:00"
                },
                {
                    booking_id: 2,
                    user_id: 2,
                    booking_date: "2024-02-24",
                    booking_starttime: "19:00:00",
                    court_id: 2,
                    booking_status: "confirmed",
                    created_at: "2024-03-20 20:07:34 +0000",
                    booking_endtime: "20:00:00"
                },
            ],
        };
        mockPool.query = jest.fn().mockResolvedValueOnce(mockQueryResult);

        // Send a GET request to retrieve bookings by user
        const response = await request(app)
            .get('/booking/allByUser')
            .query({ userId })
            .set('Authorization', `${authToken}`);

        // Assert the response status code and data
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockQueryResult.rows);
    });

    it('should confirm a booking', async () => {
      const mockRequest = {
        date: '2024-02-28',
        time: '19:00:00-20:00:00',
        courtId: 8,
        userId: 33
      };
  
      // Mock the database query function
      mockPool.query = jest.fn().mockResolvedValueOnce();
  
      // Send a POST request to confirm a booking
      const response = await request(app)
        .post('/booking/book')
        .set('Authorization', `${authToken}`)
        .send(mockRequest);
  
      // Assert the response status code and message
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Booking confirmed successfully' });
    });
  
    it('should cancel a booking', async () => {
      const bookingId = 123; // Mock booking ID
  
      // Mock the database query function
      mockPool.query = jest.fn().mockResolvedValueOnce();
  
      // Send a DELETE request to cancel a booking
      const response = await request(app)
        .delete(`/booking/cancel/${bookingId}`)
        .set('Authorization', `${authToken}`);
  
      // Assert the response status code and message
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Booking canceled successfully' });
    });
  
    it('should get a list of availability', async () => {
      const mockQueryParams = {
        courtId: 1,
        date: '2024-02-15'
      };
  
      // Mock the database query function
      mockPool.query = jest.fn().mockResolvedValueOnce({ rows: [{ booking_starttime: '10:00:00', booking_endtime: '11:00:00' }] });
  
      // Send a GET request to get availability
      const response = await request(app)
        .get('/booking/availability')
        .query(mockQueryParams)
        .set('Authorization', `${authToken}`);
  
      // Assert the response status code and data
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(['10:00:00-11:00:00']);
    });
  
    // Add more test cases as needed
  });

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 3000)); // Delay to allow server to close properly
});

/* eslint-disable no-undef */
// courtRoute.test.js
const { loginAndGetToken } = require('../../../src/utils/loginUtilsTwo');
const courtRoute = require('../../../src/routes/courtRoute'); 
const request = require('supertest');
const {app} = require('../../../server');
const express = require('express');
const { Pool } = require('pg'); // Import Pool from pg for database connection
const {pool} = require('../../../database');
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

app.use(express.json());
app.use('/courts', courtRoute(mockPool));


describe('GET /courts/all', () => {
  it('should respond with a list of courts', async () => {
    const response = await request(app)
      .get('/courts/all')
      .set('Authorization', `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
  it('should handle errors during fetching courts', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/courts/all')
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('GET /courts/:courtId/availability', () => {
  it('should respond with a list of available time slots for the specified court', async () => {
    // Assuming courtId 1 exists in your database
    const courtId = 1;
    const response = await request(app)
      .get(`/courts/${courtId}/availability`)
      .set('Authorization', `${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should handle errors during fetching available time slots for the specified court', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/courts/${courtId}/availability')
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('GET /courts/all/:courtId', () => {
  it('should respond with the court information and available time slots for the specified court', async () => {
    // Assuming courtId 1 exists in your database
    const courtId = 1;
    const response = await request(app)
      .get(`/courts/all/${courtId}`)
      .set('Authorization', `${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should handle errors when retrieving court data', async () => {
    const courtId = 999; // Invalid court ID
    const response = await request(app)
      .get(`/courts/all/${courtId}`)
      .set('Authorization', `${authToken}`);
    expect(response.status).toBe(404); // Assuming you return 404 for not found
    expect(response.body).toHaveProperty('error');
  });
  it('should handle errors during fetching available time slots for the specified court', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    const courtId = 1;
    const response = await request(app)
      .get(`/courts/all/${courtId}`)
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('GET /courts/:courtId', () => {
  it('should respond with the available time slots for the specified court', async () => {
    // Assuming courtId 1 exists in your database
    const courtId = 1;
    const response = await request(app)
      .get(`/courts/${courtId}`)
      .set('Authorization', `${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more assertions based on the expected response body or status code
  });
  it('should handle errors during fetching courts', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    const courtId = 1;
    const response = await request(app)
      .get(`/courts/${courtId}`)
      .set('Authorization', `${authToken}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Internal Server Error' });
  });
});

describe('DELETE /courts/delete/:court_id', () => {
  it('should delete the court with the provided court_id', async () => {
    // Assuming court_id 12 exists in your database
    const courtIdToDelete = 12;
    const response = await request(app)
    .delete(`/courts/delete/${courtIdToDelete}`)
    .set('Authorization', `${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Court deleted successfully');
  });
  it('should handle errors during deletion with the provided court_id', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    const courtId = 12;
    const response = await request(app)
      .delete(`/courts/delete/${courtId}`) // Ensure the correct route is used
      .set('Authorization', `${authToken}`);
  
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to delete Court' });
  });
});


describe('POST /courts/new', () => {
  it('should create a new court', async () => {
    const newCourt = {
      court_name: 'New Court',
      court_type: 'Tennis',
      location: 'Some location',
      capacity: 4,
      available: true
    };
    const response = await request(app)
      .post('/courts/new')
      .set('Authorization', `${authToken}`)
      .send(newCourt);
    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.court_name).toBe(newCourt.court_name);
  });
  it('should handle errors during creation of new court', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    const response = await request(app)
      .post(`/courts/new`) // Use the correct route
      .set('Authorization', `${authToken}`);
  
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to create new court' });
  });
  it('should delete the court with the provided court_name', async () => {
    const courtNameToDelete = 'New Court'; // Assuming 'New Court' exists in your database
    const response = await request(app)
      .delete(`/courts/deleteByName/${courtNameToDelete}`)
      .set('Authorization', `${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Court deleted successfully');
  });

  it('should handle errors during deletion with the provided court_name', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const courtName = 'Nonexistent Court'; // Nonexistent court name
    const response = await request(app)
      .delete(`/courts/deleteByName/${courtName}`)
      .set('Authorization', `${authToken}`);
  
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete Court' });
  });
});

describe('PUT /courts/edit/:courtId', () => {
  it('should update the court with the provided courtId', async () => {
    const courtIdToUpdate = 1; // Assuming court with ID 1 exists
    const updatedCourtData = {
      court_name: 'Updated Court Name',
      court_type: 'Updated Type',
      location: 'Updated Location',
      capacity: 6,
      available: false
    };
    const response = await request(app)
      .put(`/courts/edit/${courtIdToUpdate}`)
      .set('Authorization', `${authToken}`)
      .send(updatedCourtData);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.court_name).toBe(updatedCourtData.court_name);
  });
  it('should respond with corresponding error if court is not found', async () => {
    const courtIdToUpdate = 1123123; // Assuming court with ID 1 exists
    const updatedCourtData = {
      court_name: 'Updated Court Name',
      court_type: 'Updated Type',
      location: 'Updated Location',
      capacity: 6,
      available: false
    };
    const response = await request(app)
      .put(`/courts/edit/${courtIdToUpdate}`)
      .set('Authorization', `${authToken}`)
      .send(updatedCourtData);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Court not found' });
  });
  it('should handle error gracefully', async () => {
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    const courtIdToUpdate = 1123123; // Assuming court with ID 1 exists
    const updatedCourtData = {
      court_name: 'Updated Court Name',
      court_type: 'Updated Type',
      location: 'Updated Location',
      capacity: 6,
      available: false
    };
    const response = await request(app)
      .put(`/courts/edit/${courtIdToUpdate}`)
      .set('Authorization', `${authToken}`)
      .send(updatedCourtData);
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update court' });
  });

});

describe('POST /courts/delete-timeslots/:courtId', () => {
  it('should delete the unselected time slots for the specified court', async () => {
    // Assuming courtId 1 exists in your database and unselectedTimeslots is an array of time slots
    const courtId = 1;
    const unselectedTimeslots = ['18:00-19:00', '19:00-20:00']; // Define unselected time slots
    const response = await request(app)
      .post(`/courts/delete-timeslots/${courtId}`)
      .set('Authorization', `${authToken}`)
      .send({ unselectedTimeslots });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Unselected time slots deleted successfully');
  });
  it('should handle errors during deletion with the provided court_name', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));

    const courtId = 1124124;
    const unselectedTimeslots = ['18:00-19:00', '19:00-20:00']; // Define unselected time slots
    const response = await request(app)
      .post(`/courts/delete-timeslots/${courtId}`)
      .set('Authorization', `${authToken}`)
      .send({ unselectedTimeslots });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete unselected time slots' });
  });
});

describe('POST /courts/add-timeslots/:courtId', () => {
  it('should add new time slots for the specified court', async () => {
    // Assuming courtId 1 exists in your database and startTime and endTime are provided
    const courtId = 1;
    const startTime = '18:00'; // Define the start time
    const endTime = '19:00'; // Define the end time
    const response = await request(app)
      .post(`/courts/add-timeslots/${courtId}`)
      .set('Authorization', `${authToken}`)
      .send({ startTime, endTime });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Timeslots added successfully');
  });
  it('should handle errors gracefully', async () => {
    // Mock the database.query method to throw an error
    jest.spyOn(pool, 'query').mockRejectedValueOnce(new Error('Database error'));
    // Assuming courtId 1 exists in your database and startTime and endTime are provided
    const courtId = 1;
    const startTime = '18:00'; // Define the start time
    const endTime = '19:00'; // Define the end time
    const response = await request(app)
    .post(`/courts/add-timeslots/${courtId}`)
    .set('Authorization', `${authToken}`)
    .send({ startTime, endTime });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add timeslots' });
  });
});

afterAll(async () => {
  try {
    const court_name= 'New Court';
    const response = await request(app)
      .delete(`/courts/deleteByName/${court_name}`)
      .set('Authorization', `${authToken}`);
    console.log(response.body); // Log the response for debugging purposes
  } catch (error) {
    console.error('Error resetting application state:', error);
    // Handle the error appropriately
  }

  await new Promise(resolve => setTimeout(() => resolve(), 3000)); // Delay to allow server to close properly
});
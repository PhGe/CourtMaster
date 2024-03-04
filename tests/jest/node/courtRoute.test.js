/* eslint-disable no-undef */
// courtRoute.test.js
const { loginAndGetToken } = require('../../../src/utils/loginUtilsTwo');
const courtRoute = require('../../../src/routes/courtRoute'); 
const request = require('supertest');
const app = require('../../../server');
const express = require('express');
const { Pool } = require('pg'); // Import Pool from pg for database connection
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

test('Login and get authentication token', async () => {
  try {
    // Assert that the authentication token obtained in beforeAll is not empty or undefined
    expect(authToken).toBeTruthy();
  } catch (error) {
    // If there's an error while logging in, throw an error to fail the test
    throw new Error('Error logging in: ' + error.message);
  }
});

describe('GET /courts/all', () => {
  it('should respond with a list of courts', async () => {
    const response = await request(app)
      .get('/courts/all')
      .set('Authorization', `${authToken}`); // Include the token in the Authorization header
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
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
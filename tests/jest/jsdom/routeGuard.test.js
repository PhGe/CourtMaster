/* eslint-disable no-undef */
import { createRouter } from 'vue-router';
import router from '../../../src/routes/index'; // Import your router instance
import axios from 'axios';

jest.mock('axios'); // Mock axios

describe('Route Guards', () => {
  let mockRouter;

  beforeEach(() => {
    // Create a mock router instance for testing
    mockRouter = createRouter({
      history: jest.fn(),
      routes: router.options.routes,
    });
  });


  it('redirects unauthenticated users to the login page', async () => {
    // Mock local storage
    global.localStorage = {
      getItem: jest.fn().mockReturnValue(null), // No authToken
    };

    const next = jest.fn();
    const to = { meta: { requiresAuth: true }, path: '/protected-route' };
    const from = {};
    await mockRouter.beforeEach((to, from, next) => {
      // Your beforeEach logic here
      next('/login');
    });

    expect(next).toHaveBeenCalledWith('/login');
  });

  it('allows authenticated users to access protected routes', async () => {
    // Mock local storage
    global.localStorage = {
      getItem: jest.fn().mockReturnValue('mockAuthToken'), // With authToken
    };

    // Mock axios post method
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const next = jest.fn();
    const to = { meta: { requiresAuth: true }, path: '/protected-route' };
    const from = {};
    await mockRouter.beforeEach((to, from, next) => {
      // Your beforeEach logic here
      next();
    });

    expect(next).toHaveBeenCalled();
  });

  it('redirects unauthorized users to the unauthorized page', async () => {
    // Mock local storage
    global.localStorage = {
      getItem: jest.fn().mockReturnValue('mockAuthToken'), // With authToken
    };

    // Mock axios post method
    axios.post.mockResolvedValueOnce({ data: { success: false } });

    const next = jest.fn();
    const to = { meta: { requiresAuth: true }, path: '/protected-route' };
    const from = {};
    await mockRouter.beforeEach((to, from, next) => {
      // Your beforeEach logic here
      next('/login');
    });

    expect(next).toHaveBeenCalledWith('/login');
  });

  // Add more tests for other route guard scenarios as needed
});

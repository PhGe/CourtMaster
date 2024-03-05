/* eslint-disable no-undef */
// authUtils.test.js

const { setTokenAndExpiration, isTokenExpired, checkTokenExpiration, logout ,resetInactivityTimer } = require('../../../src/utils/authUtils');
const authUtils = require('../../../src/utils/authUtils');
Object.defineProperty(global, 'performance', {
  writable: true,
});

jest.useFakeTimers(); // Mock timers
describe('Token Manager Functions', () => {
  

  beforeEach(() => {

    jest.clearAllMocks()
  });

  afterEach(() => {
    jest.clearAllTimers(); // Restore timers after each test
  });

  it('should set token and expiration', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() + 60000; // 1 minute from now
    setTokenAndExpiration(token, expirationTime);
    expect(isTokenExpired()).toBe(false);
  });

  it('should detect token expiration', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() - 60000; // 1 minute ago
    setTokenAndExpiration(token, expirationTime);
    expect(isTokenExpired()).toBe(true);
  });

  it('should check token expiration', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() + 60000; // 1 minute from now
    setTokenAndExpiration(token, expirationTime);
    jest.advanceTimersByTime(30000); // Advance timer by 30 seconds
    checkTokenExpiration(); // Should not logout yet
    expect(isTokenExpired()).toBe(false);
    jest.advanceTimersByTime(30000); // Advance timer by another 30 seconds
    checkTokenExpiration(); // Should logout now
    expect(isTokenExpired()).toBe(true);
  });
  it('should logout', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() + 60000; // 1 minute from now
    setTokenAndExpiration(token, expirationTime);
  
    // Call logout function
    logout();
  
    // Check if the token is expired after logout
    expect(isTokenExpired()).toBe(true);
  });

  it('should logout after inactivity timer expires', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() + 60000; // 1 minute from now
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

    // Call the setTokenAndExpiration function
    authUtils.setTokenAndExpiration(token, expirationTime);

    // Manually trigger the inactivity timer callback
    authUtils.startInactivityTimer();

    // Advance the timer to simulate expiration
    jest.advanceTimersByTime(inactivityTimeout);

    // Ensure that logout function is called after the inactivity timer expires
    expect(authUtils.isTokenExpired()).toBe(true);
});

  it('should start and reset inactivity timer', () => {
    const token = 'dummyToken';
    const expirationTime = Date.now() + 60000; // 1 minute from now
    setTokenAndExpiration(token, expirationTime);
    resetInactivityTimer();
    jest.advanceTimersByTime(30000); // Advance timer by 30 seconds
    expect(isTokenExpired()).toBe(false); // Timer reset, token should not expire
  });

});



let jwtToken = null;
let tokenExpiration = null;
let inactivityTimer = null;

//God that was a lot of work fuck me

// Save token and expiration time when logging in
function setTokenAndExpiration(token, expirationTime) {
  jwtToken = token;
  tokenExpiration = expirationTime;

  console.log('jwtToken', jwtToken, 'tokenExpiration', tokenExpiration);

  // Start a timer to check for inactivity
  startInactivityTimer();
}
  
  // Check if the token is expired
function isTokenExpired() {
  if (!tokenExpiration) {
    return true; // Token expiration time not set
    
  }

  const currentTimestamp = Date.now();
  const expirationTimestamp = tokenExpiration;

  return currentTimestamp >= expirationTimestamp;
}
  
// Check token expiration on every request
function checkTokenExpiration() {
  if (isTokenExpired()) {
    logout();
  } else {
    resetInactivityTimer();
  }
}
  
  // Logout function
  function logout() {
    jwtToken = null;
    console.log(jwtToken)
    tokenExpiration = null;
  
    // Redirect to the logout page or perform other logout actions
    console.log("logged out!");
  }
  
  // Function to start the inactivity timer
  function startInactivityTimer() {
    const inactivityTimeout = 30* 60 * 1000; //30 minute in milliseconds

    // Clear any existing timer
    clearTimeout(inactivityTimer);
  
    // Set a new timer
    inactivityTimer = setTimeout(() => {
      // User has been inactive, clear the token
      logout();
    }, inactivityTimeout);
  }
  
  // Function to reset the inactivity timer
function resetInactivityTimer() {
    startInactivityTimer();
}

module.exports = { setTokenAndExpiration, isTokenExpired, checkTokenExpiration, logout, startInactivityTimer ,resetInactivityTimer}

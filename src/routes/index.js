// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Subpage from '../views/Subpage.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import axios from 'axios';

const routes = [
  { path: '/', component: Home },
  { path: '/subpage', component: Subpage, meta: { requiresAuth: true }, },
  { path: '/signup', component: SignUp },
  { path: '/login', component: Login}
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});


//Navigation Guard
router.beforeEach(async (to, from, next) => {
  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if the user is authenticated (token exists)
    const authToken = localStorage.getItem('authToken');
    console.log('authToken:', authToken);

    // Validate the token on the server
    try {
      const response = await axios.post('courtmasterapp.azurewebsites.net/users/authenticate-token', { token: authToken });
      console.log(response)
      console.log(response.data)
      console.log(response.data.success)
      if (response.data && response.data.success) {
        // Token is valid, continue to the route
        console.log("Token is valid. Continuing to the route.");
        next();
      } else {
        // Token is invalid, redirect to login
        console.log("Token is invalid. Redirecting to login.");
        next('/login');
      }
    } catch (error) {
      // Handle errors, e.g., network issues
      console.error("Error validating token:", error);
      next('/login'); // Redirect to login in case of an error
    }
  } else {
    // Continue to the route
    next();
  }
});


export default router;

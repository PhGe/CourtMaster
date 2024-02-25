// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Userlist from '../views/Userlist.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import CalendarView from '../views/CalendarView.vue';
import Settings from '../views/Settings.vue';
import Bookings from '../views/Bookings.vue';
import Admin from '../views/AdminView.vue';
import Unauthorized from '../views/Unauthorized.vue';
import axios from 'axios';
import store from '@/store';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/userlist', name: 'userlist', component: Userlist, meta: { requiresAuth: true } },
  { path: '/signup', name: 'signup', component: SignUp },
  { path: '/login', name: 'login', component: Login },
  { path: '/calendar', name: 'calendar', component: CalendarView, meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/bookings', name: 'bookings', component: Bookings, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized}
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});


let API_BASE_URL = 'https://court-master-e4c0d72c16c5.herokuapp.com/users/login';

if (process.env.NODE_ENV === 'production' && process.env.API_BASE_URL) {
  API_BASE_URL = process.env.API_BASE_URL;
}

// Route guard to check authentication token
// Authentication guard
router.beforeEach(async (to, from, next) => {
  console.log('Authentication Route Guard - Starting');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log('Route requires authentication');
    const authToken = localStorage.getItem('authToken');
    console.log('Auth token:', authToken);
    if (!authToken) {
      console.log('Token is missing, redirecting to login');
      next('/login');
    } else {
      try {
        const tokenResponse = await axios.post(`${API_BASE_URL}/users/authenticate-token`, { token: authToken });
        console.log('Token validation response:', tokenResponse.data);
        if (tokenResponse.data && tokenResponse.data.success) {
          console.log('Token is valid');
          next();
        } else {
          console.log('Token is invalid or expired, redirecting to login');
          next('/login');
        }
      } catch (error) {
        console.error("Error validating token:", error);
        next('/login');
      }
    }
  } else {
    console.log('Route does not require authentication');
    next();
  }
});

// Admin role guard
router.beforeEach(async (to, from, next) => {
  console.log('Admin Role Route Guard - Starting');
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    console.log('Route requires admin role');
    const authToken = localStorage.getItem('authToken');
    console.log('Auth token:', authToken);
    try {
      const userId = store.getters.getUserId;
      console.log(userId);
      const userDetailsResponse = await axios.get(`${API_BASE_URL}/users/role/${userId}`, {
        headers: {
          'Authorization': authToken,
        }
      });
      console.log('User details response:', userDetailsResponse.data);
      const userRole = userDetailsResponse.data.role;
      console.log('User role:', userRole);
      if (userRole === 'admin') {
        console.log('User is admin, proceeding to route');
        next();
      } else {
        console.log('User is not admin, redirecting to unauthorized page');
        next('/unauthorized');
      }
    } catch (error) {
      console.error("Error retrieving user details:", error);
      next('/login');
    }
  } else {
    console.log('Route does not require admin role');
    next();
  }
});



export default router;

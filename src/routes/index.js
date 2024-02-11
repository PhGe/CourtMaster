// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Userlist from '../views/Userlist.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import CalendarView from '../views/CalendarView.vue';
import axios from 'axios';

const routes = [
  { path: '/', component: Home },
  { path: '/userlist', component: Userlist, meta: { requiresAuth: true }, },
  { path: '/signup', component: SignUp },
  { path: '/login', component: Login },
  { path: '/calendar', component: CalendarView, meta: { requiresAuth: true }, }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  console.log('Navigation Guard - Starting');
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log('Route requires authentication');
    const authToken = localStorage.getItem('authToken');
    console.log('Auth token:', authToken);
    if (!authToken) {
      console.log('Token is missing, redirecting to login');
      next('/login');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/users/authenticate-token', { token: authToken });
      console.log('Token validation response:', response.data);
      if (response.data && response.data.success) {
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
  } else {
    console.log('Route does not require authentication');
    next();
  }
});



export default router;

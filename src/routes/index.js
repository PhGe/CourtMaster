// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Subpage from '../views/Subpage.vue';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/subpage', component: Subpage, meta: { requiresAuth: true }, },
  { path: '/Signup', component: SignUp },
  { path: '/login', component: Login}
];



const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});


//Navigation Guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // Check if the user is authenticated (token exists)
      const authToken = localStorage.getItem('authToken');
  
      if (!authToken) {
        // Redirect to login if not authenticated
        next('/login');
      } else {
        // Continue to the route
        next();
      }
    } else {
      // Continue to the route
      next();
    }
  });
  


export default router;

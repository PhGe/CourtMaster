// router.js
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Subpage from '../views/Subpage.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/subpage', component: Subpage },
  { path: '/login', component: Login}
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;

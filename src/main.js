import { createApp} from 'vue';
import App from './App.vue';
import store from './store'; // Import the Vuex store
import router from './routes'; // Import the Vue Router

const app = createApp(App);

app.use(store);
 
// Use the Vue Router
app.use(router);

// Mount the app to the specified element
app.mount('#app');

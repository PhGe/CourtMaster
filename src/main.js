import { createApp} from 'vue';
import App from './App.vue';
import store from './store'; // Import the Vuex store
import router from './routes'; // Import the Vue Router
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import '../global.css'; 


const app = createApp(App);


app.use(store);
 
app.use(router);

app.use(ElementPlus);

// Mount the app to the specified element
app.mount('#app');

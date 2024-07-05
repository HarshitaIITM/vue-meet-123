import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import your Vuex store module

createApp(App)
  .use(router)
  .use(store) // Use Vuex store
  .mount('#app');

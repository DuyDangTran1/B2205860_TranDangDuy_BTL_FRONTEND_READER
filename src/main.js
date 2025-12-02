import { createApp } from 'vue';
import App from './App.vue';
import Routers from './router/index';
createApp(App).use(Routers).mount('#app')

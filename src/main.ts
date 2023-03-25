import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import directives from './directives';

import '@/assets/scss/main.scss'
const app = createApp(App);
directives(app);
app.use(router).mount('#app')

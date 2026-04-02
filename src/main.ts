import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue/client';
import './style.css';
import App from './App.vue';
import router from './router';

const head = createHead({
  init: [{ titleTemplate: '%s | Assets Tracker', title: 'Assets Tracker' }],
});

createApp(App).use(router).use(VueQueryPlugin).use(head).mount('#app');

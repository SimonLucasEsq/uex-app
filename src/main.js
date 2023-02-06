import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import axios from './plugins/axios'

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(axios, {
  baseUrl: 'http://localhost:3000/api/',
})

app.mount("#app");

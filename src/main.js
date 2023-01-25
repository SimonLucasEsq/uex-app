import { createApp } from "vue";
import { createPinia } from "pinia";
import { createORM } from 'pinia-orm';

import App from "./App.vue";
import router from "./router";
import axios from './plugins/axios'

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia().use(createORM())

app.use(pinia);
app.use(router);
app.use(axios, {
  baseUrl: 'http://localhost:3000/api/',
})

app.mount("#app");

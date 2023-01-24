import { createApp } from "vue";
import { createPinia } from "pinia";
import { createORM } from 'pinia-orm';

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia().use(createORM())

app.use(pinia);
app.use(router);

app.mount("#app");

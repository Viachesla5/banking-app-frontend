import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/HomePage.vue";
import Login from "../components/login/Login.vue";
import Overview from "../components/overview/Overview.vue";
import Register from "../components/login/Register.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/Overview", component: Overview },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

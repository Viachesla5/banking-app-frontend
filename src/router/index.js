import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/HomePage.vue";
import Login from "../components/login/Login.vue";
import Overview from "../components/overview/Overview.vue";
import Register from "../components/login/Register.vue";
import AccountDetails from "../components/account/AccountDetails.vue";
import TransactionHistory from "../components/account/TransactionHistory.vue";
import TransferFunds from "../components/account/TransferFunds.vue";
import AtmOperations from "../components/account/AtmOperations.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/Overview", component: Overview },
  { path: "/account-details", component: AccountDetails },
  { path: "/transactions", component: TransactionHistory },
  { path: "/transfer", component: TransferFunds },
  { path: "/atm-operations", component: AtmOperations },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

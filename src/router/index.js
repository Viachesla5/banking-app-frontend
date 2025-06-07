import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/HomePage.vue";
import Login from "../components/login/Login.vue";
import Overview from "../components/overview/Overview.vue";
import Register from "../components/login/Register.vue";
import AccountDetails from "../components/account/AccountDetails.vue";
import TransactionHistory from "../components/account/TransactionHistory.vue";
import TransferFunds from "../components/account/TransferFunds.vue";
import AtmOperations from "../components/account/AtmOperations.vue";
import NotFound from "../components/ErroPages/NotFound.vue";
import Unauthorized from "../components/ErroPages/Unauthorized.vue";
import LoginATM from "../components/login/LoginATM.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/Overview", component: Overview },
  { path: "/account-details", component: AccountDetails },
  { path: "/transactions", component: TransactionHistory },
  { path: "/transfer", component: TransferFunds },
  { path: "/atm-operations", component: AtmOperations },
  { path: "/NotFound", component: NotFound },
  { path: "/Unauthorized", component: Unauthorized },
  { path: "/loginATM", component: LoginATM },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Define which paths require auth and what role they require
  const protectedRoutes = {
    "/Overview": "ROLE_CUSTOMER",
    "/atm-operations": "ROLE_CUSTOMER",
    "/transactions": "ROLE_CUSTOMER",
    "/account-details": "ROLE_CUSTOMER",
    "/transfer": "ROLE_CUSTOMER",
  };

  const requiredRole = protectedRoutes[to.path];

  // If the route is protected
  if (requiredRole) {
    if (!token) {
      // User is not logged in
      next("/NotFound");
    } else if (role !== requiredRole) {
      // Logged in but wrong role
      next("/Unauthorized");
    } else {
      // Logged in and correct role
      next();
    }
  } else {
    // Public route
    next();
  }
});

export default router;

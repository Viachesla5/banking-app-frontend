<template>
  <div>
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark"
      aria-label="Oitavo exemplo de barra de navegação"
    >
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <h5>Home</h5>
        </router-link>
        <button
          type="button"
          class="btn btn-success"
          @click="$router.push('/loginATM')"
          style="margin: 2px 10px"
        >
          Login ATM
        </button>
        <ul class="navbar-nav ms-auto">
          <li v-if="store.isLoggedIn" class="nav-item">
            <router-link to="/Overview" class="nav-link">
              Overview
            </router-link>
          </li>
          <li v-if="store.isLoggedIn" class="nav-item">
            <router-link to="/account-details" class="nav-link">
              Account Details
            </router-link>
          </li>
          <li v-if="store.isLoggedIn" class="nav-item">
            <router-link to="/transactions" class="nav-link">
              Transaction History
            </router-link>
          </li>
          <li v-if="store.isLoggedIn" class="nav-item">
            <router-link to="/transfer" class="nav-link">
              Transfer Funds
            </router-link>
          </li>
          <li v-if="store.isLoggedIn" class="nav-item">
            <router-link to="/atm-operations" class="nav-link">
              ATM Operations
            </router-link>
          </li>
          <li v-if="store.isLoggedIn" class="nav-item">
            <button
              type="button"
              class="btn btn-danger"
              @click="logout"
              style="margin: 2px 30px"
            >
              Log out
            </button>
          </li>
          <li v-else class="nav-item">
            <button
              type="button"
              class="btn btn-success"
              @click="$router.push('/login')"
              style="margin: 2px 10px"
            >
              Login
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="$router.push('/register')"
              style="margin: 2px 10px"
            >
              Register
            </button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { useUserSessionStore } from "/src/store/userSessionStore";

export default {
  name: "Navbar",
  setup() {
    const store = useUserSessionStore();
    return { store };
  },
  data() {
    return {
      isLoggedIn: this.store.isLoggedIn,
    };
  },
  methods: {
    logout() {
      this.store.logout();
    },
  },
};
</script>

<style scoped></style>

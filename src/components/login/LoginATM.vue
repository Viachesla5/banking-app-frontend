<template>
  <div
    class="atm-login-container d-flex justify-content-center align-items-center"
  >
    <div class="atm-login-box text-center p-4">
      <h2 class="atm-title mb-4">ATM ACCESS</h2>

      <div v-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label atm-label">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="form-control atm-input"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label atm-label">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="form-control atm-input"
            required
          />
        </div>

        <button type="submit" class="btn atm-button w-100 mt-3">ENTER</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserSessionStore } from "/src/store/userSessionStore";

const router = useRouter();
const userSession = useUserSessionStore();

const username = ref("");
const password = ref("");
const errorMessage = ref("");

async function login() {
  try {
    await userSession.login(username.value, password.value, true);
    router.push("/Overview");
  } catch (error) {
    errorMessage.value = "Invalid login credentials. Please try again.";
    console.error("ATM login failed:", error);
  }
}
</script>

<style scoped>
.atm-login-container {
  height: 100vh;
  background-color: #1a1a1a;
  color: #00ffcc;
  font-family: "Courier New", monospace;
}

.atm-login-box {
  background-color: #000;
  border: 3px solid #00ffcc;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px #00ffcc;
}

.atm-title {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
}

.atm-label {
  color: #00ffcc;
  text-align: left;
  display: block;
}

.atm-input {
  background-color: #111;
  border: 1px solid #00ffcc;
  color: #00ffcc;
}

.atm-input:focus {
  background-color: #000;
  color: #fff;
  border-color: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.atm-button {
  background-color: #00ffcc;
  color: #000;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

.atm-button:hover {
  background-color: #00e6b8;
}
</style>

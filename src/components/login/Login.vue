<template>
  <div class="container">
    <div id="loginDiv" class="text-center col-12" style="height: 500px">
      <br /><br />
      <br /><br /><br />
      <h2>Login</h2>
      <div class="mt-5" method="post">
        <input
          type="text"
          name="username"
          v-model="username"
          placeholder="Username"
        /><br /><br />
        <input
          type="password"
          name="password"
          v-model="password"
          placeholder="Password"
        /><br /><br />
        <button
          id="loginButton"
          type="submit"
          name="LoginButton"
          @click="login"
        >
          Login</button
        ><br /><br />
        <p>
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
        <div
          v-if="errorMessage"
          class="alert alert-danger mt-3 d-flex justify-content-center"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "../../assets/main.css";
import axios from "../../Axios-auth";
import { useUserSessionStore } from "/src/store/userSessionStore";

export default {
  setup() {
    return { store: useUserSessionStore() };
  },
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      this.store
        .login(this.username, this.password)
        .then(() => {
          this.$router.push("/overview");
        })
        .catch((error) => {
          console.log(error);

          this.errorMessage =
            "Username or password is incorrect, please try again!";
        });
    },
  },
};
</script>

<style scoped>
.container {
  margin-bottom: 12%;
}
</style>

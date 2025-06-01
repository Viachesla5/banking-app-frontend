import { defineStore } from "pinia";
import Axios from "../Axios-auth";
import VueJwtDecode from "vue-jwt-decode";

export const useUserSessionStore = defineStore("userSessionStore", {
  state: () => ({
    userId: "",
    username: "",
    token: "",
    role: "",
    isATM: false,
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.token !== "";
    },
    getRole: (state) => {
      return state.role;
    },
    getUserId: (state) => {
      return state.userId;
    },
  },
  actions: {
    autologin() {
      if (localStorage.getItem("token")) {
        this.token = localStorage.getItem("token");
        this.role = localStorage.getItem("role");
        this.userId = localStorage.getItem("userId");
        this.isATM = localStorage.getItem("isATM") === "true";
        Axios.defaults.headers.common["Authorization"] = "Bearer " + this.token;
      }
    },
    login(username, password, isATM = false) {
      return new Promise((resolve, reject) => {
        Axios.post("/auth/login", { username: username, password: password })
          .then((response) => {
            const tokenPayload = VueJwtDecode.decode(response.data.token);
            this.role = tokenPayload.role;

            this.userId = tokenPayload.jti;

            this.token = response.data.token;
            this.isATM = isATM;

            localStorage.setItem("token", response.data.token);
            console.log("role" + this.role);
            localStorage.setItem("role", tokenPayload.role);
            localStorage.setItem("userId", tokenPayload.jti);
            localStorage.setItem("isATM", isATM); // Persist across refresh
            Axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout() {
      this.username = "";
      this.token = "";
      this.role = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      Axios.defaults.headers.common["Authorization"] = "";
      localStorage.clear();
    },
  },
});

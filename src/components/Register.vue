<template>
  <div class="container">
    <div id="registerDiv" class="text-center col-12" style="height: 500px">
      <br /><br />
      <br /><br /><br />
      <h2>Register</h2>
      <div class="mt-5">
        <input
          type="text"
          name="firstName"
          v-model="firstName"
          placeholder="First Name"
          class="form-control mb-3"
        />
        <input
          type="text"
          name="lastName"
          v-model="lastName"
          placeholder="Last Name"
          class="form-control mb-3"
        />
        <input
          type="email"
          name="email"
          v-model="email"
          placeholder="Email"
          class="form-control mb-3"
        />
        <input
          type="text"
          name="bsn"
          v-model="bsn"
          placeholder="BSN Number"
          class="form-control mb-3"
        />
        <input
          type="tel"
          name="phone"
          v-model="phone"
          placeholder="Phone Number"
          class="form-control mb-3"
        />
        <input
          type="password"
          name="password"
          v-model="password"
          placeholder="Password"
          class="form-control mb-3"
        />
        <button
          id="registerButton"
          type="submit"
          name="RegisterButton"
          @click="register"
          class="btn btn-primary"
        >
          Register
        </button>
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/main.css";
import axios from "../Axios-auth";
import { useUserSessionStore } from "../store/userSessionStore";

export default {
  name: "Register",
  setup() {
    return { store: useUserSessionStore() };
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      bsn: "",
      phone: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async register() {
      try {
        // Basic validation
        if (!this.firstName || !this.lastName || !this.email || !this.bsn || !this.phone || !this.password) {
          this.errorMessage = "All fields are required";
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          this.errorMessage = "Please enter a valid email address";
          return;
        }

        // BSN validation (assuming 9 digits)
        if (!/^\d{9}$/.test(this.bsn)) {
          this.errorMessage = "BSN must be 9 digits";
          return;
        }

        // Phone validation (basic)
        if (!/^\d{10,15}$/.test(this.phone)) {
          this.errorMessage = "Please enter a valid phone number";
          return;
        }

        const response = await axios.post("/api/auth/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          bsn: this.bsn,
          phone: this.phone,
          password: this.password,
        });

        if (response.data) {
          // Registration successful
          this.$router.push("/login");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || "Registration failed";
        } else {
          this.errorMessage = "An error occurred during registration";
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#registerDiv {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;

  .form-control {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .btn-primary {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  .alert {
    padding: 10px;
    margin-top: 10px;
    border-radius: 4px;
  }
}
</style> 
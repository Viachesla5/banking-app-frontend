<template>
  <div class="container">
    <div id="registerDiv" class="text-center col-12" style="height: 800px">
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
          type="text"
          name="username"
          v-model="username"
          placeholder="Username"
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
          name="phoneNumber"
          v-model="phoneNumber"
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
        <input
          type="password"
          name="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          class="form-control mb-3"
        />
        <button
          id="registerButton"
          type="submit"
          name="RegisterButton"
          @click="register"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
        <p class="mt-3">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
        <div
          v-if="errorMessage"
          class="alert alert-danger mt-3 d-flex justify-content-center"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
    <!-- Toast Notification -->
    <div v-if="showToast" class="toast-notification" :class="{ 'show': showToast }">
      {{ toastMessage }}
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
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      bsn: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      isLoading: false,
      showToast: false,
      toastMessage: ""
    };
  },
  methods: {
    showToastMessage(message, duration = 3000) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, duration);
    },
    async register() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      if (this.password.length < 8) {
        this.errorMessage = "Password must be at least 8 characters long!";
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("/auth/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
          bsn: this.bsn,
          phoneNumber: this.phoneNumber,
          password: this.password,
        });

        if (response.status === 201 || response.status === 200) {
          this.showToastMessage("Registration successful! You can now login.");
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          this.errorMessage = "This email is already registered. Please use a different email address.";
        } else if (error.response?.status === 400) {
          console.log('Registration validation error:', error.response.data);
          if (error.response.data && typeof error.response.data === 'object') {
            const validationErrors = error.response.data;
            if (validationErrors.errors) {
              this.errorMessage = Object.values(validationErrors.errors).join(', ');
            } else {
              this.errorMessage = validationErrors.message || "Please check your input data and try again.";
            }
          } else {
            this.errorMessage = error.response.data || "Please check your input data and try again.";
          }
        } else if (error.code === "ERR_NETWORK") {
          this.errorMessage = "Cannot connect to the server. Please check if the backend is running and try again.";
        } else {
          this.errorMessage = "Registration failed. Please try again later.";
        }
        console.error("Registration error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          error: error
        });
      } finally {
        this.isLoading = false;
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
}

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
}

.btn-primary:hover {
  background-color: #0056b3;
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 16px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease-in-out;
}

.toast-notification.show {
  opacity: 1;
  transform: translateY(0);
}
</style>

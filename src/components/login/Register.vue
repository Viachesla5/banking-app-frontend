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
        >
          Register
        </button>
        <p class="mt-3">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
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
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      bsn: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      try {
        const response = await axios.post("/api/auth/register", {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          bsn: this.bsn,
          phoneNumber: this.phoneNumber,
          password: this.password,
        });

        if (response.status === 201) {
          alert("Registration successful! Please wait for employee approval.");
          this.$router.push("/login");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          alert("Email already exists!");
        } else {
          alert("Registration failed. Please try again.");
        }
        console.error(error);
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
</style>
../../store/userSessionStore

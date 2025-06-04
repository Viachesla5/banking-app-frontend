<template>
  <div class="container">
    <div id="registerDiv" class="text-center col-12">
      <h2>Create Account</h2>
      
      <!-- Progress Indicator -->
      <div class="progress-container mb-4">
        <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <span class="step-number">1</span>
          <span class="step-label">Personal Info</span>
        </div>
        <div class="progress-line" :class="{ completed: currentStep > 1 }"></div>
        <div class="progress-step" :class="{ active: currentStep >= 2 }">
          <span class="step-number">2</span>
          <span class="step-label">Security</span>
        </div>
      </div>

      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1" class="step-content">
        <h3 class="step-title">Personal Information</h3>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="firstName" class="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                v-model="firstName"
                placeholder="e.g., John"
                class="form-control"
                required
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="lastName" class="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                v-model="lastName"
                placeholder="e.g., Doe"
                class="form-control"
                required
              />
            </div>
          </div>
        </div>
        
        <div class="form-group mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            v-model="username"
            placeholder="e.g., john_doe123"
            class="form-control"
            required
          />
        </div>
        
        <div class="form-group mb-4">
          <label for="email" class="form-label">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            v-model="email"
            placeholder="e.g., john.doe@example.com"
            class="form-control"
            required
          />
        </div>

        <button type="button" @click="nextStep" class="btn btn-primary btn-lg w-100">
          Continue to Security <i class="fas fa-arrow-right ms-2"></i>
        </button>
      </div>

      <!-- Step 2: Security & Contact -->
      <div v-if="currentStep === 2" class="step-content">
        <h3 class="step-title">Security & Contact</h3>
        
        <div class="row">
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="bsn" class="form-label">BSN Number</label>
              <input
                type="text"
                id="bsn"
                name="bsn"
                v-model="bsn"
                placeholder="e.g., 123456789"
                class="form-control"
                maxlength="9"
                required
              />
              <small class="form-text text-muted">8-9 digits</small>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group mb-3">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                v-model="phoneNumber"
                placeholder="e.g., +31612345678"
                class="form-control"
                required
              />
              <small class="form-text text-muted">Dutch format</small>
            </div>
          </div>
        </div>
        
        <div class="form-group mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            v-model="password"
            placeholder="e.g., MySecurePass123!"
            class="form-control"
            required
          />
          <small class="form-text text-muted">Minimum 8 characters</small>
        </div>
        
        <div class="form-group mb-4">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            v-model="confirmPassword"
            placeholder="Re-enter your password"
            class="form-control"
            required
          />
        </div>

        <div class="button-group">
          <button type="button" @click="prevStep" class="btn btn-outline-secondary me-3">
            <i class="fas fa-arrow-left me-2"></i> Back
          </button>
          <button 
            type="button" 
            @click="register" 
            class="btn btn-primary btn-lg"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </div>
      
      <div class="text-center mt-4">
        <p class="mb-0">
          Already have an account?
          <router-link to="/login" class="text-decoration-none fw-bold">Sign in here</router-link>
        </p>
      </div>
      
      <div
        v-if="errorMessage"
        class="alert alert-danger mt-3 d-flex align-items-center"
      >
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ errorMessage }}
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
      currentStep: 1,
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
    nextStep() {
      // Validate step 1 fields
      if (!this.firstName || !this.lastName || !this.username || !this.email) {
        this.errorMessage = "Please fill in all fields before continuing.";
        return;
      }
      
      if (!this.email.includes('@')) {
        this.errorMessage = "Please enter a valid email address.";
        return;
      }
      
      this.errorMessage = "";
      this.currentStep = 2;
    },
    prevStep() {
      this.currentStep = 1;
      this.errorMessage = "";
    },
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
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

#registerDiv {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  min-height: auto;
  height: auto;
}

h2 {
  color: #2c3e50;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.step-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.5;
  transition: all 0.3s ease;
  
  &.active {
    opacity: 1;
  }
  
  &.completed {
    opacity: 1;
    
    .step-number {
      background: #28a745;
      border-color: #28a745;
    }
  }
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.active .step-number {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.step-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.progress-line {
  width: 80px;
  height: 2px;
  background: #e9ecef;
  margin: 0 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &.completed {
    background: #28a745;
  }
}

.step-content {
  min-height: 300px;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-align: left;
  display: block;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #6c757d;
    font-style: italic;
  }
}

.form-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: #6c757d;
  text-align: left;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
  background: transparent;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6c757d;
    color: white;
    transform: translateY(-1px);
  }
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.alert-danger {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 12px;
  color: #721c24;
  
  i {
    color: #dc3545;
  }
}

.text-center p {
  color: #6c757d;
  margin-top: 1rem;
  
  a {
    color: #667eea;
    transition: color 0.3s ease;
    
    &:hover {
      color: #764ba2;
    }
  }
}

.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease-in-out;
}

.toast-notification.show {
  opacity: 1;
  transform: translateY(0);
}

// Floating animation for the container
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

#registerDiv {
  animation: float 8s ease-in-out infinite;
}

// Responsive design
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  #registerDiv {
    padding: 1.5rem;
    margin: 1rem;
    max-width: 95%;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .progress-line {
    width: 60px;
  }
  
  .button-group {
    flex-direction: column;
    
    .btn {
      width: 100%;
    }
  }
}

@media (max-width: 480px) {
  #registerDiv {
    padding: 1.2rem;
  }
  
  .form-control {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
  
  .step-content {
    min-height: 250px;
  }
}
</style>

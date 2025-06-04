<template>
  <div>
    <nav
      class="navbar navbar-expand-lg modern-navbar"
      aria-label="Oitavo exemplo de barra de navegação"
    >
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <h5><i class="fas fa-university me-2"></i>InhollandBank</h5>
        </router-link>
        
        <!-- ATM Login button for non-logged in users -->
        <li v-if="!isLoggedIn" class="nav-item">
          <button
            type="button"
            class="btn btn-success"
            @click="$router.push('/loginATM')"
            style="margin: 2px 10px"
          >
            Login ATM
          </button>
        </li>
        
        <ul class="navbar-nav ms-auto">
          <!-- Regular Login Navigation -->
          <template v-if="isLoggedIn && !isATM">
            <li class="nav-item">
              <router-link to="/Overview" class="nav-link">
                Overview
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/transactions" class="nav-link">
                Transaction History
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/transfer" class="nav-link">
                Transfer Funds
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/account-details" class="nav-link">
                Account Details
              </router-link>
            </li>
          </template>
          
          <!-- ATM Login Navigation -->
          <template v-else-if="isLoggedIn && isATM">
            <li class="nav-item">
              <router-link to="/atm-operations" class="nav-link">
                ATM Operations
              </router-link>
            </li>
          </template>
          
          <!-- Single Logout button for all logged in users (both ATM and regular) -->
          <li v-if="isLoggedIn" class="nav-item">
            <button
              type="button"
              class="btn btn-danger"
              @click="logout"
              style="margin: 2px 30px"
            >
              {{ isATM ? 'Log out - ATM' : 'Log out' }}
            </button>
          </li>
          
          <!-- Login/Register buttons for non-logged in users -->
          <li v-if="!isLoggedIn" class="nav-item d-flex gap-2 align-items-center">
            <button
              type="button"
              class="btn btn-outline-light btn-sm"
              @click="$router.push('/login')"
            >
              <i class="fas fa-sign-in-alt me-1"></i>
              Login
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="$router.push('/register')"
            >
              <i class="fas fa-user-plus me-1"></i>
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
import { storeToRefs } from 'pinia';

export default {
  name: "Navbar",
  setup() {
    const store = useUserSessionStore();
    
    // Use storeToRefs to make store state reactive
    const { isLoggedIn, isATM, userId, role } = storeToRefs(store);
    
    return { 
      store,
      isLoggedIn,
      isATM,
      userId,
      role
    };
  },
  methods: {
    logout() {
      // Clear the store and redirect
      this.store.logout();
      
      // Use nextTick to ensure the state is fully cleared before navigation
      this.$nextTick(() => {
        this.$router.push('/login');
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.modern-navbar {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .navbar-brand {
    color: #ffffff !important;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    
    h5 {
      margin: 0;
      font-size: 1.4rem;
      font-weight: 700;
      
      i {
        color: #3498db;
      }
    }
    
    &:hover {
      color: #3498db !important;
      transform: translateY(-1px);
    }
  }
  
  .nav-link {
    color: #ecf0f1 !important;
    font-weight: 500;
    transition: all 0.3s ease;
    border-radius: 8px;
    margin: 0 0.25rem;
    padding: 0.5rem 1rem !important;
    
    &:hover {
      color: #3498db !important;
      background: rgba(52, 152, 219, 0.1);
      transform: translateY(-1px);
    }
    
    &.router-link-active {
      color: #3498db !important;
      background: rgba(52, 152, 219, 0.2);
      font-weight: 600;
    }
  }
  
  .btn {
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    &.btn-sm {
      font-size: 0.85rem;
      padding: 0.4rem 0.8rem;
    }
    
    &.btn-success {
      background: linear-gradient(45deg, #27ae60, #2ecc71);
      border: none;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
      }
    }
    
    &.btn-primary {
      background: linear-gradient(45deg, #3498db, #2980b9);
      border: none;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
      }
    }
    
    &.btn-outline-light {
      border: 2px solid rgba(255, 255, 255, 0.6);
      color: #ffffff;
      background: transparent;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.8);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
      }
    }
    
    &.btn-danger {
      background: linear-gradient(45deg, #e74c3c, #c0392b);
      border: none;
      
      &:hover {
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
      }
    }
  }
}

.d-flex {
  display: flex !important;
}

.gap-2 {
  gap: 0.5rem !important;
}

.align-items-center {
  align-items: center !important;
}

// Remove default Bootstrap navbar styles
.navbar-dark .navbar-nav .nav-link {
  color: inherit !important;
}

.navbar-dark .navbar-brand {
  color: inherit !important;
}

// Responsive design
@media (max-width: 768px) {
  .modern-navbar {
    .navbar-brand h5 {
      font-size: 1.2rem;
    }
    
    .btn {
      font-size: 0.8rem;
      padding: 0.375rem 0.75rem;
      margin: 1px 5px !important;
    }
    
    .nav-link {
      text-align: center;
      margin: 0.25rem 0;
    }
  }
}
</style>

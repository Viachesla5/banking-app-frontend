<template>
  <footer class="modern-footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-brand">
          <h3 class="brand-name">
            <i class="fas fa-university me-2"></i>
            InhollandBank
          </h3>
          <p class="brand-tagline">Your trusted banking partner</p>
        </div>
      </div>
      
      <!-- Quick Links - Different based on auth status -->
      <div class="footer-section">
        <h4 class="footer-title">Quick Links</h4>
        <ul class="footer-links">
          <!-- Links for non-authenticated users -->
          <template v-if="!store.isLoggedIn">
            <li><router-link to="/login" class="footer-link">Login</router-link></li>
            <li><router-link to="/register" class="footer-link">Register</router-link></li>
          </template>
          
          <!-- Links for authenticated users -->
          <template v-else>
            <li><router-link to="/Overview" class="footer-link">Dashboard</router-link></li>
            <li><a href="#" @click="logout" class="footer-link">Logout</a></li>
          </template>
          
          <!-- Always visible links -->
          <li><a href="#" class="footer-link">About Us</a></li>
          <li><a href="#" class="footer-link">Contact</a></li>
          <li><a href="#" class="footer-link">Help & FAQ</a></li>
        </ul>
      </div>
      
      <!-- Services Section - Only for authenticated users -->
      <div class="footer-section" v-if="store.isLoggedIn">
        <h4 class="footer-title">Banking Services</h4>
        <ul class="footer-links">
          <li><router-link to="/Overview" class="footer-link">Account Overview</router-link></li>
          <li><router-link to="/ATM" class="footer-link">ATM Services</router-link></li>
          <li><router-link to="/TransferFunds" class="footer-link">Transfer Funds</router-link></li>
          <li><router-link to="/TransactionHistory" class="footer-link">Transaction History</router-link></li>
        </ul>
      </div>
      
      <!-- Information Section - For non-authenticated users -->
      <div class="footer-section" v-else>
        <h4 class="footer-title">Why Choose Us</h4>
        <ul class="footer-links">
          <li><span class="footer-text">24/7 Online Banking</span></li>
          <li><span class="footer-text">Secure Transactions</span></li>
          <li><span class="footer-text">Mobile Banking</span></li>
          <li><span class="footer-text">Customer Support</span></li>
        </ul>
      </div>
      
      <!-- Security Section - Always visible but different content -->
      <div class="footer-section">
        <h4 class="footer-title">Security & Legal</h4>
        <div class="security-content">
          <div class="security-badges">
            <div class="security-badge">
              <i class="fas fa-shield-alt"></i>
              <span>256-bit SSL Encryption</span>
            </div>
            <div class="security-badge">
              <i class="fas fa-lock"></i>
              <span>Bank Grade Security</span>
            </div>
          </div>
          <ul class="footer-links mt-3">
            <li><span class="footer-text">Privacy Policy</span></li>
            <li><span class="footer-text">Terms of Service</span></li>
            <li><span class="footer-text">Security Center</span></li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">
          &copy; 2025 InhollandBank. All rights reserved. | Licensed by DNB
        </p>
        <div class="footer-info">
          <span class="user-status" v-if="store.isLoggedIn">
            <i class="fas fa-user-check me-1"></i>
            Logged in securely
          </span>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import "../assets/main.css";
import { useUserSessionStore } from "../store/userSessionStore";

export default {
  name: "Footer",
  setup() {
    return { 
      store: useUserSessionStore() 
    };
  },
  methods: {
    logout() {
      this.store.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.modern-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  .brand-name {
    color: #3498db;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    
    i {
      color: #e74c3c;
    }
  }
  
  .brand-tagline {
    color: #bdc3c7;
    font-size: 0.95rem;
    margin: 0;
    font-style: italic;
  }
}

.footer-title {
  color: #3498db;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.5rem;
  }
}

.footer-link {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
  cursor: pointer;
  
  &:hover {
    color: #3498db;
    transform: translateX(5px);
    text-decoration: none;
  }
}

.footer-text {
  color: #95a5a6;
  font-size: 0.9rem;
  display: inline-block;
  
  &::before {
    content: "✓ ";
    color: #27ae60;
    font-weight: bold;
    margin-right: 0.5rem;
  }
}

.security-content {
  display: flex;
  flex-direction: column;
}

.security-badges {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.security-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(52, 152, 219, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(52, 152, 219, 0.2);
  
  i {
    color: #27ae60;
    font-size: 1rem;
  }
  
  span {
    color: #ecf0f1;
    font-size: 0.85rem;
    font-weight: 500;
  }
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-status {
  color: #27ae60;
  font-size: 0.85rem;
  font-weight: 500;
  
  i {
    color: #27ae60;
  }
}

.footer-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3498db;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3498db;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
  
  i {
    font-size: 1rem;
  }
}

// Responsive design
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 2rem 1rem 1.5rem;
    gap: 1.5rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .footer-brand .brand-name {
    font-size: 1.5rem;
  }
  
  .security-badges {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 1.5rem 1rem;
  }
  
  .security-badges {
    flex-direction: column;
  }
  
  .footer-social {
    justify-content: center;
  }
}
</style>

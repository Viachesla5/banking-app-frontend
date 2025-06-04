<template>
  <div class="account-details-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <div class="spinner">
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading your account details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <i class="fas fa-exclamation-triangle error-icon"></i>
        <h3>Oops! Something went wrong</h3>
        <p>{{ error }}</p>
        <button @click="fetchCustomerDetails" class="retry-btn">
          <i class="fas fa-redo me-2"></i>
          Try Again
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="content-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="welcome-card">
          <div class="welcome-content">
            <h1 class="welcome-title">
              <i class="fas fa-user-circle me-3"></i>
              Welcome back, {{ customerInfo?.firstName }}!
            </h1>
            <p class="welcome-subtitle">Manage your accounts and view your financial overview</p>
          </div>
          <div class="total-balance">
            <span class="balance-label">Total Balance</span>
            <span class="balance-amount">€{{ totalBalance.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Customer Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h2><i class="fas fa-id-card me-2"></i>Personal Information</h2>
          </div>
          <div class="card-content">
            <div v-if="customerInfo" class="info-grid">
              <div class="info-item">
                <i class="fas fa-user info-icon"></i>
                <div class="info-text">
                  <span class="info-label">Full Name</span>
                  <span class="info-value">{{ customerInfo.firstName }} {{ customerInfo.lastName }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <i class="fas fa-at info-icon"></i>
                <div class="info-text">
                  <span class="info-label">Username</span>
                  <span class="info-value">{{ customerInfo.username }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <i class="fas fa-envelope info-icon"></i>
                <div class="info-text">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ customerInfo.email }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <i class="fas fa-phone info-icon"></i>
                <div class="info-text">
                  <span class="info-label">Phone</span>
                  <span class="info-value">{{ customerInfo.phoneNumber }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <i class="fas fa-id-badge info-icon"></i>
                <div class="info-text">
                  <span class="info-label">BSN</span>
                  <span class="info-value">{{ customerInfo.bsn }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accounts Summary Card -->
        <div class="accounts-card">
          <div class="card-header">
            <h2><i class="fas fa-university me-2"></i>Your Accounts</h2>
          </div>
          <div class="card-content">
            <div v-if="accounts.length > 0" class="accounts-list">
              <div v-for="account in accounts" :key="account.iban" class="account-item">
                <div class="account-icon-wrapper">
                  <i class="account-icon" :class="getAccountIcon(account.accountType)"></i>
                </div>
                <div class="account-details">
                  <div class="account-header">
                    <h3 class="account-type">{{ account.accountType }}</h3>
                    <span class="account-balance">€{{ account.balance.toFixed(2) }}</span>
                  </div>
                  <div class="account-info">
                    <span class="account-iban">{{ formatIban(account.iban) }}</span>
                    <div class="limits-info">
                      <span class="limit-item">
                        <i class="fas fa-calendar-day"></i>
                        Daily: €{{ account.dailyLimit }}
                      </span>
                      <span class="limit-item">
                        <i class="fas fa-arrow-down"></i>
                        Min: €{{ account.absolutelyLimit.toFixed(2) }}
                      </span>
                      <span class="limit-item">
                        <i class="fas fa-arrow-up"></i>
                        Max Deposit: €{{ account.absoluteDepositLimit.toFixed(2) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="no-accounts">
              <i class="fas fa-info-circle"></i>
              <p>No accounts found</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Section -->
      <div class="quick-actions">
        <h2 class="actions-title">Quick Actions</h2>
        <div class="actions-grid">
          <router-link to="/transactions" class="action-card">
            <i class="fas fa-history"></i>
            <span>Transaction History</span>
          </router-link>
          <router-link to="/transfer" class="action-card">
            <i class="fas fa-exchange-alt"></i>
            <span>Transfer Funds</span>
          </router-link>
          <router-link to="/Overview" class="action-card">
            <i class="fas fa-chart-bar"></i>
            <span>Overview</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../Axios-auth";
import { useUserSessionStore } from "/src/store/userSessionStore";

export default {
  name: "AccountDetails",
  setup() {
    return { 
      store: useUserSessionStore()
    };
  },
  data() {
    return {
      customerInfo: null,
      accounts: [],
      totalBalance: 0,
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchCustomerDetails();
  },
  methods: {
    async fetchCustomerDetails() {
      try {
        this.loading = true;
        this.error = null;
        
        // Fetch customer details with accounts and total balance
        const response = await axios.get("/customer-accounts/get-customer");
        const customerData = response.data;
        
        this.customerInfo = {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          username: customerData.username,
          phoneNumber: customerData.phoneNumber,
          bsn: customerData.bsn,
        };
        
        this.accounts = customerData.accounts.map(account => ({
          iban: account.iban,
          balance: parseFloat(account.balance),
          accountType: this.formatAccountType(account.bankAccountType),
          dailyLimit: account.dailyLimit,
          absolutelyLimit: parseFloat(account.absolutelyLimit),
          absoluteDepositLimit: parseFloat(account.absoluteDepositLimit),
        }));
        
        this.totalBalance = parseFloat(customerData.totalBalance);
        
      } catch (error) {
        console.error("Error fetching customer details:", error);
        this.error = "Failed to load account information. Please try again.";
        
        if (error.response?.status === 401) {
          this.error = "You are not authorized. Please log in again.";
          this.$router.push("/login");
        } else if (error.response?.status === 404) {
          this.error = "Customer information not found.";
        }
      } finally {
        this.loading = false;
      }
    },
    formatAccountType(type) {
      // Convert backend enum to readable format
      switch(type) {
        case 'CHECKING_ACCOUNT':
          return 'Checking Account';
        case 'SAVING_ACCOUNT':
          return 'Savings Account';
        default:
          return type;
      }
    },
    getAccountIcon(accountType) {
      return accountType.includes('Checking') ? 'fas fa-credit-card' : 'fas fa-piggy-bank';
    },
    formatIban(iban) {
      // Format IBAN with spaces for better readability
      return iban.replace(/(.{4})/g, '$1 ').trim();
    }
  },
};
</script>

<style lang="scss" scoped>
.account-details-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

// Loading State
.loading-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  color: white;
}

.spinner {
  margin: 0 auto 1rem;
  width: 60px;
  height: 60px;
  position: relative;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
}

// Error State
.error-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.error-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.retry-btn {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
  }
}

// Content Container
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

// Header Section
.header-section {
  margin-bottom: 2rem;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.welcome-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  i {
    color: #ffd700;
  }
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.total-balance {
  text-align: right;
  
  .balance-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }
  
  .balance-amount {
    font-size: 2.5rem;
    font-weight: 700;
    color: #ffd700;
  }
}

// Main Grid
.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

// Card Styles
.info-card, .accounts-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1.5rem 2rem;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

.card-content {
  padding: 2rem;
}

// Info Grid
.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.info-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.info-text {
  display: flex;
  flex-direction: column;
  
  .info-label {
    font-size: 0.85rem;
    color: #7f8c8d;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .info-value {
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 600;
  }
}

// Accounts List
.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.account-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.account-icon-wrapper {
  .account-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #27ae60, #2ecc71);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }
}

.account-details {
  flex: 1;
}

.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.account-type {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.account-balance {
  font-size: 1.5rem;
  font-weight: 700;
  color: #27ae60;
}

.account-iban {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #7f8c8d;
  display: block;
  margin-bottom: 0.75rem;
}

.limits-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.limit-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #95a5a6;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  
  i {
    color: #3498db;
  }
}

// Quick Actions
.quick-actions {
  margin-bottom: 2rem;
}

.actions-title {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
    color: white;
    text-decoration: none;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  i {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #ffd700;
  }
  
  span {
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.no-accounts {
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  
  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #bdc3c7;
  }
}

// Responsive Design
@media (max-width: 968px) {
  .main-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .welcome-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .total-balance {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 1rem;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .balance-amount {
    font-size: 2rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .limits-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>

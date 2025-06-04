<template>
  <div class="transfer-funds-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-exchange-alt me-3"></i>
          Transfer Funds
        </h1>
        <p class="page-subtitle">Send money securely between accounts</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-section">
      <div class="transfer-card">
        <div class="card-header">
          <h2>
            <i class="fas fa-paper-plane me-2"></i>
            Make a Transfer
          </h2>
          <p>Fill in the details below to transfer funds</p>
        </div>

        <div class="card-content">
          <form @submit.prevent="handleTransfer" class="transfer-form">
            <!-- From Account Selection -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-university me-2"></i>
                From Account
              </label>
              <div class="select-wrapper">
                <select
                  v-model="fromAccount"
                  class="form-select"
                  required
                >
                  <option value="">Select your account</option>
                  <option
                    v-for="account in userAccounts"
                    :key="account.iban"
                    :value="account.iban"
                  >
                    {{ account.accountType }} - {{ formatIban(account.iban) }} (€{{ account.balance.toFixed(2) }})
                  </option>
                </select>
                <i class="fas fa-chevron-down select-icon"></i>
              </div>
              
              <!-- Selected Account Info -->
              <div v-if="selectedFromAccount" class="account-info">
                <div class="account-display">
                  <div class="account-icon">
                    <i :class="getAccountIcon(selectedFromAccount.accountType)"></i>
                  </div>
                  <div class="account-details">
                    <span class="account-type">{{ selectedFromAccount.accountType }}</span>
                    <span class="account-iban">{{ formatIban(selectedFromAccount.iban) }}</span>
                    <span class="account-balance">Available: €{{ selectedFromAccount.balance.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- To Account Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-user me-2"></i>
                To Account (IBAN)
              </label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="toAccount"
                  class="form-input"
                  placeholder="NL91 ABNA 0417 1643 00"
                  required
                />
                <i class="fas fa-credit-card input-icon"></i>
              </div>
              <div class="input-hint">
                Enter the recipient's IBAN number
              </div>
            </div>

            <!-- Amount Input -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-euro-sign me-2"></i>
                Amount
              </label>
              <div class="amount-wrapper">
                <div class="currency-symbol">€</div>
                <input
                  type="number"
                  v-model="amount"
                  class="amount-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
              <div class="input-hint">
                Minimum transfer amount: €0.01
              </div>
            </div>

            <!-- Quick Amount Buttons -->
            <div class="quick-amounts">
              <span class="quick-label">Quick amounts:</span>
              <div class="amount-buttons">
                <button
                  type="button"
                  v-for="quickAmount in quickAmounts"
                  :key="quickAmount"
                  @click="setQuickAmount(quickAmount)"
                  class="quick-amount-btn"
                >
                  €{{ quickAmount }}
                </button>
              </div>
            </div>

            <!-- Error Messages -->
            <div v-if="error" class="alert alert-error">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- Success Message -->
            <div v-if="success" class="alert alert-success">
              <i class="fas fa-check-circle me-2"></i>
              {{ success }}
            </div>

            <!-- Transfer Summary -->
            <div v-if="fromAccount && toAccount && amount" class="transfer-summary">
              <h4>Transfer Summary</h4>
              <div class="summary-item">
                <span class="summary-label">From:</span>
                <span class="summary-value">{{ formatIban(fromAccount) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">To:</span>
                <span class="summary-value">{{ formatIban(toAccount) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Amount:</span>
                <span class="summary-value amount">€{{ parseFloat(amount || 0).toFixed(2) }}</span>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="submit-btn"
              :disabled="loading || !isFormValid"
              :class="{ loading: loading }"
            >
              <span v-if="loading" class="loading-content">
                <i class="fas fa-spinner fa-spin me-2"></i>
                Processing Transfer...
              </span>
              <span v-else class="submit-content">
                <i class="fas fa-paper-plane me-2"></i>
                Send Transfer
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="security-notice">
        <div class="notice-content">
          <i class="fas fa-shield-alt security-icon"></i>
          <div class="notice-text">
            <h4>Secure Transfer</h4>
            <p>All transfers are encrypted and processed securely. Please verify the recipient details before confirming.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../Axios-auth";
import { useUserSessionStore } from "/src/store/userSessionStore";

export default {
  name: "TransferFunds",
  setup() {
    return {
      store: useUserSessionStore(),
    };
  },
  data() {
    return {
      fromAccount: "",
      toAccount: "",
      amount: null,
      userAccounts: [],
      loading: false,
      error: null,
      success: null,
      quickAmounts: [10, 25, 50, 100, 250, 500],
    };
  },
  computed: {
    selectedFromAccount() {
      return this.userAccounts.find(account => account.iban === this.fromAccount);
    },
    isFormValid() {
      return this.fromAccount && this.toAccount && this.amount && this.amount > 0;
    },
  },
  async created() {
    await this.fetchUserAccounts();
  },
  methods: {
    async fetchUserAccounts() {
      try {
        const response = await axios.get("/accounts");
        this.userAccounts = response.data.map(account => ({
          iban: account.iban,
          balance: parseFloat(account.balance),
          accountType: this.formatAccountType(account.bankAccountType),
        }));
      } catch (error) {
        console.error("Error fetching accounts:", error);
        this.error = "Failed to load your accounts";
      }
    },
    formatAccountType(type) {
      switch(type) {
        case 'CHECKING_ACCOUNT':
          return 'Checking Account';
        case 'SAVING_ACCOUNT':
          return 'Savings Account';
        default:
          return type;
      }
    },
    formatIban(iban) {
      if (!iban) return '';
      return iban.replace(/(.{4})/g, '$1 ').trim();
    },
    getAccountIcon(accountType) {
      return accountType.includes('Checking') ? 'fas fa-credit-card' : 'fas fa-piggy-bank';
    },
    setQuickAmount(amount) {
      this.amount = amount;
    },
    async handleTransfer() {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const request = {
          fromIban: this.fromAccount,
          toIban: this.toAccount,
          amount: parseFloat(this.amount),
        };

        const response = await axios.post(
          "/transactions",
          request
        );
        this.success = response.data;

        // Reset form
        this.fromAccount = "";
        this.toAccount = "";
        this.amount = null;

        // Refresh account balances
        await this.fetchUserAccounts();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.success = null;
        }, 5000);

      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.error = "Account not found. Please check the IBAN number.";
              break;
            case 400:
              this.error = error.response.data || "Invalid transfer details.";
              break;
            case 403:
              this.error = "Insufficient funds or transfer limit exceeded.";
              break;
            default:
              this.error = "An error occurred while processing your transfer.";
          }
        } else {
          this.error = "Network error. Please check your connection and try again.";
        }
        console.error("Transfer error:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-funds-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

// Header Section
.header-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  i {
    color: #ffd700;
  }
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

// Content Section
.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.transfer-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.card-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 2rem;
  text-align: center;
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
  }
}

.card-content {
  padding: 2rem;
}

// Form Styling
.transfer-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  
  i {
    color: #3498db;
  }
}

// Select Styling
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
}

.select-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
  pointer-events: none;
}

// Input Styling
.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
  
  &::placeholder {
    color: #bdc3c7;
  }
}

.input-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

// Amount Input Styling
.amount-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #27ae60;
  z-index: 1;
}

.amount-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: white;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #27ae60;
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
  }
  
  &::placeholder {
    color: #bdc3c7;
    font-weight: normal;
  }
}

.input-hint {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
}

// Account Info Display
.account-info {
  margin-top: 1rem;
}

.account-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid rgba(52, 152, 219, 0.1);
}

.account-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.account-type {
  font-weight: 600;
  color: #2c3e50;
}

.account-iban {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.account-balance {
  font-size: 0.9rem;
  color: #27ae60;
  font-weight: 500;
}

// Quick Amounts
.quick-amounts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #5d6d7e;
}

.amount-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.75rem;
}

.quick-amount-btn {
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  color: #3498db;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3498db;
    background: #3498db;
    color: white;
    transform: translateY(-1px);
  }
}

// Alerts
.alert {
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &.alert-error {
    background: #fadbd8;
    color: #e74c3c;
    border: 1px solid #f1c0c0;
  }
  
  &.alert-success {
    background: #d5f4e6;
    color: #27ae60;
    border: 1px solid #a9dfbf;
  }
}

// Transfer Summary
.transfer-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(52, 152, 219, 0.1);
  
  h4 {
    margin: 0 0 1rem 0;
    color: #2c3e50;
    font-size: 1.1rem;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e1e8ed;
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
  }
}

.summary-label {
  color: #7f8c8d;
}

.summary-value {
  color: #2c3e50;
  font-family: 'Courier New', monospace;
  
  &.amount {
    color: #27ae60;
    font-size: 1.1rem;
    font-weight: 700;
  }
}

// Submit Button
.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.4);
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
  
  &.loading {
    background: #3498db;
  }
}

.loading-content, .submit-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Security Notice
.security-notice {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  color: #2c3e50;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.security-icon {
  font-size: 2rem;
  color: #27ae60;
}

.notice-text {
  h4 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }
  
  p {
    margin: 0;
    color: #5d6d7e;
    font-size: 0.9rem;
  }
}

// Responsive Design
@media (max-width: 768px) {
  .transfer-funds-container {
    padding: 1rem 0;
  }
  
  .header-section, .content-section {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .amount-buttons {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .account-display {
    flex-direction: column;
    text-align: center;
  }
  
  .notice-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>

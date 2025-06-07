<template>
  <div class="atm-operations-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-university me-3"></i>
          ATM Operations
        </h1>
        <p class="page-subtitle">
          Deposit or withdraw funds from your accounts
        </p>
      </div>
    </div>

    <!-- ATM Machine Interface -->
    <div class="atm-interface">
      <div class="atm-screen">
        <div class="screen-header">
          <div class="bank-logo">
            <i class="fas fa-university"></i>
            <span>InhollandBank ATM</span>
          </div>
          <div class="status-indicator">
            <div class="status-dot"></div>
            <span>Online</span>
          </div>
        </div>

        <div class="screen-content">
          <!-- Operation Type Selection -->
          <div class="operation-selector">
            <h3>Select Operation</h3>
            <div class="operation-buttons">
              <button
                type="button"
                class="operation-btn"
                :class="{ active: operationType === 'deposit' }"
                @click="operationType = 'deposit'"
              >
                <i class="fas fa-arrow-down"></i>
                <span>Deposit Cash</span>
              </button>
              <button
                type="button"
                class="operation-btn"
                :class="{ active: operationType === 'withdraw' }"
                @click="operationType = 'withdraw'"
              >
                <i class="fas fa-arrow-up"></i>
                <span>Withdraw Cash</span>
              </button>
            </div>
          </div>

          <!-- Transaction Form -->
          <form @submit.prevent="handleAtmOperation" class="atm-form">
            <!-- Account Selection -->
            <div class="form-section">
              <label class="section-label">
                <i class="fas fa-credit-card me-2"></i>
                Select Account
              </label>
              <div class="select-wrapper">
                <select v-model="selectedAccount" class="atm-select" required>
                  <option value="">Choose your account</option>
                  <option
                    v-for="account in userAccounts"
                    :key="account.iban"
                    :value="account.iban"
                  >
                    {{ account.accountType }} -
                    {{ formatIban(account.iban) }} (€{{
                      account.balance.toFixed(2)
                    }})
                  </option>
                </select>
                <i class="fas fa-chevron-down select-arrow"></i>
              </div>

              <!-- Selected Account Display -->
              <div v-if="selectedAccountDetails" class="account-display">
                <div class="account-card">
                  <div class="account-icon">
                    <i
                      :class="
                        getAccountIcon(selectedAccountDetails.accountType)
                      "
                    ></i>
                  </div>
                  <div class="account-info">
                    <h4>{{ selectedAccountDetails.accountType }}</h4>
                    <p class="account-number">
                      {{ formatIban(selectedAccountDetails.iban) }}
                    </p>
                    <div class="account-balance">
                      <span class="balance-label">Available Balance:</span>
                      <span class="balance-amount"
                        >€{{ selectedAccountDetails.balance.toFixed(2) }}</span
                      >
                    </div>
                    <div class="daily-limit">
                      <span class="limit-label">Daily Limit:</span>
                      <span class="limit-amount"
                        >€{{ selectedAccountDetails.dailyLimit }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amount Input -->
            <div class="form-section">
              <label class="section-label">
                <i class="fas fa-euro-sign me-2"></i>
                Amount
              </label>
              <div class="amount-input-wrapper">
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
            </div>

            <!-- Quick Amount Buttons -->
            <div class="form-section">
              <label class="section-label">Quick Select</label>
              <div class="quick-amounts">
                <button
                  type="button"
                  v-for="quickAmount in quickAmounts"
                  :key="quickAmount"
                  @click="amount = quickAmount"
                  class="quick-amount-btn"
                  :class="{ selected: amount == quickAmount }"
                >
                  €{{ quickAmount }}
                </button>
              </div>
            </div>

            <!-- Transaction Summary -->
            <div
              v-if="operationType && selectedAccount && amount"
              class="transaction-summary"
            >
              <h4>Transaction Summary</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="summary-label">Operation:</span>
                  <span
                    class="summary-value operation-type"
                    :class="operationType"
                  >
                    <i
                      :class="
                        operationType === 'deposit'
                          ? 'fas fa-arrow-down'
                          : 'fas fa-arrow-up'
                      "
                    ></i>
                    {{
                      operationType === "deposit"
                        ? "Cash Deposit"
                        : "Cash Withdrawal"
                    }}
                  </span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Account:</span>
                  <span class="summary-value">{{
                    formatIban(selectedAccount)
                  }}</span>
                </div>
                <div class="summary-item">
                  <span class="summary-label">Amount:</span>
                  <span class="summary-value amount"
                    >€{{ parseFloat(amount || 0).toFixed(2) }}</span
                  >
                </div>
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

            <!-- Submit Button -->
            <button
              type="submit"
              class="atm-submit-btn"
              :class="[operationType, { loading: loading }]"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="loading-content">
                <i class="fas fa-spinner fa-spin me-2"></i>
                Processing...
              </span>
              <span v-else class="submit-content">
                <i
                  :class="
                    operationType === 'deposit' ? 'fas fa-plus' : 'fas fa-minus'
                  "
                  class="me-2"
                ></i>
                {{
                  operationType === "deposit" ? "Deposit Cash" : "Withdraw Cash"
                }}
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- ATM Side Panel -->
      <div class="atm-side-panel">
        <div class="panel-content">
          <div class="instructions">
            <h4>Instructions</h4>
            <div class="instruction-item">
              <i class="fas fa-1"></i>
              <span
                >Select
                {{ operationType === "deposit" ? "deposit" : "withdrawal" }}
                operation</span
              >
            </div>
            <div class="instruction-item">
              <i class="fas fa-2"></i>
              <span>Choose your account</span>
            </div>
            <div class="instruction-item">
              <i class="fas fa-3"></i>
              <span>Enter or select amount</span>
            </div>
            <div class="instruction-item">
              <i class="fas fa-4"></i>
              <span>Confirm transaction</span>
            </div>
          </div>

          <div class="safety-notice">
            <i class="fas fa-shield-alt safety-icon"></i>
            <div class="safety-text">
              <h5>Safety Notice</h5>
              <p>
                Always ensure you're alone when using the ATM and cover your PIN
                entry.
              </p>
            </div>
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
  name: "AtmOperations",
  setup() {
    return {
      store: useUserSessionStore(),
    };
  },
  data() {
    return {
      operationType: "deposit",
      selectedAccount: "",
      amount: null,
      userAccounts: [],
      loading: false,
      error: null,
      success: null,
      quickAmounts: [10, 20, 50, 100, 200],
    };
  },
  computed: {
    selectedAccountDetails() {
      return this.userAccounts.find(
        (account) => account.iban === this.selectedAccount
      );
    },
    isFormValid() {
      return (
        this.operationType &&
        this.selectedAccount &&
        this.amount &&
        this.amount > 0
      );
    },
  },
  async created() {
    await this.fetchUserAccounts();
  },
  methods: {
    async fetchUserAccounts() {
      try {
        const response = await axios.get("/accounts");
        this.userAccounts = response.data.map((account) => ({
          iban: account.iban,
          balance: parseFloat(account.balance),
          accountType: this.formatAccountType(account.bankAccountType),
          dailyLimit: account.dailyLimit,
        }));
      } catch (error) {
        console.error("Error fetching accounts:", error);
        this.error = "Failed to load your accounts";
      }
    },
    formatAccountType(type) {
      switch (type) {
        case "CHECKING_ACCOUNT":
          return "Checking Account";
        case "SAVING_ACCOUNT":
          return "Savings Account";
        default:
          return type;
      }
    },
    formatIban(iban) {
      if (!iban) return "";
      return iban.replace(/(.{4})/g, "$1 ").trim();
    },
    getAccountIcon(accountType) {
      return accountType.includes("Checking")
        ? "fas fa-credit-card"
        : "fas fa-piggy-bank";
    },
    async handleAtmOperation() {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const request = {
          amount: parseFloat(this.amount),
          iban: this.selectedAccount,
        };

        let endpoint = "";

        if (this.operationType === "withdraw") {
          endpoint = "/transactions/withdraw";
        } else {
          // Assuming you still use this for deposits (update if needed)
          endpoint = "/transactions/atm/transaction";
          // If deposit uses 'toIban' instead of 'iban', keep this:
          request.toIban = this.selectedAccount;
          delete request.iban;
        }

        const response = await axios.post(endpoint, request);
        //this.success = response.data;
        this.success = "Transaction successful.";

        // Reset form
        this.amount = null;

        // Refresh account balances
        await this.fetchUserAccounts();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.success = null;
        }, 5000);
      } catch (error) {
        if (error.response) {
          const errorMessage =
            error.response.data?.message ||
            error.response.data ||
            "An error occurred.";

          switch (error.response.status) {
            case 404:
              this.error = "Account not found. Please select a valid account.";
              break;
            case 400:
              this.error = errorMessage;
              break;
            case 403:
              this.error = errorMessage;
              break;
            default:
              this.error = errorMessage;
          }
        } else {
          this.error =
            "Network error. Please check your connection and try again.";
        }
        console.error("ATM operation error:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.atm-operations-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  padding: 2rem 0;
  position: relative;

  // ATM-style background pattern
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
    pointer-events: none;
  }
}

// Header Section
.header-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  position: relative;
  z-index: 1;
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  i {
    color: #00ff88;
  }
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

// ATM Interface
.atm-interface {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

// ATM Screen
.atm-screen {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border: 3px solid #00ff88;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    height: 4px;
    background: linear-gradient(90deg, #00ff88, #00cc6a, #00ff88);
    border-radius: 2px;
    animation: atmPulse 2s ease-in-out infinite;
  }
}

@keyframes atmPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.screen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.3);
}

.bank-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00ff88;
  font-weight: 600;
  font-size: 1.1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00ff88;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: blink 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.screen-content {
  color: white;
}

// Operation Selector
.operation-selector {
  margin-bottom: 2rem;

  h3 {
    color: #00ff88;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.3rem;
  }
}

.operation-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.operation-btn {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    border-color: rgba(0, 255, 136, 0.6);
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
  }

  i {
    font-size: 1.5rem;
  }
}

// Form Styling
.atm-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-label {
  color: #00ff88;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
}

// Select Styling
.select-wrapper {
  position: relative;
}

.atm-select {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  appearance: none;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  }

  option {
    background: #2c3e50;
    color: white;
  }
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #00ff88;
  pointer-events: none;
}

// Account Display
.account-display {
  margin-top: 1rem;
}

.account-card {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.account-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  font-size: 1.5rem;
}

.account-info {
  flex: 1;

  h4 {
    margin: 0 0 0.5rem 0;
    color: white;
    font-size: 1.1rem;
  }

  .account-number {
    margin: 0 0 0.5rem 0;
    font-family: "Courier New", monospace;
    color: #00ff88;
    font-size: 0.9rem;
  }
}

.account-balance,
.daily-limit {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.balance-label,
.limit-label {
  color: #bdc3c7;
}

.balance-amount {
  color: #00ff88;
  font-weight: 600;
}

.limit-amount {
  color: #f39c12;
  font-weight: 600;
}

// Amount Input
.amount-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #00ff88;
  z-index: 1;
}

.amount-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ff88;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

// Quick Amounts
.quick-amounts {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
}

.quick-amount-btn {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 10px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 255, 136, 0.1);
    border-color: rgba(0, 255, 136, 0.6);
    transform: scale(1.05);
  }

  &.selected {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
  }
}

// Transaction Summary
.transaction-summary {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  padding: 1.5rem;

  h4 {
    margin: 0 0 1rem 0;
    color: #00ff88;
    text-align: center;
  }
}

.summary-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.summary-label {
  color: #bdc3c7;
  font-size: 0.9rem;
}

.summary-value {
  color: white;
  font-weight: 600;
  font-family: "Courier New", monospace;

  &.operation-type {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.deposit {
      color: #00ff88;
    }

    &.withdraw {
      color: #ff6b6b;
    }
  }

  &.amount {
    color: #00ff88;
    font-size: 1.1rem;
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
    background: rgba(255, 107, 107, 0.2);
    color: #ff6b6b;
    border: 1px solid rgba(255, 107, 107, 0.3);
  }

  &.alert-success {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
    border: 1px solid rgba(0, 255, 136, 0.3);
  }
}

// Submit Button
.atm-submit-btn {
  width: 100%;
  padding: 1.5rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  cursor: pointer;

  &.deposit {
    background: linear-gradient(45deg, #00ff88, #00cc6a);
    color: #1a1a1a;
  }

  &.withdraw {
    background: linear-gradient(45deg, #ff6b6b, #ff5252);
    color: white;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #7f8c8d;
    cursor: not-allowed;
    color: #bdc3c7;
  }

  &.loading {
    background: #3498db;
    color: white;
  }
}

.loading-content,
.submit-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Side Panel
.atm-side-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
}

.panel-content {
  color: white;
}

.instructions {
  margin-bottom: 2rem;

  h4 {
    color: #00ff88;
    margin-bottom: 1rem;
    text-align: center;
  }
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 8px;

  i {
    width: 30px;
    height: 30px;
    background: #00ff88;
    color: #1a1a1a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.9rem;
  }

  span {
    font-size: 0.9rem;
  }
}

.safety-notice {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.safety-icon {
  font-size: 1.5rem;
  color: #f39c12;
  margin-top: 0.25rem;
}

.safety-text {
  h5 {
    margin: 0 0 0.5rem 0;
    color: #f39c12;
    font-size: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: #ecf0f1;
    line-height: 1.4;
  }
}

// Responsive Design
@media (max-width: 968px) {
  .atm-interface {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .operation-buttons {
    grid-template-columns: 1fr;
  }

  .quick-amounts {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .atm-operations-container {
    padding: 1rem 0;
  }

  .header-section,
  .atm-interface {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .atm-screen {
    padding: 1.5rem;
  }

  .quick-amounts {
    grid-template-columns: repeat(2, 1fr);
  }

  .account-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

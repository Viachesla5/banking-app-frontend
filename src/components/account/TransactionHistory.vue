<template>
  <div class="transaction-history-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="page-header">
        <h1 class="page-title">
          <i class="fas fa-history me-3"></i>
          Transaction History
        </h1>
        <p class="page-subtitle">Track all your financial activities and transactions</p>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-card">
        <div class="filters-header">
          <h3><i class="fas fa-filter me-2"></i>Filter Transactions</h3>
        </div>
        <div class="filters-grid">
          <!-- Account Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-university me-2"></i>Account
            </label>
            <select
              v-model="selectedAccount"
              class="filter-select"
              @change="fetchTransactions"
            >
              <option value="">All Accounts</option>
              <option
                v-for="account in accounts"
                :key="account.iban"
                :value="account.iban"
              >
                {{ account.accountType }} - {{ formatIban(account.iban) }}
              </option>
            </select>
          </div>

          <!-- Type Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-tags me-2"></i>Transaction Type
            </label>
            <select
              v-model="selectedType"
              class="filter-select"
              @change="fetchTransactions"
            >
              <option value="">All Types</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>

          <!-- Date Range Filters -->
          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-calendar-alt me-2"></i>Start Date
            </label>
            <input
              type="date"
              v-model="startDate"
              class="filter-input"
              @change="fetchTransactions"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <i class="fas fa-calendar-alt me-2"></i>End Date
            </label>
            <input
              type="date"
              v-model="endDate"
              class="filter-input"
              @change="fetchTransactions"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-content">
          <div class="spinner">
            <div class="spinner-ring"></div>
          </div>
          <p class="loading-text">Loading your transactions...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-card">
          <i class="fas fa-exclamation-triangle error-icon"></i>
          <h3>Failed to Load Transactions</h3>
          <p>{{ error }}</p>
          <button @click="fetchTransactions" class="retry-btn">
            <i class="fas fa-redo me-2"></i>
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="transactions.length === 0" class="empty-container">
        <div class="empty-card">
          <i class="fas fa-receipt empty-icon"></i>
          <h3>No Transactions Found</h3>
          <p>You don't have any transactions matching your current filters.</p>
          <button @click="clearFilters" class="clear-filters-btn">
            <i class="fas fa-times me-2"></i>
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Transactions List -->
      <div v-else class="transactions-container">
        <!-- Summary Stats -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-list-alt"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ transactions.length }}</span>
              <span class="stat-label">Total Transactions</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon incoming">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ incomingCount }}</span>
              <span class="stat-label">Incoming</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon outgoing">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ outgoingCount }}</span>
              <span class="stat-label">Outgoing</span>
            </div>
          </div>
        </div>

        <!-- Transactions Header -->
        <div class="transactions-header">
          <h3>Transaction Details</h3>
          <div class="sort-controls">
            <button 
              @click="sortBy('date')" 
              class="sort-btn"
              :class="{ active: sortKey === 'date' }"
            >
              <i class="fas fa-calendar"></i>
              Date
              <i v-if="sortKey === 'date'" :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
            </button>
            <button 
              @click="sortBy('amount')" 
              class="sort-btn"
              :class="{ active: sortKey === 'amount' }"
            >
              <i class="fas fa-euro-sign"></i>
              Amount
              <i v-if="sortKey === 'amount'" :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
            </button>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="transactions-list">
          <div
            v-for="transaction in sortedTransactions"
            :key="transaction.id"
            class="transaction-card"
          >
            <div class="transaction-icon">
              <i :class="getTransactionIcon(transaction.type)"></i>
            </div>
            <div class="transaction-details">
              <div class="transaction-header">
                <h4 class="transaction-title">{{ transaction.description }}</h4>
                <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
              </div>
              <div class="transaction-accounts">
                <div class="account-flow">
                  <span class="from-account">
                    <i class="fas fa-arrow-right me-1"></i>
                    {{ formatIban(transaction.fromAccount) || 'External' }}
                  </span>
                  <i class="fas fa-long-arrow-alt-right flow-arrow"></i>
                  <span class="to-account">
                    {{ formatIban(transaction.toAccount) || 'External' }}
                    <i class="fas fa-arrow-left ms-1"></i>
                  </span>
                </div>
              </div>
              <div class="transaction-meta">
                <span class="transaction-type" :class="getTransactionTypeClass(transaction.type)">
                  {{ transaction.type }}
                </span>
              </div>
            </div>
            <div class="transaction-amount">
              <span 
                class="amount-value" 
                :class="getAmountClass(transaction.amount)"
              >
                {{ transaction.amount >= 0 ? '+' : '-' }}€{{ Math.abs(transaction.amount).toFixed(2) }}
              </span>
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
  name: "TransactionHistory",
  setup() {
    return { 
      store: useUserSessionStore()
    };
  },
  data() {
    return {
      transactions: [],
      accounts: [],
      loading: false,
      selectedAccount: "",
      selectedType: "",
      startDate: "",
      endDate: "",
      sortKey: "date",
      sortOrder: "desc",
      error: null,
    };
  },
  computed: {
    sortedTransactions() {
      return [...this.transactions].sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (this.sortKey === "date") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (this.sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    },
    incomingCount() {
      return this.transactions.filter(tx => tx.amount > 0).length;
    },
    outgoingCount() {
      return this.transactions.filter(tx => tx.amount < 0).length;
    },
  },
  async created() {
    await this.fetchAccounts();
    await this.fetchTransactions();
  },
  methods: {
    async fetchAccounts() {
      try {
        const response = await axios.get("/accounts");
        this.accounts = response.data.map(account => ({
          iban: account.iban,
          balance: parseFloat(account.balance),
          accountType: this.formatAccountType(account.bankAccountType),
        }));
      } catch (error) {
        console.error("Error fetching accounts:", error);
        this.error = "Failed to load accounts";
      }
    },
    async fetchTransactions() {
      this.loading = true;
      this.error = null;
      try {
        if (this.selectedAccount) {
          // Fetch transactions for specific account
          const response = await axios.get(`/customer-accounts/${this.selectedAccount}/transactions`);
          let transactions = response.data.map(tx => ({
            id: tx.transactionId || Math.random(),
            date: tx.occuredAt,
            type: this.determineTransactionType(tx),
            fromAccount: tx.accountFrom || 'N/A',
            toAccount: tx.accountTo || 'N/A',
            amount: parseFloat(tx.amount),
            description: this.generateDescription(tx)
          }));
          
          // Apply client-side filtering
          this.transactions = this.applyClientSideFilters(transactions);
        } else {
          // Fetch all transactions for customer
          const customerResponse = await axios.get("/customer-accounts/get-customer");
          const customerData = customerResponse.data;
          
          // Get transactions for all customer accounts
          let allTransactions = [];
          for (const account of customerData.accounts) {
            try {
              const response = await axios.get(`/customer-accounts/${account.iban}/transactions`);
              allTransactions = [...allTransactions, ...response.data];
            } catch (error) {
              console.error(`Error fetching transactions for ${account.iban}:`, error);
            }
          }
          
          let transactions = allTransactions.map(tx => ({
            id: tx.transactionId || Math.random(),
            date: tx.occuredAt,
            type: this.determineTransactionType(tx),
            fromAccount: tx.accountFrom || 'N/A',
            toAccount: tx.accountTo || 'N/A',
            amount: parseFloat(tx.amount),
            description: this.generateDescription(tx)
          }));
          
          // Apply client-side filtering
          this.transactions = this.applyClientSideFilters(transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        this.error = "Failed to load transactions";
      } finally {
        this.loading = false;
      }
    },
    applyClientSideFilters(transactions) {
      let filtered = [...transactions];
      
      // Filter by transaction type
      if (this.selectedType) {
        filtered = filtered.filter(tx => tx.type === this.selectedType);
      }
      
      // Filter by date range
      if (this.startDate) {
        const startDate = new Date(this.startDate);
        filtered = filtered.filter(tx => new Date(tx.date) >= startDate);
      }
      
      if (this.endDate) {
        const endDate = new Date(this.endDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        filtered = filtered.filter(tx => new Date(tx.date) <= endDate);
      }
      
      return filtered;
    },
    determineTransactionType(transaction) {
      if (!transaction.accountFrom && transaction.accountTo) {
        return 'DEPOSIT';
      } else if (transaction.accountFrom && !transaction.accountTo) {
        return 'WITHDRAWAL';
      } else {
        return 'TRANSFER';
      }
    },
    generateDescription(transaction) {
      const type = this.determineTransactionType(transaction);
      switch(type) {
        case 'DEPOSIT':
          return `Deposit to Account`;
        case 'WITHDRAWAL':
          return `Withdrawal from Account`;
        case 'TRANSFER':
          return `Transfer Between Accounts`;
        default:
          return 'Transaction';
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
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortOrder = "asc";
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatIban(iban) {
      if (!iban || iban === 'N/A') return iban;
      return iban.replace(/(.{4})/g, '$1 ').trim();
    },
    getTransactionIcon(type) {
      switch(type) {
        case 'DEPOSIT':
          return 'fas fa-arrow-down text-success';
        case 'WITHDRAWAL':
          return 'fas fa-arrow-up text-danger';
        case 'TRANSFER':
          return 'fas fa-exchange-alt text-primary';
        default:
          return 'fas fa-credit-card';
      }
    },
    getTransactionTypeClass(type) {
      return {
        'type-deposit': type === 'DEPOSIT',
        'type-withdrawal': type === 'WITHDRAWAL',
        'type-transfer': type === 'TRANSFER',
      };
    },
    getAmountClass(amount) {
      return {
        'amount-positive': amount > 0,
        'amount-negative': amount < 0,
      };
    },
    clearFilters() {
      this.selectedAccount = '';
      this.selectedType = '';
      this.startDate = '';
      this.endDate = '';
      this.fetchTransactions();
    },
  },
};
</script>

<style lang="scss" scoped>
.transaction-history-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

// Header Section
.header-section {
  max-width: 1200px;
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

// Filters Section
.filters-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
}

.filters-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.filters-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1.5rem 2rem;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  
  i {
    color: #3498db;
  }
}

.filter-select, .filter-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  background: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
}

// Content Section
.content-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

// Loading State
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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

// Empty State
.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.empty-icon {
  font-size: 3rem;
  color: #95a5a6;
  margin-bottom: 1rem;
}

.clear-filters-btn {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
  }
}

// Stats Row
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  
  &.incoming {
    background: linear-gradient(135deg, #27ae60, #2ecc71);
  }
  
  &.outgoing {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  color: #5d6d7e;
}

// Transactions Container
.transactions-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.transactions-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
  }
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
}

.sort-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover, &.active {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
}

// Transactions List
.transactions-list {
  max-height: 600px;
  overflow-y: auto;
  padding: 1rem;
}

.transaction-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid rgba(52, 152, 219, 0.1);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.transaction-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.transaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.transaction-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.transaction-accounts {
  margin: 0.25rem 0;
}

.account-flow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #5d6d7e;
}

.from-account, .to-account {
  font-family: 'Courier New', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e1e8ed;
}

.flow-arrow {
  color: #3498db;
}

.transaction-type {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  
  &.type-deposit {
    background: #d5f4e6;
    color: #27ae60;
  }
  
  &.type-withdrawal {
    background: #fadbd8;
    color: #e74c3c;
  }
  
  &.type-transfer {
    background: #d6eaf8;
    color: #3498db;
  }
}

.transaction-amount {
  text-align: right;
  min-width: 120px;
}

.amount-value {
  font-size: 1.3rem;
  font-weight: 700;
  
  &.amount-positive {
    color: #27ae60;
  }
  
  &.amount-negative {
    color: #e74c3c;
  }
}

// Responsive Design
@media (max-width: 968px) {
  .filters-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .transactions-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .transaction-card {
    flex-direction: column;
    text-align: center;
  }
  
  .transaction-header {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .account-flow {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .transaction-history-container {
    padding: 1rem 0;
  }
  
  .header-section, .filters-section, .content-section {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filters-card, .transactions-container {
    border-radius: 16px;
  }
  
  .sort-controls {
    flex-direction: column;
    width: 100%;
  }
  
  .sort-btn {
    justify-content: center;
  }
}
</style>

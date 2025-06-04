<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Transaction History</h4>
      </div>
      <div class="card-body">
        <!-- Filters -->
        <div class="row mb-4">
          <div class="col-md-3">
            <select
              v-model="selectedAccount"
              class="form-select"
              @change="fetchTransactions"
            >
              <option value="">All Accounts</option>
              <option
                v-for="account in accounts"
                :key="account.iban"
                :value="account.iban"
              >
                {{ account.accountType }} - {{ account.iban }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <select
              v-model="selectedType"
              class="form-select"
              @change="fetchTransactions"
            >
              <option value="">All Types</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>
          <div class="col-md-3">
            <input
              type="date"
              v-model="startDate"
              class="form-control"
              @change="fetchTransactions"
            />
          </div>
          <div class="col-md-3">
            <input
              type="date"
              v-model="endDate"
              class="form-control"
              @change="fetchTransactions"
            />
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  Date
                  <span v-if="sortKey === 'date'" class="sort-icon">
                    {{ sortOrder === "asc" ? "↑" : "↓" }}
                  </span>
                </th>
                <th @click="sortBy('type')" class="sortable">
                  Type
                  <span v-if="sortKey === 'type'" class="sort-icon">
                    {{ sortOrder === "asc" ? "↑" : "↓" }}
                  </span>
                </th>
                <th>From Account</th>
                <th>To Account</th>
                <th @click="sortBy('amount')" class="sortable">
                  Amount
                  <span v-if="sortKey === 'amount'" class="sort-icon">
                    {{ sortOrder === "asc" ? "↑" : "↓" }}
                  </span>
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in sortedTransactions"
                :key="transaction.id"
              >
                <td>{{ formatDate(transaction.date) }}</td>
                <td>
                  <span :class="getTransactionTypeClass(transaction.type)">
                    {{ transaction.type }}
                  </span>
                </td>
                <td>{{ transaction.fromAccount }}</td>
                <td>{{ transaction.toAccount }}</td>
                <td :class="getAmountClass(transaction.amount)">
                  €{{ Math.abs(transaction.amount).toFixed(2) }}
                </td>
                <td>{{ transaction.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading and Empty States -->
        <div v-if="loading" class="text-center mt-4">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p class="mt-2">Loading transactions...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger mt-4">
          {{ error }}
          <button @click="fetchTransactions" class="btn btn-sm btn-outline-danger ml-2">
            Retry
          </button>
        </div>
        <div v-else-if="transactions.length === 0" class="text-center mt-4">
          <p class="text-muted">No transactions found</p>
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
          return `Deposit to ${transaction.accountTo}`;
        case 'WITHDRAWAL':
          return `Withdrawal from ${transaction.accountFrom}`;
        case 'TRANSFER':
          return `Transfer from ${transaction.accountFrom} to ${transaction.accountTo}`;
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
    getTransactionTypeClass(type) {
      return {
        "badge bg-success": type === "DEPOSIT",
        "badge bg-danger": type === "WITHDRAWAL",
        "badge bg-primary": type === "TRANSFER",
      };
    },
    getAmountClass(amount) {
      return {
        "text-success": amount > 0,
        "text-danger": amount < 0,
      };
    },
  },
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: #f8f9fa;
}

.sort-icon {
  margin-left: 5px;
}

.badge {
  padding: 5px 10px;
  font-size: 0.8em;
}

.table th {
  white-space: nowrap;
}

.form-select,
.form-control {
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .form-select,
  .form-control {
    margin-bottom: 10px;
  }
}
</style>

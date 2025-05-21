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
            <select v-model="selectedAccount" class="form-select" @change="fetchTransactions">
              <option value="">All Accounts</option>
              <option v-for="account in accounts" :key="account.iban" :value="account.iban">
                {{ account.accountType }} - {{ account.iban }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="selectedType" class="form-select" @change="fetchTransactions">
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
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th @click="sortBy('type')" class="sortable">
                  Type
                  <span v-if="sortKey === 'type'" class="sort-icon">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>From Account</th>
                <th>To Account</th>
                <th @click="sortBy('amount')" class="sortable">
                  Amount
                  <span v-if="sortKey === 'amount'" class="sort-icon">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in sortedTransactions" :key="transaction.id">
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
          <p>Loading transactions...</p>
        </div>
        <div v-else-if="transactions.length === 0" class="text-center mt-4">
          <p>No transactions found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../Axios-auth";
import { useUserSessionStore } from "../store/userSessionStore";

export default {
  name: "TransactionHistory",
  setup() {
    return { store: useUserSessionStore() };
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
        const response = await axios.get("/api/accounts");
        this.accounts = response.data;
      } catch (error) {
        console.error("Error fetching accounts:", error);
        alert("Failed to load accounts");
      }
    },
    async fetchTransactions() {
      this.loading = true;
      try {
        const params = new URLSearchParams();
        if (this.selectedAccount) params.append("account", this.selectedAccount);
        if (this.selectedType) params.append("type", this.selectedType);
        if (this.startDate) params.append("startDate", this.startDate);
        if (this.endDate) params.append("endDate", this.endDate);

        const response = await axios.get(`/api/transactions?${params.toString()}`);
        this.transactions = response.data;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to load transactions");
      } finally {
        this.loading = false;
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
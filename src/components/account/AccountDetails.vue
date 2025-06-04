<template>
  <div class="container mt-4">
    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2">Loading your account details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <button @click="fetchCustomerDetails" class="btn btn-sm btn-outline-danger ml-2">
        Retry
      </button>
    </div>

    <!-- Content -->
    <div v-else class="row">
      <!-- Customer Information Card -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Customer Information</h4>
          </div>
          <div class="card-body">
            <div v-if="customerInfo" class="customer-info">
              <p>
                <strong>Name:</strong> {{ customerInfo.firstName }}
                {{ customerInfo.lastName }}
              </p>
              <p><strong>Username:</strong> {{ customerInfo.username }}</p>
              <p><strong>Email:</strong> {{ customerInfo.email }}</p>
              <p><strong>Phone:</strong> {{ customerInfo.phoneNumber }}</p>
              <p><strong>BSN:</strong> {{ customerInfo.bsn }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Summary Card -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">Account Summary</h4>
          </div>
          <div class="card-body">
            <div v-if="accounts.length > 0">
              <h5 class="mb-3">Total Balance: €{{ totalBalance.toFixed(2) }}</h5>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Account Type</th>
                      <th>IBAN</th>
                      <th>Balance</th>
                      <th>Daily Limit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="account in accounts" :key="account.iban">
                      <td>{{ account.accountType }}</td>
                      <td class="font-monospace">{{ account.iban }}</td>
                      <td class="text-success font-weight-bold">€{{ account.balance.toFixed(2) }}</td>
                      <td>€{{ account.dailyLimit }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-center">
              <p class="text-muted">No accounts found</p>
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
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  font-weight: bold;
  border-radius: 8px 8px 0 0 !important;
}

.customer-info p {
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
  background-color: #f8f9fa;
  font-weight: 600;
}

.table td {
  vertical-align: middle;
}

.font-monospace {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.btn-outline-danger {
  margin-left: 10px;
}

.text-success {
  color: #28a745 !important;
}

.font-weight-bold {
  font-weight: 700;
}

.text-muted {
  color: #6c757d !important;
}

.alert {
  border-radius: 8px;
}
</style>

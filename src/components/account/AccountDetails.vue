<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Customer Information Card -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Customer Information</h4>
          </div>
          <div class="card-body">
            <div v-if="customerInfo" class="customer-info">
              <p><strong>Name:</strong> {{ customerInfo.firstName }} {{ customerInfo.lastName }}</p>
              <p><strong>Email:</strong> {{ customerInfo.email }}</p>
              <p><strong>Phone:</strong> {{ customerInfo.phoneNumber }}</p>
              <p><strong>BSN:</strong> {{ customerInfo.bsn }}</p>
            </div>
            <div v-else class="text-center">
              <p>Loading customer information...</p>
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
              <h5>Total Balance: €{{ totalBalance.toFixed(2) }}</h5>
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Account Type</th>
                      <th>IBAN</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="account in accounts" :key="account.iban">
                      <td>{{ account.accountType }}</td>
                      <td>{{ account.iban }}</td>
                      <td>€{{ account.balance.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-else class="text-center">
              <p>No accounts found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../Axios-auth";
import { useUserSessionStore } from "../store/userSessionStore";

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
    };
  },
  async created() {
    await this.fetchCustomerInfo();
    await this.fetchAccounts();
  },
  methods: {
    async fetchCustomerInfo() {
      try {
        const response = await axios.get("/api/customer/profile");
        this.customerInfo = response.data;
      } catch (error) {
        console.error("Error fetching customer info:", error);
        alert("Failed to load customer information");
      }
    },
    async fetchAccounts() {
      try {
        const response = await axios.get("/api/accounts");
        this.accounts = response.data;
        this.calculateTotalBalance();
      } catch (error) {
        console.error("Error fetching accounts:", error);
        alert("Failed to load account information");
      }
    },
    calculateTotalBalance() {
      this.totalBalance = this.accounts.reduce((total, account) => {
        return total + account.balance;
      }, 0);
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
}

.customer-info p {
  margin-bottom: 0.5rem;
}

.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
}
</style> 
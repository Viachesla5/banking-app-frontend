<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">Transfer Funds</h4>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleTransfer">
          <!-- From Account Selection -->
          <div class="mb-3">
            <label for="fromAccount" class="form-label">From Account</label>
            <select
              id="fromAccount"
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
                {{ account.accountType }} - {{ account.iban }} (Balance: €{{
                  account.balance.toFixed(2)
                }})
              </option>
            </select>
          </div>

          <!-- To Account Input -->
          <div class="mb-3">
            <label for="toAccount" class="form-label">To Account (IBAN)</label>
            <input
              type="text"
              id="toAccount"
              v-model="toAccount"
              class="form-control"
              placeholder="Enter recipient's IBAN"
              required
            />
          </div>

          <!-- Amount Input -->
          <div class="mb-3">
            <label for="amount" class="form-label">Amount (€)</label>
            <div class="input-group">
              <span class="input-group-text">€</span>
              <input
                type="number"
                id="amount"
                v-model="amount"
                class="form-control"
                placeholder="Enter amount"
                step="0.01"
                min="0.01"
                required
              />
            </div>
          </div>

          <!-- Description Input -->
          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <input
              type="text"
              id="description"
              v-model="description"
              class="form-control"
              placeholder="Enter transfer description"
              required
            />
          </div>

          <!-- Error Messages -->
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="success" class="alert alert-success" role="alert">
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? "Processing..." : "Transfer" }}
          </button>
        </form>
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
      description: "",
      userAccounts: [],
      loading: false,
      error: null,
      success: null,
    };
  },
  async created() {
    await this.fetchUserAccounts();
  },
  methods: {
    async fetchUserAccounts() {
      try {
        const response = await axios.get("/api/accounts");
        this.userAccounts = response.data;
      } catch (error) {
        console.error("Error fetching accounts:", error);
        this.error = "Failed to load your accounts";
      }
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
          description: this.description,
        };

        const response = await axios.post(
          "/api/transactions/transfer",
          request
        );
        this.success = response.data;

        // Reset form
        this.fromAccount = "";
        this.toAccount = "";
        this.amount = null;
        this.description = "";

        // Refresh account balances
        await this.fetchUserAccounts();
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.error = "Account not found";
              break;
            case 400:
              this.error = error.response.data || "Invalid transfer";
              break;
            default:
              this.error = "An error occurred while processing your request";
          }
        } else {
          this.error = "Network error. Please try again";
        }
        console.error("Transfer error:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-label {
  font-weight: 500;
}

.alert {
  margin-top: 1rem;
}

.input-group-text {
  background-color: #f8f9fa;
}
</style>

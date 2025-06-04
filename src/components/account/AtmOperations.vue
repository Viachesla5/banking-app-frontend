<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h4 class="mb-0">ATM Operations</h4>
      </div>
      <div class="card-body">
        <!-- Operation Type Selection -->
        <div class="mb-4">
          <div class="btn-group w-100" role="group">
            <input
              type="radio"
              class="btn-check"
              name="operationType"
              id="deposit"
              value="deposit"
              v-model="operationType"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="deposit">Deposit</label>

            <input
              type="radio"
              class="btn-check"
              name="operationType"
              id="withdraw"
              value="withdraw"
              v-model="operationType"
              autocomplete="off"
            />
            <label class="btn btn-outline-primary" for="withdraw"
              >Withdraw</label
            >
          </div>
        </div>

        <form @submit.prevent="handleAtmOperation">
          <!-- Account Selection -->
          <div class="mb-3">
            <label for="account" class="form-label">Select Account</label>
            <select
              id="account"
              v-model="selectedAccount"
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

          <!-- Quick Amount Buttons -->
          <div class="mb-3">
            <div class="btn-group w-100" role="group">
              <button
                type="button"
                class="btn btn-outline-secondary"
                v-for="quickAmount in quickAmounts"
                :key="quickAmount"
                @click="amount = quickAmount"
              >
                €{{ quickAmount }}
              </button>
            </div>
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
          <button
            type="submit"
            class="btn"
            :class="operationType === 'deposit' ? 'btn-success' : 'btn-danger'"
            :disabled="loading"
          >
            {{
              loading
                ? "Processing..."
                : operationType === "deposit"
                ? "Deposit"
                : "Withdraw"
            }}
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
          dailyLimit: account.dailyLimit,
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
    async handleAtmOperation() {
      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        const request = {
          amount: parseFloat(this.amount),
        };

        if (this.operationType === "deposit") {
          request.toIban = this.selectedAccount;
        } else {
          request.fromIban = this.selectedAccount;
        }

        const response = await axios.post(
          "/transactions/atm/transaction",
          request
        );
        this.success = response.data;

        // Reset form
        this.amount = null;

        // Refresh account balances
        await this.fetchUserAccounts();
      } catch (error) {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.error = "Account not found";
              break;
            case 400:
              this.error = error.response.data || "Invalid transaction";
              break;
            default:
              this.error = "An error occurred while processing your request";
          }
        } else {
          this.error = "Network error. Please try again";
        }
        console.error("ATM operation error:", error);
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

.btn-group {
  margin-bottom: 1rem;
}

.btn-check:checked + .btn-outline-primary {
  background-color: #0d6efd;
  color: white;
}

.input-group-text {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .btn-group {
    flex-wrap: wrap;
  }

  .btn-group .btn {
    flex: 1 1 45%;
    margin: 2px;
  }
}
</style>

<template>
  <div class="container mt-5">
    <h2 class="mb-4">Your Bank Accounts</h2>

    <div v-if="loading">Loading accounts...</div>

    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <div v-else>
      <div
        v-for="account in accounts"
        :key="account.iban"
        class="card mb-3 shadow-sm"
      >
        <div class="card-body">
          <h5 class="card-title">{{ formatType(account.bankAccountType) }}</h5>
          <p class="card-text"><strong>IBAN:</strong> {{ account.iban }}</p>
          <p class="card-text">
            <strong>Balance:</strong> €{{ account.balance.toFixed(2) }}
          </p>
          <p class="card-text">
            <strong>Daily Limit:</strong> €{{ account.dailyLimit }}
          </p>
          <p class="card-text">
            <strong>Absolute Withdrawal Limit:</strong>
            €{{ account.absolutelyLimit }}
          </p>
          <p class="card-text">
            <strong>Deposit Limit:</strong>
            €{{ account.absoluteDepositLimit }}
          </p>
        </div>
      </div>

      <!-- Transfer Funds Form -->
      <div class="transfer-form card p-4 mt-5 shadow-sm">
        <h3>Transfer Funds</h3>

        <div class="mb-3">
          <label for="fromAccount" class="form-label">From Account</label>
          <select
            id="fromAccount"
            v-model="transfer.fromIban"
            class="form-select"
          >
            <option
              v-for="account in accounts"
              :key="account.iban"
              :value="account.iban"
            >
              {{ formatType(account.bankAccountType) }} -
              {{ account.iban }} (Balance: €{{ account.balance.toFixed(2) }})
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="toIban" class="form-label">To IBAN</label>
          <input
            id="toIban"
            v-model="transfer.toIban"
            type="text"
            class="form-control"
            placeholder="Enter recipient IBAN"
          />
        </div>

        <div class="mb-3">
          <label for="amount" class="form-label">Amount (€)</label>
          <input
            id="amount"
            v-model.number="transfer.amount"
            type="number"
            min="0.01"
            step="0.01"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="description" class="form-label"
            >Description (optional)</label
          >
          <input
            id="description"
            v-model="transfer.description"
            type="text"
            class="form-control"
            placeholder="Add a note"
          />
        </div>

        <button
          @click="submitTransfer"
          class="btn btn-primary"
          :disabled="transferLoading"
        >
          {{ transferLoading ? "Transferring..." : "Transfer" }}
        </button>

        <div v-if="transferError" class="alert alert-danger mt-3">
          {{ transferError }}
        </div>
        <div v-if="transferSuccess" class="alert alert-success mt-3">
          {{ transferSuccess }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../Axios-auth";
import { useUserSessionStore } from "@/store/userSessionStore";

export default {
  name: "Overview",
  data() {
    return {
      accounts: [],
      errorMessage: "",
      loading: true,

      // Transfer form state
      transfer: {
        fromIban: "",
        toIban: "",
        amount: null,
        description: "",
      },
      transferLoading: false,
      transferError: "",
      transferSuccess: "",
    };
  },
  mounted() {
    this.fetchAccounts();
  },
  methods: {
    formatType(type) {
      return type
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    },
    async fetchAccounts() {
      const store = useUserSessionStore();
      try {
        const response = await axios.get("/accounts", {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        });
        this.accounts = response.data;

        // Pre-select first account for transfer 'from' field
        if (this.accounts.length > 0) {
          this.transfer.fromIban = this.accounts[0].iban;
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = "Failed to load bank accounts.";
      } finally {
        this.loading = false;
      }
    },
    async submitTransfer() {
      this.transferError = "";
      this.transferSuccess = "";

      if (
        !this.transfer.fromIban ||
        !this.transfer.toIban ||
        !this.transfer.amount ||
        this.transfer.amount <= 0
      ) {
        this.transferError =
          "Please fill in all required fields with valid values.";
        return;
      }

      this.transferLoading = true;

      try {
        const store = useUserSessionStore();
        await axios.post(
          "/transactions/transaction",
          {
            fromIban: this.transfer.fromIban,
            toIban: this.transfer.toIban,
            amount: this.transfer.amount,
            description: this.transfer.description,
          },
          {
            headers: {
              Authorization: `Bearer ${store.token}`,
            },
          }
        );

        this.transferSuccess = "Transfer successful!";
        this.transfer.toIban = "";
        this.transfer.amount = null;
        this.transfer.description = "";

        // Refresh accounts balances after successful transfer
        this.fetchAccounts();
      } catch (error) {
        this.transferError =
          error.response?.data?.message || "Transfer failed. Please try again.";
      } finally {
        this.transferLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}

.transfer-form {
  border-radius: 1rem;
}
</style>

<template>
  <div class="container mt-5">
    <div class="search-section mb-5">
      <h3>Find IBANs by Customer Name</h3>
      <form @submit.prevent="searchByName">
        <div class="row mb-3">
          <div class="col">
            <input
              v-model="searchFirstName"
              type="text"
              class="form-control"
              placeholder="First Name"
              required
            />
          </div>
          <div class="col">
            <input
              v-model="searchLastName"
              type="text"
              class="form-control"
              placeholder="Last Name"
              required
            />
          </div>
          <div class="col-auto">
            <button type="submit" class="btn btn-primary">Search</button>
          </div>
        </div>
      </form>

      <div v-if="searchLoading">Searching...</div>
      <div v-if="searchError" class="alert alert-danger">{{ searchError }}</div>

      <div v-if="searchResults.length">
        <h5>Found Accounts:</h5>
        <ul class="list-group">
          <li
            v-for="account in searchResults"
            :key="account.iban"
            class="list-group-item"
          >
            {{ formatType(account.bankAccountType) }} - IBAN: {{ account.iban }}
          </li>
        </ul>
      </div>
    </div>

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
            <strong>Absolute Limit:</strong>
            €{{ account.absolutelyLimit }}
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
      searchFirstName: "",
      searchLastName: "",
      searchResults: [],
      searchLoading: false,
      searchError: "",

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

      const fromAccount = this.accounts.find(
        (acc) => acc.iban === this.transfer.fromIban
      );

      if (!fromAccount) {
        this.transferError = "Selected source account not found.";
        this.transferLoading = false;
        return;
      }

      const remainingBalance = fromAccount.balance - this.transfer.amount;

      if (remainingBalance < fromAccount.absolutelyLimit) {
        const confirmProceed = window.confirm(
          `⚠️ Warning: This transaction will result in a negative balance as you will use your absolute limit (€${fromAccount.absolutelyLimit}). Do you want to proceed?`
        );

        if (!confirmProceed) {
          this.transferLoading = false;
          return;
        }
      }

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

        this.fetchAccounts();
      } catch (error) {
        this.transferError =
          error.response?.data?.message || "Transfer failed. Please try again.";
      } finally {
        this.transferLoading = false;
      }
    },
    async searchByName() {
      this.searchLoading = true;
      this.searchError = "";
      this.searchResults = [];
      const store = useUserSessionStore();
      try {
        const response = await axios.get("/accounts/search", {
          params: {
            firstName: this.searchFirstName,
            lastName: this.searchLastName,
          },
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        });
        this.searchResults = response.data;
      } catch (error) {
        this.searchError =
          error.response?.data?.message || "Failed to search accounts.";
      } finally {
        this.searchLoading = false;
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

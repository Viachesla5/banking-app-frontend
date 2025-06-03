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
      } catch (error) {
        console.error(error);
        this.errorMessage = "Failed to load bank accounts.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>

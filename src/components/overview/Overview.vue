<template>
  <div>
    <div class="container mt-5">
      <h1>Overview</h1>
      <h6>This will be the landing page after login</h6>

      <div class="d-flex justify-content-between mt-3">
        <h5>
          Daylimit remaining: €{{ formatNumber(dayLimitRemaining.value) }}
        </h5>
        <div>
          <div
            class="d-flex justify-content-end mb-2"
            @click="() => router.push('/CreateTransaction')"
          >
            <button
              type="button"
              class="btn btn-primary shadow-sm"
              @click="$router.push('/CreateTransaction')"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>

      <div class="bankAccountsOverviewContainer ps-5 pe-5">
        <div class="d-flex justify-content-end mt-5">
          <h5>Total balance: €{{ formatNumber(totalBalance.value) }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "../../Axios-auth";
import "../../assets/main.css";
import { useUserSessionStore } from "/src/store/userSessionStore";

const router = useRouter();
const userSession = useUserSessionStore();

const dayLimitRemaining = ref(0);
const totalBalance = ref(0);

function formatNumber(value) {
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
}

async function fetchData() {
  try {
    // Example call
    const response = await axios.get("/accounts");
    const accounts = response.data;

    totalBalance.value = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    dayLimitRemaining.value = accounts.reduce(
      (sum, acc) => sum + acc.dayLimitRemaining,
      0
    );
  } catch (error) {
    console.error("Error fetching account data:", error);
  }
}

onMounted(fetchData);
</script>

<style scoped>
.container {
  height: 100%;
  margin-bottom: 10%;
}
.bankAccountContainer {
  background: #d9d9d9;
  border-radius: 18px;
}
.bankAccountsOverviewContainer {
  margin-right: 10%;
  margin-left: 10%;
}
</style>
../../store/userSessionStore

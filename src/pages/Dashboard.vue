<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-6 row q-col-gutter-md">
        <div class="col-12 col-lg-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">
                Total sales: {{ formatCurrency(totalSales) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-lg-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Average Spent per Transaction</div>
              <div class="text-subtitle">
                {{ formatCurrency(averageSpentPerTransaction) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Number of Transactions</div>
              <div class="text-subtitle">
                Total sales during the past 7 days:
                {{ formatCurrency(totalSales) }}
              </div>
              <apexchart
                :options="transactionChartOptions"
                :series="transactionChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="col-12 col-lg-6 row q-col-gutter-md">
        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Top 3 products by stocks</div>
              <div class="text-subtitle">
                <apexchart
                  :options="topThreeProductsByStockChartOptions"
                  :series="topThreeProductsByStockChartSeries"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "src/services/api";
import { useFormatCurrency } from "src/composables/useFormatCurrency";

defineOptions({
  name: "DashboardPage",
});

const { formatCurrency } = useFormatCurrency();
const totalSales = ref(0);
const products = ref([]);
const averageSpentPerTransaction = ref(0);

const fetchSalesData = async () => {
  try {
    const response = await api.get("/salesdetails");
    const salesDetails = response.data;

    if (salesDetails.length) {
      totalSales.value = salesDetails.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );

      averageSpentPerTransaction.value = totalSales.value / salesDetails.length;

      const salesPerDay = Array(7).fill(0);

      salesDetails.forEach((sale) => {
        const saleDay = new Date(sale.date).getDay();
        salesPerDay[saleDay] += sale.totalAmount;
      });

      transactionChartSeries.value[0].data = salesPerDay;
    }
  } catch (error) {
    console.error("Failed to fetch sales data:", error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    products.value = response.data.map((product) => ({
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
    }));
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

const topThreeProductsByStock = computed(() => {
  return [...products.value]
    .sort((a, b) => b.stock - a.stock) // Sort by stock in descending order
    .slice(0, 3); // Return the top 3
});

const topThreeProductsByStockChartOptions = computed(() => ({
  chart: {
    type: "bar",
    id: "topThreeProductsByStock",
  },
  xaxis: {
    categories: topThreeProductsByStock.value.map((product) => product.name),
  },
}));

const topThreeProductsByStockChartSeries = computed(() => [
  {
    name: "Top Three Products By Stocks",
    data: topThreeProductsByStock.value.map((product) => product.stock),
  },
]);

const today = new Date();

// Get the date 7 days ago
const oneWeekAgo = new Date();
oneWeekAgo.setDate(today.getDate() - 6);

// Array of day names
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to get the names of the days from one week ago to today
const getDaysNames = (startDate, endDate) => {
  const days = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Get the day name for the current date
    days.push(dayNames[currentDate.getDay()]);
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

// Get the names of the days from 7 days ago to today
const daysNames = getDaysNames(oneWeekAgo, today);

console.log("Days from 7 days ago to today:", daysNames);

const transactionChartOptions = ref({
  chart: {
    type: "line",
    id: "transaction",
  },
  xaxis: {
    categories: daysNames,
  },
});

const transactionChartSeries = ref([
  {
    name: "Sales",
    data: [],
  },
]);

onMounted(() => {
  fetchSalesData();
  fetchProducts();
});
</script>

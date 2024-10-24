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
              <div class="text-h6">Top 3 Products by Stocks</div>
              <apexchart
                :options="topThreeProductsByStockChartOptions"
                :series="topThreeProductsByStockChartSeries"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "DashboardPage",
});

const { formatCurrency } = useFormatCurrency();
const totalSales = ref(0);
const products = ref([]);
const averageSpentPerTransaction = ref(0);

const today = new Date();
const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 6);

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formattedToday = formatDate(today);
const formattedSevenDaysAgo = formatDate(sevenDaysAgo);

const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const dateRange = getDateRange(sevenDaysAgo, today);

const transactionChartOptions = ref({
  chart: {
    type: "line",
    id: "transaction",
  },
  xaxis: {
    categories: dateRange,
  },
});

const transactionChartSeries = ref([
  {
    name: "Sales",
    data: Array(7).fill(0),
  },
]);

const fetchSalesData = async () => {
  try {
    const response = await api.get("/salesdetails");
    const salesDetails = response.data;

    if (salesDetails.length) {
      const filteredSales = salesDetails.filter((sale) => {
        const saleDate = formatDate(new Date(sale.date));
        return saleDate >= formattedSevenDaysAgo && saleDate <= formattedToday;
      });

      totalSales.value = filteredSales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );

      averageSpentPerTransaction.value =
        filteredSales.length > 0 ? totalSales.value / filteredSales.length : 0;

      const salesByDate = new Map(dateRange.map((date) => [date, 0]));

      filteredSales.forEach((sale) => {
        const saleDate = formatDate(new Date(sale.date));
        if (salesByDate.has(saleDate)) {
          salesByDate.set(
            saleDate,
            salesByDate.get(saleDate) + sale.totalAmount
          );
        }
      });

      transactionChartSeries.value[0].data = Array.from(salesByDate.values());
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
  return [...products.value].sort((a, b) => b.stock - a.stock).slice(0, 3);
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

onMounted(() => {
  fetchSalesData();
  fetchProducts();
});
</script>

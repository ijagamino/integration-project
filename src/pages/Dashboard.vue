<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl items-start">
      <div class="col-12 col-lg-6 row q-col-gutter-md">
        <div class="col-12 col-xl-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">
                Total sales: {{ formatCurrency(totalSales) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-xl-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Average Spent per Transaction</div>
              <div class="text-subtitle">
                {{ formatCurrency(averageSpentPerTransaction) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12">
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
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Products Below Threshold</div>
              <q-slider
                v-model="threshold"
                :min="0"
                :max="50"
                :markers="10"
                :marker-labels="(val) => `${val}`"
                label-always
              />
              <q-table :rows="productsBelowThreshold" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Top Selling Products</div>
              <apexchart
                :options="topSellingProductsChartOptions"
                :series="topSellingProductsChartSeries"
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
const sales = ref(0);
const products = ref([]);
const salesDetails = ref();
const threshold = ref(25);

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
    salesDetails.value = response.data;

    if (salesDetails.value.length) {
      const filteredSales = salesDetails.value.filter((sale) => {
        const saleDate = formatDate(new Date(sale.date));
        return saleDate >= formattedSevenDaysAgo && saleDate <= formattedToday;
      });

      totalSales.value = filteredSales.reduce(
        (sum, sale) => sum + sale.totalAmount,
        0
      );

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

const fetchSales = async () => {
  try {
    const response = await api.get("/sales");
    sales.value = response.data.map((sales) => ({
      ...sales,
      totalAmount: parseFloat(sales.totalAmount),
      date: sales.date,
    }));
  } catch (error) {
    console.error("Failed to fetch sales: ", error);
  }
};

const topSellingProducts = computed(() => {
  const aggregatedQuantities = salesDetails.value?.reduce((acc, sale) => {
    if (!acc[sale.productID]) {
      acc[sale.productID] = {
        productName: sale.productName,
        quantity: 0,
      };
    }
    acc[sale.productID].quantity += sale.quantity;
    return acc;
  }, {});
  console.log(topSellingProducts.value);
  return Object.values(aggregatedQuantities || {}).sort(
    (a, b) => b.quantity - a.quantity
  );
});

const topSellingProductsChartOptions = computed(() => ({
  chart: {
    type: "bar",
    id: "topSellingProducts",
  },
  xaxis: {
    categories: topSellingProducts.value.map((product) => product.productName),
  },
}));

const topSellingProductsChartSeries = computed(() => [
  {
    name: "Quantity",
    data: topSellingProducts.value.map((product) => product.quantity),
  },
]);

const productsBelowThreshold = computed(() => {
  return products.value
    .filter((product) => product.stock < threshold.value)
    .sort((a, b) => a.stock - b.stock)
    .map((product) => ({
      id: product._id,
      name: product.name,
      stock: product.stock,
    }));
});

const averageSpentPerTransaction = computed(() =>
  sales.value.length > 0 ? totalSales.value / sales.value.length : 0
);

onMounted(() => {
  fetchSalesData();
  fetchProducts();
  fetchSales();
});
</script>

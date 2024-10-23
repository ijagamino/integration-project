<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-6 row q-col-gutter-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">
                Total sales: {{ formatCurrency(totalSales) }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales by Category</div>
              <div class="text-subtitle">
                {{
                  salesByCategory !== "Not Available"
                    ? formatCurrency(salesByCategory)
                    : salesByCategory
                }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
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
const salesByCategory = ref("Not Available");
const averageSpentPerTransaction = ref(0);
const transactionChartOptions = ref({
  chart: {
    type: "line",
    id: "transaction",
  },
  xaxis: {
    categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
});

const transactionChartSeries = ref([
  {
    name: "Sales",
    data: [],
  },
]);

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

onMounted(() => {
  fetchSalesData();
});
</script>

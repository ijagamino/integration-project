<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-6 row q-col-gutter-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">Total sales: {{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales by Category</div>
              <!-- kuya vincent pa change na lang po dito =) -->
              <div class="text-subtitle">{{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Average Spent per Transaction</div>
              <!-- kuya vincent pa change na lang po dito =) -->
              <div class="text-subtitle">{{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Number of Transactions</div>
              <div class="text-subtitle">
                <!-- kuya vincent pa change na lang po dito =) -->
                Total sales during the past 7 days: {{ totalSales }}
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
              <div class="text-h6">products</div>
              <div class="text-subtitle">
                Total products: {{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Most Stock</div>
              <div class="text-subtitle">
                <!-- kuya vincent pachange na lang po dito =) -->
                Product Name: x{{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Most stock</div>
              <div class="text-subtitle">
                <!-- kuya vincent pachange na lang po dito =) -->
                Product Name: x{{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Total Value of Current Inventory</div>
              <div class="text-subtitle">
                <!-- kuya vincent pachange na lang po dito =) -->
                {{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ApexCharts from "apexcharts";

defineOptions({
  name: "DashboardPage",
});
const tab = ref("sales");
const totalSales = ref(69);
const totalProducts = ref(420);
const selectedTab = ref("daily");

const salesData = {
  daily: 500,
  weekly: 3500,
  monthly: 15000,
};

// Transaction Chart
const transactionChartOptions = ref({
  chart: {
    type: "line",
    id: "transaction",
  },
  xaxis: {
    categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
});

const transactionChartSeries = [
  {
    name: "series-1",
    // kuya vincent pachange na lang po dito =)
    // hardcoded kasi hard ang nagcode
    data: [30, 40, 45, 50, 49, 60, 70],
  },
];
</script>

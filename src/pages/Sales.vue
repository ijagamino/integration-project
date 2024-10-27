<template>
  <q-page class="q-pa-xl">
    <q-table :rows="salesRows" :columns="salesColumns" :loading="loading">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="saleID" :props="props">
            {{ props.row.saleID }}
          </q-td>
          <q-td key="date" :props="props">
            <div class="text-pre-wrap">{{ props.row.date }}</div>
          </q-td>
          <q-td key="productName" :props="props">
            {{ props.row.productName }}
          </q-td>
          <q-td key="quantity" :props="props">
            {{ props.row.quantity }}
          </q-td>
          <q-td key="totalAmount" :props="props">
            {{ formatCurrency(props.row.totalAmount) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-banner v-if="error" color="negative" class="q-mt-md">
      Failed to load sales data: {{ error }}
    </q-banner>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});

const { formatCurrency } = useFormatCurrency();
const salesRows = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchSales = async () => {
  loading.value = true;
  try {
    const response = await api.get("/salesdetails");
    salesRows.value = response.data.map((sale) => ({
      id: sale.id,
      saleID: sale.saleID,
      date: new Date(sale.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      productName: sale.productName,
      quantity: sale.quantity,
      totalAmount: sale.totalAmount,
    }));
  } catch (err) {
    console.error("Failed to fetch sales:", err);
    error.value = "Could not load sales data.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSales);

const salesColumns = [
  { name: "id", label: "ID", align: "left", field: "id" },
  { name: "saleID", label: "Sale ID", align: "left", field: "saleID" },
  { name: "date", label: "Date", align: "center", field: "date" },
  {
    name: "productName",
    label: "Product Name",
    align: "left",
    field: "productName",
  },
  { name: "quantity", label: "Quantity", align: "center", field: "quantity" },
  {
    name: "totalAmount",
    label: "Total Amount",
    align: "right",
    field: "totalAmount",
  },
];
</script>

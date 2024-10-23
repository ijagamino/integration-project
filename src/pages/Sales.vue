<template>
  <q-page class="q-pa-xl">
    <q-table :rows="salesRows" :columns="salesColumns">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="date" :props="props">
            <div class="text-pre-wrap">{{ props.row.date }}</div>
          </q-td>
          <q-td key="totalAmount" :props="props">
            {{ formatCurrency(props.row.totalAmount) }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});

const { formatCurrency } = useFormatCurrency();

const salesRows = [
  // kuya vincent pachange na lang po dito =)
  // hardcoded kasi hard ang nagcode
  { id: 1, date: "2024-10-17", totalAmount: 2000 },
  { id: 2, date: "2024-10-18", totalAmount: 3000 },
  { id: 3, date: "2024-10-20", totalAmount: 4000 },
];

const salesColumns = [
  { name: "id", label: "ID", align: "left", field: "id" },
  { name: "date", label: "Date", align: "center", field: "date" },
  {
    name: "totalAmount",
    label: "Total Amount",
    align: "right",
    field: "totalAmount",
  },
];
</script>

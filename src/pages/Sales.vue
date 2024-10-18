<template>
  <q-page class="q-pa-xl">
    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th class="text-left">ID</th>
          <th class="text-center">Date</th>
          <th class="text-center">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td class="text-left">{{ sale.id }}</td>
          <td class="text-center">
            {{ sale.date }}
          </td>
          <td class="text-center">
            {{ sale.amount }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});

const sales = [
  { id: 1, date: "2024-10-17", amount: 2000 },
  { id: 2, date: "2024-10-18", amount: 3000 },
  { id: 3, date: "2024-10-20", amount: 4000 },
];
</script>

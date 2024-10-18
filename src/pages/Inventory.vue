<template>
  <q-page class="q-pa-xl">
    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-center">Price</th>
          <th class="text-center">Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.name">
          <td class="text-left">{{ product.name }}</td>
          <td class="text-center">
            {{ product.price }}
            <q-popup-edit
              v-model.number="products.price"
              buttons
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </td>
          <td class="text-center">
            {{ product.stock }}
            <q-popup-edit
              v-model.number="products.stock"
              buttons
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model.number="scope.value"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
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

const products = [
  { name: "Tite ni xi", price: 10, stock: 8 },
  { name: "David tae", price: 20, stock: 2 },
  { name: "Torne utog", price: 40, stock: 5 },
  { name: "John Lloyd's Chicharon", price: 420, stock: 1 },
];
</script>

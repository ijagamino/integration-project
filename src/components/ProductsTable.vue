<template>
  <q-table
    title="List of Products"
    :rows="productsData"
    :columns="productColumns"
    row-key="_id"
    class="cursor-default"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="price" :props="props">
          {{ formatCurrency(props.row.price) }}
          <q-popup-edit
            v-slot="scope"
            v-model="props.row.price"
            title="Update price"
            buttons
            @save="updateProduct(props.row)"
            label-set="Save"
          >
            <q-input v-model="scope.value" type="number" dense autofocus />
          </q-popup-edit>
        </q-td>
        <q-td key="stock" :props="props">
          <div class="text-pre-wrap">{{ props.row.stock }}</div>
          <q-popup-edit
            v-slot="scope"
            v-model="props.row.stock"
            title="Update stock"
            buttons
            @save="updateProduct(props.row)"
            label-set="Save"
          >
            <q-input v-model="scope.value" type="number" dense autofocus />
          </q-popup-edit>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
const props = defineProps({
  productsData: Object,
  productColumns: Array,
});
</script>

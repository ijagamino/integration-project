<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-6">
        <h2>List of Products</h2>
        <q-table
          :rows="products"
          :columns="productColumns"
          row-key="_id"
          @row-click="selectProduct"
          class="cursor-pointer"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">{{ props.row.name }}</q-td>
          </template>
          <template v-slot:body-cell-stock="props">
            <q-td :props="props" :class="{ 'text-red': props.row.stock < 5 }">
              {{ props.row.stock }}
            </q-td>
          </template>
          <template v-slot:body-cell-price="props">
            <q-td :props="props">{{ formatCurrency(props.row.price) }}</q-td>
          </template>
        </q-table>
      </div>

      <div class="col-12 col-lg-6">
        <h2>Selected Products</h2>
        <q-table
          :rows="selectedProducts"
          :columns="selectedProductColumns"
          row-key="_id"
          class="cursor-default"
          @row-click="deselectProduct"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">{{ props.row.name }}</q-td>
          </template>
          <template v-slot:body-cell-price="props">
            <q-td :props="props">{{ formatCurrency(props.row.price) }}</q-td>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">{{ props.row.quantity }}</q-td>
          </template>
        </q-table>

        <q-separator />
        <div class="total">
          <h3>Total: {{ formatCurrency(totalAmount) }}</h3>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import api from "src/services/api";

defineOptions({
  name: "IndexPage",
});

const products = ref([]);
const selectedProducts = ref([]);

const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    products.value = response.data.map((product) => ({
      _id: product._id,
      name: product.name || "Unnamed Product",
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
    }));
    console.log("Products Data:", products.value);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

const selectProduct = (product) => {
  const itemInList = selectedProducts.value.find(
    (item) => item._id === product._id
  );

  if (itemInList) {
    if (itemInList.quantity < product.stock) {
      itemInList.quantity += 1;
    } else {
      console.warn("Cannot add more than available stock.");
    }
  } else {
    selectedProducts.value.push({
      _id: product._id,
      name: product.name || "Unknown",
      price: parseFloat(product.price) || 0,
      stock: parseInt(product.stock) || 0,
      quantity: 1,
    });
  }
};

const deselectProduct = (product) => {
  const index = selectedProducts.value.findIndex(
    (item) => item._id === product._id
  );
  if (index !== -1) {
    if (selectedProducts.value[index].quantity > 1) {
      selectedProducts.value[index].quantity -= 1;
    } else {
      selectedProducts.value.splice(index, 1);
    }
  }
};

// Product table columns configuration
const productColumns = [
  { name: "name", label: "Product Name", align: "left", field: "name" },
  { name: "stock", label: "Stock", align: "center", field: "stock" },
  { name: "price", label: "Price", align: "right", field: "price" },
];

// Selected product table columns configuration
const selectedProductColumns = [
  { name: "name", label: "Product Name", align: "left", field: "name" },
  { name: "price", label: "Price", align: "right", field: "price" },
  { name: "quantity", label: "Quantity", align: "center", field: "quantity" },
];

// Calculate the total amount for the selected products
const totalAmount = computed(() =>
  selectedProducts.value.reduce(
    (total, item) => total + (item.price * item.quantity || 0),
    0
  )
);

// Format currency as PHP
const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) {
    return "₱0.00";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(numericValue);
};

// Fetch products on component mount
onMounted(fetchProducts);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.text-red {
  color: red;
}

.total {
  margin-top: 20px;
}
</style>

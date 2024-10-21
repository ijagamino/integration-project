<template>
  <q-page class="q-pa-xl">
    <div class="q-mb-md text-right">
      <q-btn
        label="Add Product"
        color="primary"
        @click="showModal = true"
        dense
      />
    </div>

    <q-markup-table flat bordered>
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-center">Price</th>
          <th class="text-center">Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td class="text-left">{{ product.name }}</td>
          <td class="text-center">
            <q-popup-edit
              v-model="product.price"
              title="Edit Price"
              buttons
              v-slot="scope"
              @save="updateProduct(product)"
            >
              <q-input
                v-model.number="scope.value"
                type="number"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
            {{ formatCurrency(product.price) }}
          </td>
          <td class="text-center">
            <q-popup-edit
              v-model="product.stock"
              title="Edit Stock"
              buttons
              v-slot="scope"
              @save="updateProduct(product)"
            >
              <q-input
                v-model.number="scope.value"
                type="number"
                dense
                autofocus
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
            {{ product.stock }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Add New Product</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newProduct.name"
            label="Name"
            filled
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model.number="newProduct.price"
            type="number"
            label="Price"
            filled
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model.number="newProduct.stock"
            type="number"
            label="Stock"
            filled
            dense
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="showModal = false"
          />
          <q-btn flat label="Add" color="primary" @click="addProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "src/services/api";

defineOptions({
  name: "indexPage",
});

const products = ref([]);
const showModal = ref(false);
const newProduct = ref({ name: "", price: 0, stock: 0 });

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

const addProduct = async () => {
  if (
    newProduct.value.name &&
    newProduct.value.price > 0 &&
    newProduct.value.stock >= 0
  ) {
    try {
      const response = await api.post("/products", {
        ...newProduct.value,
        price: parseFloat(newProduct.value.price),
        stock: parseInt(newProduct.value.stock),
      });
      products.value.push(response.data);
      newProduct.value = { name: "", price: 0, stock: 0 };
      showModal.value = false;
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  }
};

const updateProduct = async (product) => {
  try {
    await api.put(`/products/${product._id}`, {
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
    });
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Failed to update product:", error);
  }
};

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

onMounted(fetchProducts);
</script>

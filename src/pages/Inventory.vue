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

    <q-table
      title="List of Products"
      :rows="products"
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
defineOptions({
  name: "indexPage",
});

const products = ref([]);
const showModal = ref(false);
const showUpdateModal = ref(false);
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
    const response = await api.put(`/products/${product._id}`, {
      name: product.name,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
    });
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Failed to update product:", error);
  }
};

const productColumns = [
  { name: "name", label: "Product Name", align: "left", field: "name" },
  { name: "price", label: "Price", align: "right", field: "price" },
  { name: "stock", label: "Stock", align: "center", field: "stock" },
];

const { formatCurrency } = useFormatCurrency();

onMounted(fetchProducts);
</script>

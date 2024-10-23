<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-6">
        <h2>List of Products</h2>
        <q-table
          :rows="products"
          :columns="productColumns"
          row-key="_id"
          class="cursor-pointer"
          @row-click="selectProduct"
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
          <template v-slot:body-cell-select="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                label="Select"
                @click.stop="selectProduct(props.row)"
                :disabled="props.row.stock <= 0"
              />
            </q-td>
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
            <q-td :props="props">
              <q-input
                v-model="props.row.quantity"
                type="number"
                min="1"
                @change="updateQuantity(props.row)"
              />
            </q-td>
          </template>
        </q-table>

        <q-separator />
        <div class="total">
          <h3>Total: {{ formatCurrency(totalAmount) }}</h3>
          <q-btn
            color="primary"
            label="Submit Sale"
            @click="submitSale"
            :disable="selectedProducts.length === 0"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});

const { formatCurrency } = useFormatCurrency();

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
      name: product.name,
      price: parseFloat(product.price),
      stock: parseInt(product.stock),
      quantity: 1,
    });
  }
};

const deselectProduct = (product) => {
  const index = selectedProducts.value.findIndex(
    (item) => item._id === product._id
  );
  if (index !== -1) {
    selectedProducts.value.splice(index, 1);
  }
};

const updateQuantity = (product) => {
  const itemInList = selectedProducts.value.find(
    (item) => item._id === product._id
  );

  if (itemInList && itemInList.quantity > itemInList.stock) {
    itemInList.quantity = itemInList.stock;
    console.warn("Quantity reset to available stock.");
  }
};

const productColumns = [
  { name: "name", label: "Product Name", align: "left", field: "name" },
  { name: "stock", label: "Stock", align: "center", field: "stock" },
  { name: "price", label: "Price", align: "right", field: "price" },
  { name: "select", label: "Select", align: "center", field: "select" },
];

const selectedProductColumns = [
  { name: "name", label: "Product Name", align: "left", field: "name" },
  { name: "price", label: "Price", align: "right", field: "price" },
  { name: "quantity", label: "Quantity", align: "center", field: "quantity" },
];

const totalAmount = computed(() =>
  selectedProducts.value.reduce(
    (total, item) => total + (item.price * item.quantity || 0),
    0
  )
);

const submitSale = async () => {
  try {
    if (selectedProducts.value.length === 0) {
      console.warn("No products selected");
      return;
    }

    const currentDate = new Date();
    const saleResponse = await api.post("/sales", {
      totalAmount: totalAmount.value,
      date: currentDate,
    });

    const saleId = saleResponse.data._id;

    const salesDetails = selectedProducts.value.map((product) => ({
      saleID: saleId,
      productID: product._id,
      quantity: product.quantity,
      total: product.price * product.quantity,
    }));

    await Promise.all(
      salesDetails.map((details) => api.post("/salesdetails", details))
    );

    console.log("Sale submitted successfully");

    selectedProducts.value = [];
  } catch (error) {
    console.error("Failed to submit sale:", error);
  }
};

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

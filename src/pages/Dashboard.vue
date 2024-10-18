<template>
  <q-page class="q-pa-xl">
    <div class="row q-col-gutter-xl">
      <div class="col-6 row q-col-gutter-md">
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
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">Total sales: {{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-6">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">Total sales: {{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">Sales</div>
              <div class="text-subtitle">Total sales: {{ totalSales }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="col-6 row q-col-gutter-md">
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
              <div class="text-h6">products</div>
              <div class="text-subtitle">
                Total products: {{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col">
          <q-card>
            <q-card-section>
              <div class="text-h6">products</div>
              <div class="text-subtitle">
                Total products: {{ totalProducts }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "DashboardPage",
});
const tab = ref("sales");
const totalSales = ref(69);
const totalProducts = ref(420);
</script>

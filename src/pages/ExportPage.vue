<template>
  <q-page class="q-pa-xl">
    <!-- export current inventory data to csv -->
    <div>
      <q-btn color="primary" icon="inventory" label="Inventory">
        <q-tooltip>Export current inventory data to CSV</q-tooltip>
      </q-btn>
    </div>
    <!-- export all sales data to csv -->
    <div class="q-mt-sm">
      <q-btn color="primary" icon="receipt" label="Sales">
        <q-tooltip>Export all sales data to CSV</q-tooltip>
      </q-btn>
    </div>
    <!-- export all sales details data to csv -->
    <div class="q-mt-sm">
      <!-- ewan ko bakit nasa kaliwa yung icon bahala ka na kuya vincent =) -->
      <q-btn color="primary" icon="point_of_sales" label="Sales Details">
        <q-tooltip>Export all sales details data to CSV</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<template>
  <q-page class="q-pa-xl">
    <!-- Export current inventory data to CSV -->
    <div>
      <q-btn
        color="primary"
        icon="inventory"
        label="Inventory"
        @click="exportInventoryToCSV"
      >
        <q-tooltip>Export current inventory data to CSV</q-tooltip>
      </q-btn>
    </div>
    <!-- Export all sales data to CSV -->
    <div class="q-mt-sm">
      <q-btn
        color="primary"
        icon="receipt"
        label="Sales"
        @click="exportSalesToCSV"
      >
        <q-tooltip>Export all sales data to CSV</q-tooltip>
      </q-btn>
    </div>
    <!-- Export all sales details data to CSV -->
    <div class="q-mt-sm">
      <q-btn
        color="primary"
        icon="point_of_sales"
        label="Sales Details"
        @click="exportSalesDetailsToCSV"
      >
        <q-tooltip>Export all sales details data to CSV</q-tooltip>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import api from 'src/services/api';

// Function to convert an array of objects to a CSV string
const convertToCSV = (data) => {
  const array = [Object.keys(data[0]), ...data.map((item) => Object.values(item))];
  return array.map((row) => row.join(',')).join('\n');
};

// Function to trigger a file download
const downloadCSV = (csvContent, fileName) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export inventory data to CSV
const exportInventoryToCSV = async () => {
  try {
    const response = await api.get('/inventory');
    const inventoryData = response.data;
    if (inventoryData.length > 0) {
      const csv = convertToCSV(inventoryData);
      downloadCSV(csv, 'inventory_data.csv');
    } else {
      console.error('No inventory data available for export.');
    }
  } catch (error) {
    console.error('Failed to fetch inventory data:', error);
  }
};

// Export sales data to CSV
const exportSalesToCSV = async () => {
  try {
    const response = await api.get('/sales');
    const salesData = response.data;
    if (salesData.length > 0) {
      const csv = convertToCSV(salesData);
      downloadCSV(csv, 'sales_data.csv');
    } else {
      console.error('No sales data available for export.');
    }
  } catch (error) {
    console.error('Failed to fetch sales data:', error);
  }
};

// Export sales details data to CSV
const exportSalesDetailsToCSV = async () => {
  try {
    const response = await api.get('/salesdetails');
    const salesDetailsData = response.data;
    if (salesDetailsData.length > 0) {
      const csv = convertToCSV(salesDetailsData);
      downloadCSV(csv, 'sales_details_data.csv');
    } else {
      console.error('No sales details data available for export.');
    }
  } catch (error) {
    console.error('Failed to fetch sales details data:', error);
  }
};
</script>

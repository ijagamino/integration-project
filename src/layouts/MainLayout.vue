<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="() => (leftDrawerOpen = !leftDrawerOpen)"
        />

        <q-toolbar-title>
          <q-item>
            <q-item-section thumbnail>
              <img alt="Quasar logo" src="~assets/logo.png" />
            </q-item-section>
            <q-item-section> Sales and Inventory System </q-item-section>
          </q-item>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" elevated>
      <q-list bordered>
        <q-item-label header>Quick Access Menu</q-item-label>
        <q-item
          v-for="drawerItem in drawerItems"
          :key="drawerItem.route"
          :to="{ name: drawerItem.route }"
          clickable
          exact
          v-ripple
        >
          <q-item-section avatar>
            <q-icon color="primary" :name="drawerItem.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ drawerItem.label }}</q-item-label>
            <q-item-label v-if="drawerItem.caption" caption>{{
              drawerItem.caption
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header>Miscellaneous</q-item-label>
        <q-item :to="{ name: 'export' }" clickable exact v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="import_export" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Export</q-item-label>
            <q-item-label caption>Export data from database</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-sticky position="bottom-right" :offset="[20, 20]">
        <q-btn
          :to="{ name: 'pos' }"
          round
          color="primary"
          icon="add"
          size="xl"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<script setup>
const drawerItems = [
  {
    route: "dashboard",
    label: "Dashboard",
    caption: "Overview",
    icon: "dashboard",
  },
  {
    route: "inventory",
    label: "Inventory",
    caption: "Manage product stocks",
    icon: "inventory",
  },
  { route: "sales", label: "Sales", caption: "Sales history", icon: "receipt" },
  {
    route: "pos",
    label: "Point of Sale",
    caption: "Add a sale",
    icon: "point_of_sale",
  },
];

const leftDrawerOpen = ref(false);
</script>

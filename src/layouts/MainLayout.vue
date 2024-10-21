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
        <q-item
          v-for="drawerItem in drawerItems"
          :key="drawerItem.route"
          :to="{ name: drawerItem.route }"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon color="primary" :name="drawerItem.icon" />
          </q-item-section>

          <q-item-section>{{ drawerItem.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
const drawerItems = [
  { route: "dashboard", label: "Dashboard", icon: "dashboard" },
  { route: "inventory", label: "Inventory", icon: "dashboard" },
  { route: "sales", label: "Sales", icon: "dashboard" },
  { route: "pos", label: "pos", icon: "dashboard" },
];

const leftDrawerOpen = ref(false);
</script>

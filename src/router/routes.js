const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("pages/Dashboard.vue"),
      },
      {
        path: "inventory",
        name: "inventory",
        component: () => import("pages/Inventory.vue"),
      },
      {
        path: "sales",
        name: "sales",
        component: () => import("pages/Sales.vue"),
      },
      {
        path: "pos",
        name: "pos",
        component: () => import("pages/Pos.vue"),
      },
      {
        path: "export",
        name: "export",
        component: () => import("pages/ExportPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

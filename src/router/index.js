import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Examples from "../views/examples/ExamplesView.vue";
import ActivityTypeIndex from "../views/activity-types/Index.vue";
import ActivityTypeEdit from "../views/activity-types/Edit.vue";
import ActivityTypeNew from "../views/activity-types/New.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/activity_types",
      name: "ActivityTypeIndex",
      component: ActivityTypeIndex
    },
    {
      path: "/activity_types/:id/edit",
      name: "ActivityTypeEdit",
      component: ActivityTypeEdit
    },
    {
      path: "/activity_types/new",
      name: "ActivityTypeNew",
      component: ActivityTypeNew
    },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

import OperationCondition from "@/uniqueComponents/OperationCondition.vue";

import Configurations from "../views/Configurations.vue";
import Dashboard from "../views/Dashboard.vue";
import SignIn from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import Trend from "../views/Trend.vue";

const routes:any = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/operation-condition",
    name: "OperationCondition",
    component: OperationCondition,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/trend",
    name: "Trend",
    component: Trend,
  },
  {
    path: "/configurations",
    name: "Configurations",
    component: Configurations,
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: SignUp,
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
  linkActiveClass: "active",
});

export default router;

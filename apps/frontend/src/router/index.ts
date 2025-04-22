import { createRouter, createWebHistory } from "vue-router";
import CustomDashboard from "../views/CustomDashboard.vue";
import Dashboard from "../views/Dashboard.vue";
import Trend from "../views/Trend.vue";
import Configurations from "../views/Configurations.vue";
import Billing from "../views/Billing.vue";
import RTL from "../views/Rtl.vue";
import Notifications from "../views/Notifications.vue";
import Profile from "../views/Profile.vue";
import SignIn from "../views/SignIn.vue";
import SignUp from "../views/SignUp.vue";

const routes:any = [
  {
    path: "/",
    name: "/",
    redirect: "/dashboard",
  },
  {
    path: "/custom-dashboard",
    name: "CustomDashboard",
    component: CustomDashboard,
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
    path: "/billing",
    name: "Billing",
    component: Billing,
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: Notifications,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
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

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Users from "../views/users/Users.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

export default router;

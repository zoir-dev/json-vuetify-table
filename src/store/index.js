import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import posts from "./modules/posts";
import users from "./modules/users";

export default new Vuex.Store({
  modules: {
    posts,
    users,
  },
});

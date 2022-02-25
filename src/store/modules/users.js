import axios from "@/plugins/axios";

const SET_USERS = "SET_USERS";
const DELETE_USER = "DELETE_USER";

const state = () => ({
  users: [],
  params: {},
  totalPages: 1,
});
const getters = {
  getUsers: (state) => state.users,
  getTotalPages: (state) => Math.ceil(state.totalPages / 10),
};
const mutations = {
  SET_PARAMS: (state, params) => {
    state.params = params;
  },
  CREATE_USER(state, user) {
    state.users.unshift(user);
  },
  [DELETE_USER](state, user) {
    const index = state.users.findIndex((u) => u.id === user.id);
    if (index > -1) {
      state.users.splice(index, 1);
    }
  },
  UPDATE_USER(state, user) {
    const index = state.users.findIndex((u) => u.id === user.id);
    if (index > -1) {
      state.users.splice(index, 1, user);
    }
  },
  [SET_USERS]: (state, users) => {
    state.users = users;
  },

  SET_TOTAL_PAGE: (state, pages) => {
    state.totalPages = pages;
  },
};
const actions = {
  async fetchUsers({ commit }, params) {
    try {
      const res = await axios.get("users", {
        params,
      });
      commit(SET_USERS, res.data);
      commit("SET_TOTAL_PAGE", +res.headers["x-total-count"] || 1);
      return Promise.resolve(res);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  async deleteUser({ commit }, user) {
    try {
      const { data } = await axios.delete(`users/${user.id}`, user);
      commit(DELETE_USER, user);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async createUser({ commit }, user) {
    try {
      const { data } = await axios.post("users", user);
      commit("CREATE_USER", data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateUser({ commit }, user) {
    try {
      const { data } = await axios.put(`users/${user.id}`, user);
      commit("UPDATE_USER", data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

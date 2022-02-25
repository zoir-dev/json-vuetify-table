import axios from "@/plugins/axios";

const SET_POSTS = "SET_POSTS";

const state = () => ({
  posts: [],
  params: {},
  totalPages: 1,
});

const getters = {
  getPosts: (state) => state.posts,
  getTotalPages: (state) => Math.ceil(state.totalPages / 10),
};

const mutations = {
  SET_PARAMS: (state, params) => {
    state.params = params;
  },
  CREATE_POST(state, post) {
    state.posts.unshift(post);
  },
  UPDATE_POST(state, post) {
    const index = state.posts.findIndex((p) => p.id === post.id);
    if (index > -1) {
      state.posts.splice(index, 1, post);
    }
  },
  DELETE_POST(state, post) {
    const index = state.posts.findIndex((p) => p.id === post.id);
    if (index > -1) {
      state.posts.splice(index, 1);
    }
  },
  SET_TOTAL_PAGE: (state, pages) => {
    state.totalPages = pages;
  },

  SET_POSTS: (state, posts) => {
    state.posts = posts;
  },
};
const actions = {
  async fetchPosts({ commit }, params) {
    try {
      const response = await axios.get("posts", {
        params,
      });
      commit(SET_POSTS, response.data);
      commit("SET_TOTAL_PAGE", +response.headers["x-total-count"] || 1);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  async createPost({ commit }, post) {
    try {
      const { data } = await axios.post("posts", post);
      commit("CREATE_POST", data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updatePost({ commit }, post) {
    try {
      const { data } = await axios.put(`posts/${post.id}`, post);
      commit("UPDATE_POST", data);
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deletePost({ commit }, post) {
    try {
      await axios.delete(`posts/${post.id}`, post);
      commit("DELETE_POST", post);
      return Promise.resolve(post);
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

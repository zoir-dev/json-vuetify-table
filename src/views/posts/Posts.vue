<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="posts"
          disable-pagination
          disable-filtering
          hide-default-footer
          :server-items-length="totalPages"
          :options.sync="options"
          no-data-text="Ma'lumotlar mavjud emas"
          :loading="loading"
          class="elevation-10 pa-2"
          multi-sort
        >
          <template #top>
            <v-card-title>
              <router-link to="/" class="pa-1 title-link">Posts</router-link>
              |
              <router-link to="/users" class="pa-1 title-link"
                >Users</router-link
              >
              <v-spacer />
              <v-text-field
                type="search"
                label="Search..."
                append-icon="mdi-magnify"
                v-model="search"
                outlined
                small
                color="purple"
                dense
                class="mt-7 mr-7 search-input"
                @keyup.enter="init"
              />
              <v-btn class="purple white--text" @click="openSidebar">
                Add button
              </v-btn>
            </v-card-title>
          </template>
          <template #footer>
            <v-pagination
              v-if="!loading && posts.length"
              v-model="options.page"
              :length="totalPages"
              :total-visible="7"
              color="purple"
              class="mt-4 mb-4"
            />
          </template>
          <template #item.body="{ item }">
            {{ item.body | filterBody }}
          </template>
          <template #item.actions="{ item }">
            <v-icon small class="mr-2" color="purple" @click="deletePost(item)">
              mdi-delete-outline
            </v-icon>
            <v-icon
              small
              class="ml-2"
              color="purple"
              @click="openSidebar(item)"
            >
              mdi-pencil-outline
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <posts-sidebar ref="sidebar" />
    </v-row>
  </v-container>
</template>

<script>
const headers = [
  {
    text: "ID",
    value: "id",
  },
  {
    text: "TITLE",
    value: "title",
  },
  {
    text: "BODY",
    value: "body",
  },
  {
    text: "USERID",
    value: "userId",
  },
  {
    text: "ACTIONS",
    value: "actions",
  },
];

import { mapGetters } from "vuex";
import postsSidebar from "./postsSidebar.vue";
export default {
  components: { postsSidebar },
  name: "Posts",
  data() {
    return {
      loading: false,
      options: {
        page: 1,
      },
      headers,
      search: "",
    };
  },
  filters: {
    filterBody(val) {
      if (val.length > 100) return val.slice(0, 100) + "....";
      return val;
    },
  },
  computed: {
    ...mapGetters({
      posts: "posts/getPosts",
      totalPages: "posts/getTotalPages",
    }),
  },
  watch: {
    "options.page": "init",
    "options.sortBy": {
      deep: true,
      handler: "init",
      immediate: false,
    },
    "options.sortDesc": {
      deep: true,
      handler: "init",
      immediate: false,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(force = false) {
      try {
        if (!force && this.posts.length) return;
        this.loading = true;
        await this.$store.dispatch("posts/fetchPosts", {
          _page: this.options.page,
          q: this.search,
          _sort: this.options.sortBy.join(","),
          _order: this.options.sortDesc
            .map((v) => (v ? "desc" : "asc"))
            .join(","),
        });
      } catch (error) {
        this.$toast.error(
          error.response?.data?.message || "Error occured while fetching posts"
        );
      } finally {
        this.loading = false;
      }
    },
    async deletePost(post) {
      try {
        await this.$store.dispatch("posts/deletePost", post);
        this.$toast.success("Post deleted successfully!");
      } catch (error) {
        this.$toast.error("Error occured while deleting the post");
      }
    },
    openSidebar(post = null) {
      this.$refs.sidebar.show(post);
    },
  },
};
</script>
<style>
.search-input {
  max-width: 300px;
}
.title-link {
  color: black !important;
}
.title-link:hover {
  color: purple !important;
}
.title-link.router-link-exact-active {
  color: purple !important;
}
</style>

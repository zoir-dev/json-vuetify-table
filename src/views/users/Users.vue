<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          disable-filtering
          disable-pagination
          :loading="loading"
          hide-default-footer
          :options.sync="options"
          no-data-text="Ma'lumotlar mavjud emas"
          class="elevation-10 pa-2"
          :items-per-page="10"
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
              v-if="!loading && users.length"
              v-model="options.page"
              :length="totalPages"
              :total-visible="7"
              color="purple"
              class="mt-4 mb-4"
            ></v-pagination>
          </template>
          <template #item.actions="{ item }">
            <v-icon small class="mr-2" color="purple" @click="deleteUser(item)">
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
      <users-sidebar ref="form" />
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import usersSidebar from "./usersSidebar";
const headers = [
  {
    text: "Id",
    value: "id",
  },
  {
    text: "Name",
    value: "name",
  },
  {
    text: "UserName",
    value: "username",
  },
  {
    text: "Email",
    value: "email",
  },

  {
    text: "Phone",
    value: "phone",
  },
  {
    text: "Website",
    value: "website",
  },
  {
    text: "Actions",
    value: "actions",
  },
];
export default {
  name: "Users",
  components: { usersSidebar },
  data() {
    return {
      headers,
      loading: false,
      options: {
        page: 1,
      },
      search: "",
    };
  },
  computed: {
    ...mapGetters({
      users: "users/getUsers",
      totalPages: "users/getTotalPages",
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
        if (!force && this.users.length) return;
        this.loading = true;
        await this.$store.dispatch("users/fetchUsers", {
          _page: this.options.page,
          q: this.search,
          _sort: this.options.sortBy.join(","),
          _order: this.options.sortDesc
            .map((v) => (v ? "desc" : "asc"))
            .join(","),
        });
      } catch (error) {
        this.$toast.error(
          error.res?.data?.message || "Error occured while fetching users"
        );
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(user) {
      try {
        await this.$store.dispatch("users/deleteUser", user);
        this.$toast.success("User deleted successfully!");
      } catch (error) {
        this.$toast.error("Error occured while deleting the user");
      }
    },
    openSidebar(user = null) {
      this.$refs.form.show(user);
    },
  },
};
</script>
<style>
.search-input {
  max-width: 300px !important;
}
</style>

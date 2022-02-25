<template>
  <v-navigation-drawer
    width="400"
    temporary
    app
    fixed
    right
    v-model="sidebar"
    :permanent="sidebar"
  >
    <v-card class="mx-4" elevation="0">
      <v-card-title> {{ title }} </v-card-title>
      <v-form ref="form">
        <v-text-field
          type="text"
          label="Name"
          v-model="editingUser.name"
          outlined
          dense
        />
        <v-text-field
          type="text"
          label="User Name"
          v-model="editingUser.username"
          outlined
          dense
        />
        <v-text-field
          type="email"
          label="Email"
          v-model="editingUser.email"
          outlined
          dense
        />
        <v-text-field
          label="Phone Number"
          v-model="editingUser.phone"
          outlined
          dense
        />
        <v-text-field
          type="text"
          label="Website"
          v-model="editingUser.website"
          outlined
          dense
        />
        <v-btn
          @click="$refs.form.validate() && save()"
          class="primary rounded mr-2"
          :disabled="!valid"
          >Save</v-btn
        >
        <v-btn link @click="close" class="error rounded ml-2">Cancel</v-btn>
      </v-form>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
const defaultUser = {
  id: null,
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
};
export default {
  data() {
    return {
      editingUser: { ...defaultUser },
      valid: true,
      sidebar: false,
      rules: {
        required: (val) => !!val || "This field is required",
      },
    };
  },
  computed: {
    title() {
      if (this.editingUser.id) return "Edit user";
      return "Create a new user";
    },
  },
  methods: {
    show(user) {
      this.$refs.form.resetValidation();
      this.editingUser = { ...defaultUser, ...user };
      this.sidebar = true;
    },
    save() {
      this.editingUser.id ? this.update() : this.create();
    },
    close() {
      this.sidebar = false;
    },
    async update() {
      try {
        await this.$store.dispatch("users/updateUser", this.editingUser);
        this.$toast.success("This post updated successfully");
        this.sidebar = false;
      } catch (error) {
        console.log(error);
        this.$toast.error("Error occured while editing the user!");
      }
    },
    async create() {
      try {
        await this.$store.dispatch("users/createUser", this.editingUser);
        this.$toast.success("Post created successfully");
        this.sidebar = false;
      } catch (error) {
        console.log(error);
        this.$toast.error("Error occured while editing a new user!");
      }
    },
  },
};
</script>

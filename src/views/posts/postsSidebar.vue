<template>
  <v-navigation-drawer
    width="400"
    v-model="sidebar"
    right
    temporary
    fixed
    app
    :permanent="sidebar"
  >
    <v-card class="mx-4" elevation="0">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="editingPost.userId"
          type="number"
          label="User id"
          outlined
          dense
          :rules="[rules.required]"
        >
        </v-text-field>
        <v-text-field
          v-model="editingPost.title"
          label="Title"
          outlined
          dense
          :rules="[rules.required]"
        >
        </v-text-field>
        <v-textarea
          v-model="editingPost.body"
          label="Body"
          outlined
          dense
          :rules="[rules.required]"
        >
        </v-textarea>
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
const defaultPost = {
  id: null,
  userId: null,
  title: "",
  body: "",
};

export default {
  name: "postsSidebar",
  data() {
    return {
      sidebar: false,
      editingPost: { ...defaultPost },
      valid: true,
      rules: {
        required: (val) => !!val || "This field is required",
      },
    };
  },
  computed: {
    title() {
      if (this.editingPost.id) return "Edit post";
      return "Create a new post";
    },
  },
  methods: {
    show(post) {
      this.$refs.form.resetValidation();
      this.editingPost = { ...defaultPost, ...post };
      this.sidebar = true;
    },
    save() {
      this.editingPost.id ? this.update() : this.create();
    },
    close() {
      this.sidebar = false;
    },
    async update() {
      try {
        await this.$store.dispatch("posts/updatePost", this.editingPost);
        this.$toast.success("This post updated successfully");
        this.sidebar = false;
      } catch (error) {
        console.log(error);
        this.$toast.error("Error occured while editing the post!");
      }
    },
    async create() {
      try {
        await this.$store.dispatch("posts/createPost", this.editingPost);
        this.$toast.success("Post created successfully");
        this.sidebar = false;
      } catch (error) {
        this.$toast.error("Error occured while editing a new post!");
      }
    },
  },
};
</script>

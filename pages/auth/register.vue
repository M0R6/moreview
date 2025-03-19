<script setup>
import { useHead } from "#imports";
import { inject } from "vue";

const toggleTheme = inject("toggleTheme");

useHead({
  title: "Register - Moreview",
  meta: [
    { name: "description", content: "Create an account on Moreview" },
    { name: "keywords", content: "Moreview, Register, Account" },
  ],
});

const showToast = inject("showToast");

definePageMeta({
  layout: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const name = ref("");
const email = ref("");
const photo = ref([]);
const password = ref("");
const notlp = ref("")

const form = ref(false);
const nameRules = [
  (value) => !!value || "Name is required",
  (value) => value.length >= 5 || "Name must be at least 5 characters",
  (value) => value.length <= 40 || "Name must be less than 40 characters",
];
const passwordRules = [
  (value) => !!value || "Password is required",
  (value) => value.length >= 8 || "Password must be at least 8 characters",
  (value) =>
    /[A-Z]/.test(value) ||
    "Password must contain at least one uppercase letter",
  (value) => /[0-9]/.test(value) || "Password must contain at least one number",
];
const emailRules = [
  (value) => !!value || "E-mail is required",
  (value) =>
    /.+@.+\..+/.test(value) || "E-mail must be valid. (Ex: moreview@mail.com)",
  (value) =>
    /^[a-zA-Z0-9@._-]+$/.test(value) ||
    "E-mail must not contain special characters",
];

const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const register = async () => {
    try {
        const photoBase64 = photo.value ? await convertFileToBase64(photo.value) : null;

        const { data, error } = await useFetch(`/api/auth/register`, {
            method: "POST",
            body: {
                name: name.value,
                email: email.value,
                notlp: notlp.value,
                photo: photoBase64,
                password: password.value,
            },
        });

        if (error.value) {
            showToast(error.value.statusMessage, "error");
            return;
        }

        showToast(data.value.message, "success");
        await navigateTo("/auth/login");
    } catch (error) {
        console.error("Error during registration:", error);
        showToast("Failed to register. Please try again.", "error");
    }
};

const showPassword = ref(false);
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="justify-center align-center d-none d-md-block"
        >
          <div class="d-flex justify-center align-center">
            <img
              src="~/assets/img/login.svg"
              alt="Regist illustration"
              style="max-width: 100%"
            />
          </div>
        </v-col>

        <v-col cols="12" md="6" class="py-0 d-flex justify-center align-center">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 12 : 3"
              rounded="lg"
              width="100%"
              height="100%"
              class="pa-12 align-content-center"
            >
              <v-card-title class="text-h5 text-wrap pa-0 font-weight-bold"
                >Create new account</v-card-title
              >
              <v-card-title class="text-h6 text-wrap mb-3 pa-0"
                >Please enter your details to create a new account</v-card-title
              >
              <v-form v-model="form" @submit.prevent="register">
                <v-text-field
                  variant="outlined"
                  v-model="name"
                  label="Name"
                  :rules="nameRules"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  v-model="email"
                  label="Email"
                  :rules="emailRules"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  v-model="notlp"
                  label="Nomor telepon"
                ></v-text-field>
                <v-text-field
                  variant="outlined"
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="passwordRules"
                >
                  <template #append-inner>
                    <v-icon class="cursor-pointer" @click="showPassword = !showPassword">
                      {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                  </template>
                </v-text-field>
                <v-file-input
                  variant="outlined"
                  v-model="photo"
                  label="Profile Picture"
                  accept="image/*"
                ></v-file-input>
                <v-btn
                  :disabled="!form"
                  type="submit"
                  color="primary"
                  block
                  class="mt-2"
                  >Register</v-btn
                >
              </v-form>
              <v-btn
                variant="text"
                block
                class="mt-2 text-none"
                to="/auth/login"
                nuxt
              >
                <span
                  >Already have an account?
                  <span class="font-weight-bold">Login</span></span
                >
              </v-btn>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <!-- <div class="d-flex align-center justify-center" style="height: 100vh">
        <v-hover v-slot="{ isHovering, props }">
            <v-card title="Create new account" theme="customDark" v-bind="props" :elevation="isHovering ? 24 : 6"
                rounded="xl" width="400" class="mx-auto pa-10">
                <v-form v-model="form" @submit.prevent="register">
                    <v-text-field v-model="name" label="name" :rules="[rules.required]"></v-text-field>

                    <v-text-field type="email" v-model="email" label="Email"
                        :rules="[rules.required, rules.email]"></v-text-field>

                    <v-text-field type="password" v-model="password" label="Password"
                        :rules="[rules.required]"></v-text-field>

                    <v-btn :disabled="!form" type="submit" color="primary" block class="mt-2">Register</v-btn>
                </v-form>
                <v-btn color="primary" block class="mt-2" to="/auth/login" nuxt>Sign in</v-btn>
            </v-card>
        </v-hover>
    </div> -->
</template>
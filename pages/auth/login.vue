<script setup>
import { useHead } from '#imports';

useHead({
title: 'Login - Moreview',
  meta: [
    { name: 'description', content: 'Login on Moreview' },
    { name: 'keywords', content: 'Moreview, Login, Signin, Account' },
  ]
});

const { signIn } = useAuth()
const showToast = inject('showToast')

definePageMeta({
  layout: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
})

const email = ref('')
const password = ref('')

const form = ref(false)
const passwordRules = [
  value => !!value || 'Password is required',
]
const emailRules = [
  value => !!value || 'E-mail is required',
  value => /.+@.+\..+/.test(value) || 'E-mail must be valid. (Ex: moreview@mail.com)',
]

const login = async (email, password) => {
  const response = await signIn('credentials', { redirect: false, email, password })

  if (response.error) {
    showToast(response.error, "error")
    return
  }

  // await navigateTo(useRelativeCallbackUrl(useRoute()).value)
  await navigateTo('/')
}
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh; background-color: #f5f5f5;">
    <v-container>
      <v-row>

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
              <v-card-title class="text-h5 text-wrap pa-0 font-weight-bold">Welcome back!</v-card-title>
              <v-card-title class="text-h6 text-wrap mb-3 pa-0">Please enter your credential details to log in</v-card-title>
              <v-form v-model="form" @submit.prevent="login(email, password)">
                <v-text-field
                  variant="outlined"
                  v-model="email"
                  label="E-mail"
                  :rules="emailRules"
                ></v-text-field>

                <v-text-field
                  variant="outlined"
                  type="password"
                  v-model="password"
                  label="Password"
                  :rules="passwordRules"
                ></v-text-field>

                <v-btn :disabled="!form" type="submit" color="primary" block="" class="d-flex mx-auto mt-2">
                  Sign In
                </v-btn>
              </v-form>
              <v-btn color="transparent" variant="text" block class="mt-2 text-none" to="/auth/register" nuxt>
                <span class="text-black">Don't have an account? <span class="font-weight-bold">Register</span></span>
              </v-btn>
              <v-btn color="transparent" append-icon="mdi-chevron-right" variant="text" block class="mt-2 text-none" to="/" nuxt>
                <span class="text-black">or continue as <span class="font-weight-bold">Anonymous</span></span>
              </v-btn>
            </v-card>
          </v-hover>
        </v-col>
        
        <v-col cols="12" md="6" class="justify-center align-center d-none d-md-block">
          <div class="d-flex justify-center align-center">
            <img src="~/assets/img/login.svg" alt="Login illustration" style="max-width: 100%;" />
          </div>
        </v-col>

      </v-row>
    </v-container>
  </div>
</template>
<script setup>
import router from "@/router"
import { plainAxiosInstance as axios } from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-register-illustration-dark-uex.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-register-illustration-light-uex.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { themeConfig } from '@themeConfig'
import {
  emailValidator,
  requiredValidator,
} from '@validators'
import { onBeforeMount } from "vue"

onBeforeMount(() => {
  checkSignedIn()
})

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)
const email = ref(localStorage.last_user_email)
const password = ref('')
const errorMessage = ref('')
function singin() {
  axios.post('/signin', { email: email.value, password: password.value })
    .then(response => signinSuccessful(response))
    .catch(error => signinFailed(error))
}

function signinSuccessful(response) {
  if (!response.data.csrf) {
    this.signinFailed(response)

    return
  }
  localStorage.csrf = response.data.csrf
  localStorage.user_id = response.data.user_id
  localStorage.last_user_email = email.value
  localStorage.signedIn = true
  router.push({ name: 'activities' })
}

function signinFailed(error) {
  errorMessage.value = error.response?.data?.error
  delete localStorage.csrf
  delete localStorage.user_id
  delete localStorage.signedIn
}

function checkSignedIn() {
  if (localStorage.signedIn) {
    router.push('/')
  }
}
</script>


<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <h5 class="text-h5 font-weight-semibold mb-1">
            Bienvenido a {{ themeConfig.app.title }}! 👋🏻
          </h5>
        </VCardText>
        <VCardText v-if="errorMessage">
          <VAlert
            color="error"
            variant="tonal"
          >
            <p class="text-caption mb-2">
              {{ errorMessage }}
            </p>
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Correo"
                  aria-label="Correo"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Contraseña"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex flex-row-reverse mt-2 mb-4">
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Has olvidado tu contraseña?
                  </a>
                </div>
                <VBtn
                  block
                  type="submit"
                  @click="singin"
                >
                  Iniciar Sesión
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>

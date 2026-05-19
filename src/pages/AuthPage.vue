<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { ref, onMounted } from 'vue'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRouter } from 'vue-router'
import { endpoints } from '$src/api/endpoints'
import FallingGlass from '$src/components/FallingGlass.vue'
import GoogleIcon from '$src/components/icons/GoogleIcon.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import AnimatedTabs2 from '$src/components/inputs/AnimatedTabs2.vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import { paths } from '$src/router'

const isLogin = ref(true)
const { executeRecaptcha } = useReCaptcha() ?? { executeRecaptcha: undefined }

const form = ref({
  email: '',
  password: '',
})

const router = useRouter()
const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const errors = ref({
  email: '',
  password: '',
})

const handleSubmit = async () => {

  const auth = isLogin.value ? endpoints.authLogin : endpoints.authRegister
  const recaptchaToken = await executeRecaptcha?.(isLogin.value ? 'login' : 'register') ?? ''
  
  const { data, error } = await auth({
    email: form.value.email,
    password: form.value.password,
    recaptcha_token: recaptchaToken,
  }).invoke()
  errors.value.email = (error?.errors as any)?.email.at(0) ?? ''
  errors.value.password = (error?.errors as any)?.password.at(0) ?? ''

  localStorage.setItem('token', data?.token ?? '')

  if (data?.token) {
    router.push(paths.diet)
    // window.location.href = paths.diet
  }
}

async function loginWithGoogle() {
  const recaptchaToken = await executeRecaptcha?.('google_login') ?? ''
  const { data, error } = await endpoints.authGoogleRedirect({ recaptcha_token: recaptchaToken }).invoke()
  if (data?.url) {
    window.location.href = data.url
  }
}

const authButtonIdx = ref(0)
</script>

<template>
  <header class="flex items-center justify-between bg-linear-to-r from-grad-start to-grad-end text-white py-3 px-4 sm:px-6 z-20 shrink-0">
    <div class="flex items-center gap-2 font-black text-xl">
      <LogoIcon />

      <div>FRM</div>
    </div>

    <AnimatedTabs2
      v-model="authButtonIdx"
      :items="[
        { title: 'Login', onClick: () => {authButtonIdx = 0; isLogin = true} },
        { title: 'Register', onClick: () => {authButtonIdx = 1; isLogin = false} },
      ]"
    />
  </header>

  <div class="flex bg-linear-to-r from-grad-start to-grad-end text-white flex-1 z-20 h-full overflow-hidden">
    <div class="flex-1 relative h-full overflow-hidden hidden md:block">
      <FallingGlass />
    </div>

    <div class="flex-1 overflow-y-auto h-full">
      <div class="min-h-full flex items-center justify-center p-6">
        <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl text-primary">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-extrabold">
              {{ isLogin ? 'Welcome back' : 'Create account' }}
            </h2>

            <p class="text-gray-500 text-sm mt-2 font-medium">
              {{ isLogin ? 'Enter your details to access your routine' : 'Sign up to kickstart your fitness journey' }}
            </p>
          </div>

          <form 
            v-auto-animate 
            class="flex flex-col gap-2" 
            @submit.prevent="handleSubmit"
          >
            <CustomInput
              v-model:value="form.email"
              label="Email"
              :error="errors.email"
              :force-label-active="true"
            />

            <CustomInput
              v-model:value="form.password"
              type="password"
              label="Password"
              :error="errors.password"
              :force-label-active="true"
            />

            <div
              v-if="isLogin"
              class="flex justify-end"
            >
              <button
                type="button"
                class="text-sm font-bold text-primary hover:text-secondary transition-colors px-2"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              class="w-full mt-2 bg-linear-to-r from-grad-start to-grad-end text-grad-text font-bold py-3 rounded-lg"
            >
              {{ isLogin ? 'Sign In' : 'Sign Up' }}
            </button>

            <!-- <div class="relative flex items-center py-2 mt-1">
            <div class="flex-grow border-t border-gray-200" />

            <span class="shrink-0 px-4 text-sm text-gray-400 font-medium">
              Or continue with
            </span>

            <div class="flex-grow border-t border-gray-200" />
          </div>

          <button
            type="button"
            class="flex items-center justify-center gap-3 w-full border border-gray-200 bg-white text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
            @click="loginWithGoogle"
          >
            <GoogleIcon class="w-5 h-5" />
            Google
          </button> -->

            <div class="text-center text-sm font-medium mt-4">
              <span class="text-gray-500">
                {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              </span>

              <button
                type="button"
                class="font-bold hover:text-secondary ml-1 transition-colors"
                @click="toggleMode"
              >
                {{ isLogin ? 'Register now' : 'Sign in instead' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

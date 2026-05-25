<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { useRouter } from 'vue-router'
import { endpoints } from '$src/api/endpoints'
import FallingGlass from '$src/components/FallingGlass.vue'
import GoogleIcon from '$src/components/icons/GoogleIcon.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import AnimatedTabs2 from '$src/components/inputs/AnimatedTabs2.vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import { paths } from '$src/router'
import { customToast } from '$src/utils/custom-toast'

const isLogin = ref(true)
const { executeRecaptcha } = useReCaptcha() ?? { executeRecaptcha: undefined }

const form = ref({
  email: '',
  password: '',
})

const router = useRouter()
const transitionName = ref('slide-right')

const setMode = (login: boolean) => {
  if (isLogin.value === login) return
  transitionName.value = login ? 'slide-right' : 'slide-left'
  isLogin.value = login
  authButtonIdx.value = login ? 0 : 1
}

const toggleMode = () => setMode(!isLogin.value)

const errors = ref({
  email: '',
  password: '',
})

const handleSubmit = async () => {

  const auth = isLogin.value ? endpoints.authLogin : endpoints.authRegister
  const recaptchaToken = await executeRecaptcha?.('auth') ?? ''
  
  const { data, error } = await auth({
    email: form.value.email,
    password: form.value.password,
    recaptcha_token: recaptchaToken,
  }).invoke()
  const _errors = error?.errors as (AuthRequest | undefined)
  errors.value.email = _errors?.email?.at(0) ?? ''
  errors.value.password = _errors?.password?.at(0) ?? ''
  _errors?.recaptcha_token && customToast.error('reCAPTCHA verification failed. Please try again.')

  localStorage.setItem('token', data?.token ?? '')
  localStorage.setItem('verified_at', data?.user.email_verified_at ?? '')

  if (data?.token) {
    if (data.user.email_verified_at) {
      router.push(paths.diet)
    }
    router.push(paths.verification)
  }
}

let googleAuthInterval: ReturnType<typeof setInterval> | undefined

async function loginWithGoogle() {
  if (googleAuthInterval) {
    clearInterval(googleAuthInterval)
  }

  const recaptchaToken = await executeRecaptcha?.('google_login') ?? ''
  const { data } = await endpoints.authGoogleRedirect({ recaptcha_token: recaptchaToken }).invoke()
  
  if (data?.url) {
    window.open(data.url, '_blank')

    if (data.session_id) {
      if (googleAuthInterval) {
        clearInterval(googleAuthInterval)
      }

      googleAuthInterval = setInterval(
        async () => {
          const { data: pendingData } = await endpoints.authGooglePending({ session_id: data.session_id }).invoke()
      
          if (pendingData?.token) {
            localStorage.setItem('token', pendingData.token)
            clearInterval(googleAuthInterval)
            router.push(paths.diet)
          }
          else if (pendingData?.message !== 'Pending') {
            clearInterval(googleAuthInterval)
          }
        }, 
        2000,
      )
    }
  }
}

onUnmounted(() => {
  if (googleAuthInterval) {
    clearInterval(googleAuthInterval)
  }
})

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
        { title: 'Login', onClick: () => setMode(true) },
        { title: 'Register', onClick: () => setMode(false) },
      ]"
    />
  </header>

  <div class="flex bg-linear-to-r from-grad-start to-grad-end text-white flex-1 z-20 h-full overflow-hidden">
    <div class="flex-1 relative h-full overflow-hidden hidden md:block">
      <FallingGlass />
    </div>

    <ScrollableTemplate class="flex-1 h-full">
      <div class="min-h-full flex flex-col items-center justify-center p-6 gap-6">
        <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl text-primary">
          <div class="mb-6 grid w-full relative overflow-hidden">
            <Transition
              :name="transitionName"
              mode="out-in"
            >
              <div
                v-if="isLogin"
                class="col-start-1 row-start-1 flex flex-col items-center text-center"
              >
                <h2 class="text-2xl font-extrabold">
                  Welcome back
                </h2>

                <p class="text-gray-500 text-sm mt-2 font-medium">
                  Enter your details to access your routine
                </p>
              </div>

              <div
                v-else
                class="col-start-1 row-start-1 flex flex-col items-center text-center"
              >
                <h2 class="text-2xl font-extrabold">
                  Create account
                </h2>

                <p class="text-gray-500 text-sm mt-2 font-medium">
                  Sign up to kickstart your fitness journey
                </p>
              </div>
            </Transition>
          </div>

          <form
            class="flex flex-col gap-2" 
            @submit.prevent="handleSubmit"
          >
            <CustomInput
              v-model:value="form.email"
              label="Email"
              placeholder="Enter your email"
              :error="errors.email"
              :force-label-active="true"
            />

            <CustomInput
              v-model:value="form.password" 
              type="password"
              label="Password"
              placeholder="Enter your password"
              :error="errors.password"
              :force-label-active="true"
            />

            <div
              class="grid w-full transition-[grid-template-rows] duration-300"
              :class="isLogin ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="flex justify-end overflow-hidden">
                <button
                  type="button"
                  class="text-sm font-bold text-primary hover:text-secondary duration-300 origin-center px-2"
                  :class="isLogin ? 'scale-100' : 'scale-0'"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div class="transition-transform duration-200">
              <button
                type="submit"
                class="w-full mt-2 bg-linear-to-r from-grad-start to-grad-end text-grad-text font-bold py-3 rounded-lg shadow-none hover:shadow-lg duration-500"
              >
                {{ isLogin ? 'Sign In' : 'Sign Up' }}
              </button>
            </div>

            <div class="relative flex items-center py-2 mt-1">
              <div class="grow border-t border-gray-200" />

              <span class="shrink-0 px-4 text-sm text-gray-400 font-medium">
                Or continue with
              </span>

              <div class="grow border-t border-gray-200" />
            </div>

            <button
              type="button"
              class="flex items-center justify-center gap-3 w-full border border-gray-200 bg-white text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              @click="loginWithGoogle"
            >
              <GoogleIcon class="w-5 h-5" />
              Google
            </button>

            <div class="grid w-full relative overflow-hidden mt-4">
              <Transition
                :name="transitionName"
                mode="out-in"
              >
                <div
                  v-if="isLogin"
                  class="col-start-1 row-start-1 flex justify-center text-sm font-medium"
                >
                  <div class="flex gap-1 sm:gap-0.5 flex-col sm:flex-row">
                    <span class="text-gray-500">
                      Don't have an account?
                    </span>

                    <button
                      type="button"
                      class="font-bold hover:text-secondary ml-1 transition-colors"
                      @click="toggleMode"
                    >
                      Register now
                    </button>
                  </div>
                </div>

                <div
                  v-else
                  class="col-start-1 row-start-1 flex justify-center text-sm font-medium"
                >
                  <span class="text-gray-500">
                    Already have an account?
                  </span>

                  <button
                    type="button"
                    class="font-bold hover:text-secondary ml-1 transition-colors"
                    @click="toggleMode"
                  >
                    Sign in instead
                  </button>
                </div>
              </Transition>
            </div>
          </form>
        </div>

        <div class="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 shadow-xl flex flex-col items-center gap-5">
          <p class="text-xs font-bold text-white/70 uppercase tracking-widest">
            Powered By
          </p>

          <div class="flex flex-col items-center justify-center w-full gap-3">
            <a
              href="https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb"
              target="_blank"
              class="group bg-black/10 scale-95 hover:scale-100 transition-all duration-200 ring-2 ring-white/20 hover:ring-white/40 rounded-xl py-6 w-full flex items-center justify-center gap-5"
            >
              <img
                src="https://camo.githubusercontent.com/e13d685af45f18f42cb07b36f1862677f69618f9a85ff9437f40bfeee8c1ad69/68747470733a2f2f63646e2e657865726369736564622e6465762f657865726369736564622f616e64726f69642d6368726f6d652d353132783531322e706e67"
                alt="exercisedb"
                class="size-12 rounded-2xl object-cover shadow-lg transition-transform group-hover:scale-105"
              >

              <div class="flex items-center">
                <span class="font-bold text-3xl tracking-tighter text-white drop-shadow-md leading-none transition-opacity">
                  Exercise<span class="opacity-80">
                    DB
                  </span>
                </span>
              </div>
            </a>
          </div>

          <div class="flex items-center justify-center gap-1.5 text-sm font-medium text-white/70">
            <span>from</span>

            <a
              href="https://rapidapi.com/user/justin-WFnsXH_t6"
              target="_blank"
              class="flex items-center hover:text-white transition-colors"
            >
              <span class="font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-tr from-gray-200 to-white">
                AscendAPI
              </span>
            </a>
          </div>
        </div>
      </div>
    </ScrollableTemplate>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { endpoints } from '$src/api/endpoints'
import FallingGlass from '$src/components/FallingGlass.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import { paths } from '$src/router'

const route = useRoute()
const router = useRouter()

const token = route.query.token as string

const verifyState = token ? endpoints.authVerify({ token }).use(undefined) : undefined

const isSuccess = computed(() => !!verifyState?.data)
const errorMessage = computed(() => verifyState?.error?.message ?? (!token ? 'Invalid verification link.' : 'Verification failed. The link might be expired or invalid.'))

const handleContinue = () => {
  if (isSuccess.value) {
    router.push(paths.diet)
  }
  else {
    router.push(paths.verification)
  }
}
</script>

<template>
  <header class="flex items-center justify-between bg-linear-to-r from-grad-start to-grad-end text-white py-3 px-4 sm:px-6 z-20 shrink-0">
    <div class="flex items-center gap-2 font-black text-xl">
      <LogoIcon />

      <div>FRM</div>
    </div>
  </header>

  <div class="flex bg-linear-to-r from-grad-start to-grad-end text-white flex-1 z-20 h-full overflow-hidden">
    <div class="flex-1 relative h-full overflow-hidden hidden md:block">
      <FallingGlass />
    </div>

    <ScrollableTemplate class="flex-1 h-full">
      <div class="min-h-full flex flex-col items-center justify-center p-6 gap-6">
        <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl text-primary">
          <div class="mb-6 grid w-full relative overflow-hidden">
            <div class="col-start-1 row-start-1 flex flex-col items-center text-center">
              <h2 class="text-2xl font-extrabold">
                Email Verification
              </h2>

              <p
                v-if="verifyState?.isLoading"
                class="text-gray-500 text-sm mt-2 font-medium"
              >
                Please wait while we verify your email address...
              </p>
              
              <div
                v-else-if="isSuccess"
                class="w-full mt-4 rounded-lg border-2 border-green-600 bg-green-50 p-4 text-sm font-medium text-green-700"
              >
                Your email has been successfully verified!
              </div>
              
              <div
                v-else
                class="w-full mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
              >
                {{ errorMessage }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4 transition-transform duration-200">
            <button
              v-if="!verifyState?.isLoading"
              type="button"
              class="w-full bg-linear-to-r from-grad-start to-grad-end text-grad-text font-bold py-3 rounded-lg shadow-none hover:shadow-lg duration-500"
              @click="handleContinue"
            >
              {{ isSuccess ? 'Continue to App' : 'Back to Verification' }}
            </button>
          </div>
        </div>
      </div>
    </ScrollableTemplate>
  </div>
</template>

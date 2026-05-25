<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { endpoints } from '$src/api/endpoints'
import FallingGlass from '$src/components/FallingGlass.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import { paths } from '$src/router'
import { customToast } from '$src/utils/custom-toast'

const router = useRouter()

const verificationState = endpoints.authEmailSendVerification({ url: `${window.location.origin}/verification/status` }).use(undefined)

let verificationInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  verificationInterval = setInterval(
    async () => {
      const { data } = await endpoints.getUser().invoke()

      if (data?.email_verified_at) {
        clearInterval(verificationInterval)
        customToast.success('Email verified successfully!')
        router.push(paths.diet)
      }
    }, 
    3000,
  )
})

onUnmounted(() => {
  if (verificationInterval) {
    clearInterval(verificationInterval)
  }
})

const handleResend = async () => {
  const { error } = await verificationState.execute()
  if (error) {
    customToast.error(error.message || 'Failed to send verification email.')
  }
  else {
    customToast.success('Verification email sent! Please check your inbox.')
  }
}

const handleLogout = async () => {
  await endpoints.authLogout().invoke()
  router.push(paths.auth)
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
                Verify Email
              </h2>

              <p class="text-gray-500 text-sm mt-2 font-medium">
                Please click the link sent to your email. We will automatically redirect you once verified.
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-4 transition-transform duration-200">
            <button
              type="button"
              class="w-full bg-linear-to-r from-grad-start to-grad-end text-grad-text font-bold py-3 rounded-lg shadow-none hover:shadow-lg duration-500 disabled:opacity-70"
              :disabled="verificationState.isLoading"
              @click="handleResend"
            >
              Resend verification email
            </button>

            <button
              type="button"
              class="w-full bg-white border border-gray-200 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70"
              @click="handleLogout"
            >
              Back to authorization
            </button>
          </div>
        </div>
      </div>
    </ScrollableTemplate>
  </div>
</template>

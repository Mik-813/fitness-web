<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import Header from '$src/components/HeaderComponent.vue'
import { paths } from '$src/router'

const isAuthenticated = ref(!!localStorage.getItem('token'))
const isVerified = ref(!!localStorage.getItem('verified_at'))
const isInScope = ref(false)

const isLogin = ref(true)

provide('isLogin', isLogin)

const route = useRoute()
watch(() => route.path, () => {
  isAuthenticated.value = !!localStorage.getItem('token')
  isVerified.value = !!localStorage.getItem('verified_at')
  isInScope.value = [paths.workout, paths.diet, paths.statistics].includes(route.path)
})
</script>

<template>
  <div class="flex flex-col h-dvh w-full overflow-hidden bg-main-bg">
    <Header v-if="isAuthenticated && isVerified && isInScope" />

    <router-view />
  </div>
  
  <Toaster />
</template>

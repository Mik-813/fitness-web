<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import Header from '$src/components/HeaderComponent.vue'

const isAuthenticated = ref(!!localStorage.getItem('token'))

const isLogin = ref(true)

provide('isLogin', isLogin)

const route = useRoute()
watch(() => route.path, () => {
  isAuthenticated.value = !!localStorage.getItem('token')
})
</script>

<template>
  <div class="flex flex-col h-screen w-full overflow-hidden bg-main-bg">
    <Header v-if="isAuthenticated" />

    <router-view />
  </div>
  
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import Header from '$src/components/HeaderComponent.vue'
</script>

<template>
  <div class="flex flex-col h-screen w-full overflow-hidden bg-main-bg">
    <Header />

    <router-view />
  </div>
  
  <Toaster />
</template>

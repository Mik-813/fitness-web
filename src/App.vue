<script setup lang="ts">
import Header from '$src/components/HeaderComponent.vue'
</script>

<template>
  <div class="flex flex-col h-screen w-full overflow-hidden">
    <Header />

    <router-view />
  </div>
</template>

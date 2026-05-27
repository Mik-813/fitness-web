<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="text-center py-12">
    <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
      {{ title }}
    </h2>

    <p class="text-gray-500">
      {{ subtitle }}
    </p>
  </div>
</template>

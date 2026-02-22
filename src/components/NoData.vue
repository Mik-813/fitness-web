<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="text-center py-12">
    <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-grad-start to-grad-end opacity-80 rounded-full flex items-center justify-center">
      <svg
        class="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>

    <h2 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
      {{ title }}
    </h2>

    <p class="text-gray-500">
      {{ subtitle }}
    </p>
  </div>
</template>

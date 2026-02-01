<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { ref, onMounted } from 'vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'

const osRef = ref<OverlayScrollbarsComponentRef | null>(null)
const isScrolling = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const onScroll = () => {
  isScrolling.value = true
  
  if (scrollTimeout) clearTimeout(scrollTimeout)
  
  scrollTimeout = setTimeout(
    () => {
      isScrolling.value = false
    }, 
    1000,
  )
}

onMounted(() => {
  const osInstance = osRef.value?.osInstance()
  if (osInstance) {
    const { viewport } = osInstance.elements()
    viewport.addEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <OverlayScrollbarsComponent
    ref="osRef"
    class="custom-os-behavior"
    :class="{ 'is-scrolling': isScrolling }"
  >
    <slot />
  </OverlayScrollbarsComponent>
</template>

<style>
.custom-os-behavior .os-scrollbar {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-os-behavior.is-scrolling .os-scrollbar, .custom-os-behavior .os-scrollbar:hover {
  opacity: .5;
}

.custom-os-behavior .os-scrollbar-handle{
  background: linear-gradient(180deg, var(--color-grad-end), var(--color-grad-start));
}
</style>

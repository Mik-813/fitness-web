<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { ref, onMounted, computed, PropType } from 'vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'

const props = defineProps<{ disableScroll?: boolean, }>()

const osRef = ref<OverlayScrollbarsComponentRef | null>(null)
const isScrolling = ref(false)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const osOptions = computed(() => {
  if (props.disableScroll) {
    return {
      overflow: {
        x: 'hidden',
        y: 'hidden', 
      },
    }
  }
  return {}
})

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
    :options="(osOptions as any)"
  >
    <slot />
  </OverlayScrollbarsComponent>
</template>

<style>
.custom-os-behavior .os-scrollbar {
  opacity: 0;
  transition: opacity 0.3s ease;
  overflow-anchor: none;
}

.custom-os-behavior.is-scrolling .os-scrollbar, 
.custom-os-behavior .os-scrollbar:hover {
  opacity: 1;
}

.custom-os-behavior .os-scrollbar-handle {
  background: var(--color-primary);
}

.custom-os-behavior [data-overlayscrollbars-viewport] {
  transition: none !important;
}

.custom-os-behavior [data-overlayscrollbars-padding] {
  transition: none !important;
}
</style>

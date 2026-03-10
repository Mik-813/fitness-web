<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate'
import { ref, watch } from 'vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import { currentDate } from '$src/states/date'

defineProps<{ hide?: boolean, }>()

const transitionName = ref('slide-up')

function slideLeft() {
  transitionName.value = 'slide-left'
}

function slideRight() {
  transitionName.value = 'slide-right'
}

watch(currentDate, (newDate, oldDate) => {
  if (newDate < oldDate) {
    slideRight()
  }
  else {
    slideLeft()
  }
})
</script>

<template>
  <div class="grid w-full relative overflow-hidden h-screen z-0">
    <Transition :name="transitionName">
      <div
        v-if="!hide"
        class="flex flex-col w-full h-full overflow-hidden relative col-start-1 row-start-1 bg-main-bg"
      >
        <ScrollableTemplate>
          <main
            v-auto-animate
            class="px-4 py-4 max-w-4xl mx-auto"
          >
            <slot />
          </main>
        </ScrollableTemplate>

        <slot name="overlay" />
      </div>
    </Transition>

    <slot name="controls" />
  </div>
</template>

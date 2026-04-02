<script setup lang="ts">
import PageLayout from '$src/components/templates/PageLayout.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'

defineProps<{
  hide?: boolean
  timerLimit?: number
}>()

const emit = defineEmits<(e: 'record', time: number) => void>()
</script>

<template>
  <div class="flex flex-col h-screen w-full relative overflow-hidden">
    <div class="z-10 shrink-0">
      <TimerComponent
        :limit="timerLimit"
        @record="(t) => emit('record', t)"
      />
    </div>

    <div class="flex-1 relative min-h-0">
      <PageLayout
        :hide="hide"
        class="h-full"
      >
        <slot />

        <template #overlay>
          <slot name="overlay" />
        </template>

        <template #controls>
          <slot name="controls" />
        </template>
      </PageLayout>
    </div>
  </div>
</template>

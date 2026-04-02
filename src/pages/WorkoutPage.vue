<script setup lang="ts">
import PageLayout from '$src/components/templates/PageLayout.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { customToast } from '$src/utils/custom-toast'

const handleRecord = (time: number) => {
  customToast.error(time.toString())
}
</script>

<template>
  <div class="flex flex-col h-screen w-full relative overflow-hidden">
    <div class="z-10 shrink-0">
      <TimerComponent
        :limit="20"
        @record="handleRecord"
      />
    </div>

    <PageLayout>
      <router-view />
    </PageLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SwitchButton from '$src/components/inputs/SwitchButton.vue'

interface ButtonItem {
  text: string
  icon: any
  onClick: () => void
}

defineProps<{ items: ButtonItem[], }>()
const activeIndex = ref(0)

const handleSelection = (index: number) => {
  activeIndex.value = index
}
</script>

<template>
  <div class="flex items-center gap-4 p-1 w-fit">
    <SwitchButton
      v-for="(item, index) in items"
      :key="index"
      :text="item.text"
      :icon="item.icon"
      :active="activeIndex === index"
      @click="handleSelection(index); item.onClick();"
    />
  </div>
</template>

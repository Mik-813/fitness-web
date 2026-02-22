<script setup lang="ts" generic="T">
import Fuse from 'fuse.js'
import { ref, computed, watch } from 'vue'
import Dropdown from '$src/components/reusable/DropdownComponent.vue' // Adjust path as needed
// Assuming you have a ListItem type defined globally or imported
// 1. Props & Emits
// In Svelte, 'onclick' and 'onremove' are passed as props (functions). 
// We keep that pattern here for strict compatibility, though Vue often uses emits.
const props = defineProps<{
  consumables: Consumable[]
  onClick?: (item: ListItem<T>) => void
  onRemove?: (item: ListItem<T>) => void
}>()

// 2. State
const isDropdownVisible = ref(false)
const value = ref('') // The search input text

// 3. Logic (Search)
// Instead of $effect to update a state, we use computed for derived state.
const filteredItems = computed(() => {
  const fuse = new Fuse(props.items, {
    keys: ['title'],
    threshold: 0.1,
  })

  return value.value 
    ? fuse.search(value.value).map((res) => res.item) 
    : props.items
})

// 4. Logic (Reset on close)
// Equivalent to the $effect(() => !isDropdownVisible && ...)
watch(isDropdownVisible, (visible) => {
  if (!visible) {
    value.value = ''
  }
})

// 5. Handling Click Outside
// Vue uses Custom Directives for actions like clickOutside. 
// You'll need a 'v-click-outside' directive. See the "Dependencies" section below.
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el == event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

<template>
  <div
    v-click-outside="() => (isDropdownVisible = false)"
    class="relative"
  >
    <input
      v-model="value"
      :placeholder="placeholder"
      class="w-full border-none rounded-md text-sm text-white bg-white/20 outline-none transition-all ring-0 placeholder:text-white/70 py-3 px-4"
      type="text"
      @click="isDropdownVisible = true"
    >

    <Dropdown
      v-model:visible="isDropdownVisible"
      :items="filteredItems"
      :onclick="onClick"
      :onremove="onRemove"
    >
      <template #empty="{ close }">
        <slot
          name="empty"
          :close="close"
          :value="value"
        />
      </template>
    </Dropdown>
  </div>
</template>

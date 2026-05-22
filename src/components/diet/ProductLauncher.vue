<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import Fuse from 'fuse.js'
import { ref, computed, watch, nextTick } from 'vue'
import MagnifierIcon from '$src/components/icons/MagnifierIcon.vue'
import PlusIcon from '$src/components/icons/PlusIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'

const props = defineProps<{
  weightedProducts: WeightedProduct[]
  consumables: Consumable[]
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [title: string]
  locate: [title: string]
  select: [item: WeightedProduct]
  remove: [item: WeightedProduct]
}>()

const disableHoverTransition = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const dropdownContainer = ref<HTMLElement | null>(null)

onClickOutside(dropdownContainer, () => {
  closeDropdown()
})

const availableProducts = computed(
  () => props.weightedProducts
    .filter(p => !props.consumables.some(
      c => c.title === p.title && c.weight_g === p.weight_g,
    ))
    .sort((a, b) => {
      const titleCompare = a.title.localeCompare(b.title)
      if (titleCompare !== 0) return titleCompare
      
      return (a.weight_g || 0) - (b.weight_g || 0)
    }),
)

const fuse = computed(() => new Fuse(availableProducts.value, {
  keys: ['title'],
  threshold: 0.1,
}))

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return availableProducts.value
  return fuse.value.search(searchQuery.value.trim()).map(result => result.item)
})

const exactConsumableMatch = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return false
  return props.consumables.some(c => c.title.toLowerCase() === query)
})

const showLocateButton = computed(() => exactConsumableMatch.value && filteredProducts.value.length === 0)

const showCreateButton = computed(() => !!searchQuery.value.trim() && !exactConsumableMatch.value)

const closeDropdown = () => {
  emit('close')
  searchQuery.value = ''
}

const handleItemClick = (item: WeightedProduct) => {
  emit('select', item)
  closeDropdown()
}

const handleRemove = (item: WeightedProduct) => {
  disableHoverTransition.value = true
  emit('remove', item)
  setTimeout(
    () => (disableHoverTransition.value = false), 
    100,
  )
}

const handleLocate = () => {
  emit('locate', searchQuery.value)
  closeDropdown()
}

const handleCreate = () => {
  emit('create', searchQuery.value)
  closeDropdown()
}

watch(
  () => props.visible,
  async (isVisible) => {
    if (isVisible) {
      await nextTick()
      searchInput.value?.focus()
    }
  },
  { immediate: true }
)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-start justify-center p-4"
    >
      <div 
        ref="dropdownContainer"
        class="bg-pane-bg rounded-lg flex flex-col w-full max-w-lg overflow-hidden mt-12 border-4 border-pane-bg"
      >
        <div class="p-1">
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Add products"
            class="text-primary py-2 px-3 w-full text-sm border-2 border-primary outline-none bg-transparent rounded-md"
            autofocus
          >
        </div>
        

        <button
          v-if="showCreateButton"
          class="flex gap-1 items-center px-1.5 p-1.5 hover:bg-primary/5 rounded-sm text-sm cursor-pointer w-full transition-colors"
          @click="handleCreate"
        >
          <div class="bg-linear-to-r from-grad-start to-grad-end rounded-md text-white p-1 mx-1">
            <plus-icon class-name="size-4 stroke-3" />
          </div>

          <span class="text-primary text-sm font-medium">
            Create new product
          </span>
        </button>

        <div
          v-if="filteredProducts.length" 
          class="px-2 pt-1"
        >
          <hr class="mx-auto border-t border-dashed border-primary m-0">
        </div>

        <div class="flex flex-col max-h-[60vh] overflow-y-auto">
          <div 
            v-for="(item, index) in filteredProducts" 
            :key="item.id || index"
            class="
              hover:pl-2 
              flex justify-between text-sm rounded-sm
              even:bg-primary/5
              text-primary
              odd:bg-transparent"
            :class="disableHoverTransition ? '' : 'duration-200 transition-[padding]'"
          >
            <button
              class="flex-1 px-4 py-2 cursor-pointer flex items-center justify-start text-left group"
              @click="handleItemClick(item)"
            >
              <div class="flex gap-2">
                {{ item.title }}
                <span
                  v-if="item.weight_g"
                  class="opacity-70 group-hover:opacity-90"
                >
                  {{ item.weight_g }}g
                </span>
              </div>
            </button>

            <button
              class="p-2 items-center group"
              @click.stop="handleRemove(item)"
            >
              <div
                class="
                flex content-center items-center justify-center rounded-full
                text-gray-300 group-hover:bg-red-400 group-hover:text-red-800
                aspect-square cursor-pointer duration-200 transition-colors ease-in-out
              "
              >
                <x-mark-icon class="w-4 h-4" />
              </div>
            </button>
          </div>

          <button
            v-if="showLocateButton"
            class="flex gap-0.5 items-center px-1 hover:bg-primary/5 rounded-sm text-sm cursor-pointer w-full text-primary transition-colors"
            @click="handleLocate"
          >
            <div class="p-1.5">
              <magnifier-icon class="size-7 stroke-[1.5]" />
            </div>

            <span class="text-sm font-medium">
              {{ searchQuery || "Locate untitled product" }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

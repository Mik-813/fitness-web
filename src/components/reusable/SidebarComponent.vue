<script setup lang="ts">
import { type Component } from 'vue'

type SidebarItem = Item<{
  className: string 
  Icon: Component
}>

const sidebarOpen = defineModel<boolean>('sidebarOpen', { default: false })
const props = withDefaults(
  defineProps<{ items?: SidebarItem[], }>(), 
  { items: () => [] },
)

const closeSidebar = () => {
  sidebarOpen.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') closeSidebar()
}
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
      v-if="sidebarOpen"
      class="fixed inset-0 bg-purple-200/50 backdrop-blur-sm z-40"
      role="button"
      tabindex="0"
      @click="closeSidebar"
      @keydown="handleKeydown"
    />
  </Transition>

  <div
    class="fixed top-0 left-full h-full w-80 max-w-[90vw] bg-gradient-to-b from-grad-start to-grad-end text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
    :class="[sidebarOpen ? '-translate-x-full' : 'translate-x-0']"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-bold">
          Menu
        </h2>

        <button
          class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          aria-label="Close menu"
          @click="closeSidebar"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <button
          v-for="(item, index) in props.items"
          :key="index"
          class="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95"
          @click="item.onClick"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
              :class="item.data.className"
            >
              <div class="bg-gradient-to-br from-white/40 to-white/10 w-full h-full p-2">
                <component :is="item.data.Icon" />
              </div>
            </div>

            <div class="flex-1">
              <div class="font-semibold">
                {{ item.title }}
              </div>

              <div class="text-sm text-white/70">
                {{ item.subtitle }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

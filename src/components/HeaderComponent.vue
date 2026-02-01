<script setup lang="ts">
import { type Component, ref } from 'vue'
import BoltIcon from '$src/components/icons/BoltIcon.vue'
import ExportIcon from '$src/components/icons/ExportIcon.vue'
import ImportIcon from '$src/components/icons/ImportIcon.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import PotionIcon from '$src/components/icons/PotionIcon.vue'
import SettingsIcon from '$src/components/icons/SettingsIcon.vue'
import StatsIcon from '$src/components/icons/StatsIcon.vue'
import ThreeLinesIcon from '$src/components/icons/ThreeLinesIcon.vue'
import SwitchButtonGroup from '$src/components/inputs/SwitchButtonGroup.vue'
import Modal from '$src/components/reusable/ModalWindow.vue'
import Settings from '$src/components/SettingsComponent.vue'
import Sidebar from '$src/components/SidebarComponent.vue'
import router, { routeNames } from '$src/router'
import { exportCSV, importCSV } from '$src/utils/service-CSV'

const buttons = [
  {
    text: 'Statistics',
    icon: StatsIcon,
    onClick: async () => router.push(routeNames.statistics), 
  },
  {
    text: 'Diet',
    icon: PotionIcon,
    onClick: async () => router.push(routeNames.diet), 
  },
  {
    text: 'Workout',
    icon: BoltIcon,
    onClick: async () => router.push(routeNames.workout), 
  },
]

type SidebarItem = Item<{
  className: string 
  Icon: Component
}>

const sidebarItems: SidebarItem[]= [
  {
    title: 'Import',
    subtitle: 'Import food data',
    data: {
      className: 'bg-blue-500', 
      Icon: ExportIcon,
    },
    onClick: () => importCSV,
  },
  {
    title: 'Export',
    subtitle: 'Export food data',
    data: {
      className: 'bg-green-500',
      Icon: ImportIcon,
    },
    onClick: () => exportCSV,
  },
  {
    title: 'Settings',
    subtitle: 'Configure application',
    data: {
      className: 'bg-orange-500',
      Icon: SettingsIcon,
    },
    onClick: () => {
      isSettingsOpen.value = true 
    },
  },
]

const isSidebarOpen = ref(false)
const isSettingsOpen = ref(false)
</script>

<template>
  <header class="flex bg-gradient-to-r from-grad-start to-grad-end text-white py-2 px-4">
    <div class="flex items-center gap-2 font-black">
      <LogoIcon />

      <div>FRM</div>
    </div>

    <div class="w-full flex-1" />

    <div class="flex items-center justify-between gap-4">
      <SwitchButtonGroup :items="buttons" />

      <button
        aria-label="Open menu"
        @click="isSidebarOpen = true"
      >
        <ThreeLinesIcon />
      </button>
    </div>

    <Sidebar
      v-model:sidebar-open="isSidebarOpen"
      :items="sidebarItems"
    />
  </header>
</template>

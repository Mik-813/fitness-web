<script setup lang="ts">
import { type Component, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoutIcon from './icons/LogoutIcon.vue'
import AnimatedTabs2 from './inputs/AnimatedTabs2.vue'
import { endpoints } from '$src/api/endpoints'
import DateSelector from '$src/components/DateSelector.vue'
import BoltIcon from '$src/components/icons/BoltIcon.vue'
import ExportIcon from '$src/components/icons/ExportIcon.vue'
import ImportIcon from '$src/components/icons/ImportIcon.vue'
import LogoIcon from '$src/components/icons/LogoIcon.vue'
import PotionIcon from '$src/components/icons/PotionIcon.vue'
import SettingsIcon from '$src/components/icons/SettingsIcon.vue'
import StatsIcon from '$src/components/icons/StatsIcon.vue'
import ThreeLinesIcon from '$src/components/icons/ThreeLinesIcon.vue'
import SwitchButtonGroup from '$src/components/inputs/SwitchButtonGroup.vue'
import Sidebar from '$src/components/reusable/SidebarComponent.vue'
import SettingsModal from '$src/components/settings/SettingsModal.vue'
import { paths } from '$src/router'
import { currentDate, dates } from '$src/states/date'
import { exportCSV, importCSV } from '$src/utils/service-CSV'
import { showModal } from '$src/utils/show-modal'


const router = useRouter()
async function getUser() {
  if (!localStorage.getItem('token')) {
    router.push(paths.auth)
    return
  }

  const { data, error } = await endpoints.getUser().invoke()

  if (error) {
    await endpoints.authLogout().invoke()
    router.push(paths.auth)
    return
  }

  if (!data?.email_verified_at) {
    router.push(paths.verification)
    return
  }
}
getUser()


const buttons = [
  // {
  //   text: 'Statistics',
  //   icon: StatsIcon,
  //   onClick: async () => router.push(paths.statistics), 
  // },
  {
    text: 'Diet',
    icon: PotionIcon,
    onClick: async () => router.push(paths.diet), 
  },
  {
    text: 'Workout',
    icon: BoltIcon,
    onClick: async () => router.push(paths.workout), 
  },
]

type SidebarItem = Item<{
  className: string 
  Icon: Component
}>

const sidebarItems: SidebarItem[]= [
  // {
  //   title: 'Import',
  //   subtitle: 'Import your data',
  //   data: {
  //     className: 'bg-blue-500', 
  //     Icon: ExportIcon,
  //   },
  //   onClick: () => importCSV,
  // },
  // {
  //   title: 'Export',
  //   subtitle: 'Export your data',
  //   data: {
  //     className: 'bg-green-500',
  //     Icon: ImportIcon,
  //   },
  //   onClick: () => exportCSV,
  // },
  {
    title: 'Settings',
    subtitle: 'Configure application',
    data: {
      className: 'bg-orange-500',
      Icon: SettingsIcon,
    },
    onClick: () => showModal(SettingsModal),
  },
  {
    title: 'Logout',
    subtitle: 'Logout from the application',
    data: {
      className: 'bg-white/10',
      Icon: LogoutIcon,
    },
    onClick: async () => {
      await endpoints.authLogout().invoke()
      window.location.reload()
    },
  },
]

const isSidebarOpen = ref(false)

function getRouteIndex() {
  const _route = window.location.pathname
  if (_route === paths.diet) return 0
  if (_route === paths.workout) return 1
  return 0
}
</script>

<template>
  <header class="flex bg-linear-to-r from-grad-start to-grad-end text-white py-2 px-4">
    <div class="flex items-center gap-2 font-black">
      <LogoIcon />

      <div>FRM</div>
    </div>

    <DateSelector
      v-model="currentDate"
      class="hidden sm:flex"
      :available-dates="dates"
    />

    <div class="w-full flex-1" />

    <div class="flex items-center justify-between gap-4">
      <SwitchButtonGroup
        :items="buttons"
        :default-index="getRouteIndex()"
      />

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

  <div class="flex sm:hidden bg-linear-to-r from-grad-start to-grad-end opacity-85 py-1 text-white sm:px-4">
    <DateSelector
      v-model="currentDate"
      :available-dates="dates"
    />
  </div>
</template>

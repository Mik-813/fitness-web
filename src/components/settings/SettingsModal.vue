<script setup lang="ts">
import { type Component, computed, inject } from 'vue'
import { endpoints } from '$src/api/endpoints'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'
import BooleanSetting from '$src/components/settings/BooleanSetting.vue'
import MultiChoiceSetting from '$src/components/settings/MultiChoiceSetting.vue'
import { customToast } from '$src/utils/custom-toast'

const settings = inject<any>('settings')

function mutateSettings(prop: Partial<Settings>) {
  settings.mutate({
    data: {
      ...settings?.data,
      ...prop,
    },
    request: endpoints.updateSettings(settings?.data).invoke,
    onError: () => {
      customToast.error('Couldn\'t update settings')
    },
  })
}

type SettingView = 
  | {
    component: Component
    title: string
    subtitle: string
    initialState?: boolean
    onToggled: (isActive: boolean) => void
  }
  | {
    component: Component
    title: string
    subtitle: string
    items: Item[]
    initialIndex?: number
    onSelect?: (item: Item) => void 
  }

const settingsView = computed<SettingView[]>(() => [
  // {
  //   component: MultiChoiceSetting,
  //   title: 'Products title conflict',
  //   subtitle: 'Default behaviour for handling conflicting product titles',
  //   initialIndex: { 'always_ask': 0, 'always_fetch': 1, 'always_override': 2 }[settings?.data.products_title_conflict_behaviour],
  //   items: [
  //     {
  //       title: 'Ask every time',
  //       onClick: () => mutateSettings({ products_title_conflict_behaviour: 'always_ask' }), 
  //     },
  //     {
  //       title: 'Use existing product',
  //       onClick: () => mutateSettings({ products_title_conflict_behaviour: 'always_fetch' }), 
  //     },
  //     {
  //       title: 'Override the product',
  //       onClick: () => mutateSettings({ products_title_conflict_behaviour: 'always_override' }), 
  //     },
  //   ],
  // },
  {
    component: BooleanSetting,
    title: 'Calories',
    subtitle: 'Measure calories',
    initialState: settings?.data.kcal_100g,
    onToggled: (isActive) => mutateSettings({ kcal_100g: isActive }),
  },
  {
    component: BooleanSetting,
    title: 'Carbohydrates',
    subtitle: 'Measure carbohydrates',
    initialState: settings?.data.carbs_100g,
    onToggled: (isActive) => mutateSettings({ carbs_100g: isActive }),
  },
  {
    component: BooleanSetting,
    title: 'Protein',
    subtitle: 'Measure protein',
    initialState: settings?.data.protein_100g,
    onToggled: (isActive) => mutateSettings({ protein_100g: isActive }),
  },
  {
    component: BooleanSetting,
    title: 'Fat',
    subtitle: 'Measure fat',
    initialState: settings?.data.fat_100g,
    onToggled: (isActive) => mutateSettings({ fat_100g: isActive }),
  },
  {
    component: BooleanSetting,
    title: 'Sugar',
    subtitle: 'Measure sugar',
    initialState: settings?.data.sugar_100g,
    onToggled: (isActive) => mutateSettings({ sugar_100g: isActive }),
  },
  {
    component: BooleanSetting,
    title: 'Fiber',
    subtitle: 'Measure fiber',
    initialState: settings?.data.fiber_100g,
    onToggled: (isActive) => mutateSettings({ fiber_100g: isActive }),
  },
])
</script>

<template>
  <ModalWindow title="Settings">
    <div class="flex flex-col gap-4 px-1.5 py-2">
      <component
        :is="setting.component"
        v-for="(setting, index) in settingsView"
        :key="index"
        v-bind="setting"
      />
    </div>
  </ModalWindow>
</template>

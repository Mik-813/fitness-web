<script setup lang="ts">
import { computed } from 'vue'
import type MultiChoiceSetting from '$src/components/settings/MultiChoiceSetting.vue'
import { endpoints } from '$src/api/endpoints'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'
import BooleanSetting from '$src/components/settings/BooleanSetting.vue'
import InputSetting from '$src/components/settings/InputSetting.vue'
import { settings } from '$src/states/state'
import { customToast } from '$src/utils/custom-toast'

function mutateSettings(prop: Partial<Settings>) {
  settings.value.mutate({
    data: {
      ...settings.value.data,
      ...prop,
    },
    request: endpoints.updateSettings(prop).invoke,
    onError: () => {
      customToast.error('Couldn\'t update settings')
    },
  })
}

interface BooleanSettingView {
  component: typeof BooleanSetting
  title: string
  subtitle: string
  state?: boolean
  onToggle: (active: boolean) => void
}

interface MultiChoiceSettingView {
  component: typeof MultiChoiceSetting
  title: string
  subtitle: string
  state: number
  items: Item[]
}

interface InputSettingView {
  component: typeof InputSetting
  title: string
  subtitle: string
  state?: string | number
  placeholder?: string
  onChange?: (value: string) => void
}

type SettingView = BooleanSettingView | MultiChoiceSettingView | InputSettingView

const settingsView = computed<Array<SettingView>>(() => [
  // {
  //   component: MultiChoiceSetting,
  //   title: 'Language',
  //   subtitle: 'Set the preffered language used by the app',
  //   state: {
  //     'en': 0,
  //     'pl': 1,
  //     'ua': 2, 
  //   }[settings.value?.data?.language ?? 'en'],
  //   items: [
  //     {
  //       title: 'English',
  //       onClick: () => mutateSettings({ language: 'en' }), 
  //     },
  //     {
  //       title: 'Polska',
  //       onClick: () => mutateSettings({ language: 'pl' }), 
  //     },
  //     {
  //       title: 'Українська',
  //       onClick: () => mutateSettings({ language: 'ua' }), 
  //     },
  //   ],
  // },
  {
    component: BooleanSetting,
    title: 'Calories',
    subtitle: 'Measure calories',
    state: settings.value?.data?.kcal_100g,
    onToggle: (active) => mutateSettings({ kcal_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Carbohydrates',
    subtitle: 'Measure carbohydrates',
    state: settings.value?.data?.carbs_100g,
    onToggle: (active) => mutateSettings({ carbs_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Protein',
    subtitle: 'Measure protein',
    state: settings.value?.data?.protein_100g,
    onToggle: (active) => mutateSettings({ protein_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Fat',
    subtitle: 'Measure fat',
    state: settings.value?.data?.fat_100g,
    onToggle: (active) => mutateSettings({ fat_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Sugar',
    subtitle: 'Measure sugar',
    state: settings.value?.data?.sugar_100g,
    onToggle: (active) => mutateSettings({ sugar_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Fiber',
    subtitle: 'Measure fiber',
    state: settings.value?.data?.fiber_100g,
    onToggle: (active) => mutateSettings({ fiber_100g: active }),
  },
  {
    component: BooleanSetting,
    title: 'Auto timer',
    subtitle: 'Make the timer stop automatically, when editing a set',
    state: settings.value?.data?.auto_timer,
    onToggle: (active) => mutateSettings({ auto_timer: active }),
  },
  {
    component: InputSetting,
    placeholder: '0',
    title: 'Timer limit (seconds)',
    subtitle: 'Set the limit for the timer to display a deadline warning for rest (0 means no limit)',
    state: settings.value?.data?.rest_limit,
    onChange: (value: string) => mutateSettings({ rest_limit: Number(value) }),
  },
  // {
  //   component: BooleanSetting,
  //   title: 'Price',
  //   subtitle: 'Calculate price',
  //   state: settings.value?.data?.price,
  //   onToggle: (active) => mutateSettings({ price: active }),
  // },
  // {
  //   component: InputSetting,
  //   title: 'Currency',
  //   subtitle: 'Set currency used by the app',
  //   state: settings.value?.data?.currency_sign,
  //   onChange: (value: string) => mutateSettings({ currency_sign: value }),
  // },
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

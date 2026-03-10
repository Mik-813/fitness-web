<!-- eslint-disable @stylistic/object-property-newline -->
<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { computed, ref } from 'vue'
import { endpoints } from '$src/api/endpoints'
import Consumable from '$src/components/diet/ConsumableComponent.vue'
import ProductLauncher from '$src/components/diet/ProductLauncher.vue'
import Stats from '$src/components/diet/StatsComponent.vue'
import Plus from '$src/components/icons/PlusIcon.vue'
import TrashIcon from '$src/components/icons/TrashIcon.vue'
import NoData from '$src/components/NoData.vue'
import PageLayout from '$src/components/templates/PageLayout.vue'
import { currentDate } from '$src/states/date'
import { settings } from '$src/states/state'
import { customToast } from '$src/utils/custom-toast'
import { popIndentifiable } from '$src/utils/pop-indentifiable'

const consumables = computed(() => endpoints.getConsumables(currentDate.value).use(undefined))

const weightedProducts = endpoints.getWeightedProducts().use([])
const isProductLauncherOpen = ref(false)

async function tryRemoveConsumable(consumable: Consumable){
  if (!consumables.value.data) return
  consumables.value.mutate({
    data: popIndentifiable(consumable, consumables.value.data),
    request: endpoints.removeConsumable(consumable.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete product')
    },
    onSuccess: () => {
      weightedProducts.execute()
    },
  })
}

async function trySelectWeightedProduct(weightedProduct: WeightedProduct) { 
  if (!consumables.value.data) return
  const consumable = consumables.value.data.find(c => c.title === weightedProduct.title)
  if (consumable) {
    consumable.weight_g = weightedProduct.weight_g
    consumable.consumption_g = consumable.consumption_g < weightedProduct.weight_g 
      ? consumable.consumption_g
      : weightedProduct.weight_g
    scrollIntoConsumable(consumable.title)
    tryUpdateConsumable(consumable)
  }
  else {
    tryCreateConsumable(weightedProduct.title, weightedProduct)
  }
}


function tryUpdateConsumable(consumable: Consumable) {
  if (!consumables.value.data) return

  consumables.value.mutate({
    data: consumables.value.data.map(c => c.id === consumable.id ? consumable : c),
    request: endpoints.updateConsumable(consumable.id, consumable).invoke,
    onError: () => {
      customToast.error('Couldn\'t update product')
    },
  })
}

async function tryCreateConsumable(title: string, weightedProduct?: WeightedProduct) {
  if (!consumables.value.data) return
  
  consumables.value.mutate({
    request: endpoints.createConsumable({
      title,
      record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value,
      weight_g: weightedProduct?.weight_g,
    }).invoke,
    refetch: true,
    onError: () => {
      customToast.error('Couldn\'t create new product')
    },
  })
}

async function tryRereateConsumable(title: string, consumable: Consumable) {
  await endpoints.removeConsumable(consumable.id).invoke()
  tryCreateConsumable(title)
}

async function tryRemoveWeightedProduct(weightedProduct: WeightedProduct) {
  weightedProducts.mutate({
    data: popIndentifiable(weightedProduct, weightedProducts.data),
    request: endpoints.removeWeightedProduct(weightedProduct.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete product')
    },
  })
}

async function tryResetDate() {
  consumables.value.mutate({
    data: [],
    request: endpoints.removeDates({
      filter: 'consumables',
      record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value,
    }).invoke,
    onError: () => {
      customToast.error('Couldn\'t reset date')
    }, 
  })
}

function scrollIntoConsumable(title: string) {
  const element = document.querySelector(
    `[data-hot-product-title="${title}"]`,
  )!
  if (!element) return

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })

  element.classList.add('ring-3', 'ring-secondary', 'rounded-t-lg')
  setTimeout(
    () => element.classList.remove('ring-3', 'ring-secondary', 'rounded-t-lg'),
    1000,
  )
}

function updateWeightedTitles(title: string, oldTitle: string) {
   
  weightedProducts.mutate({
    data: weightedProducts.data.map(
      // eslint-disable-next-line @stylistic/object-property-newline
      obj => obj.title === oldTitle ? { ...obj, title } : obj,
    ), 
  })
}

const nutrientFieldsConfig = [
  { key: 'kcal_100g', title: 'Calories', unit: 'kcal', per: '100g' },
  { key: 'carbs_100g', title: 'Carbohydrates', unit: 'g', per: '100g' },
  { key: 'protein_100g', title: 'Protein', unit: 'g', per: '100g' },
  { key: 'fat_100g', title: 'Fat', unit: 'g', per: '100g' },
  { key: 'sugar_100g', title: 'Sugar', unit: 'g', per: '100g' },
  { key: 'fiber_100g', title: 'Fiber', unit: 'g', per: '100g' },
] as const

const filteredNutritionData = computed(() => nutrientFieldsConfig.filter(field => settings.data?.[field.key]))
</script>

<template>
  <div class="sticky top-0 z-30 bg-linear-to-r from-grad-start to-grad-end py-4 px-2 flex flex-col gap-4">
    <Stats
      :stats="filteredNutritionData.map(f => ({
        title: f.title,
        formula: (p: Product) => (p[f.key] ?? 0) / 100,
      }))"
      :consumables="consumables.data"
    />
  </div>

  <PageLayout :hide="consumables.data === undefined">
    <template v-if="consumables.data!.length > 0">
      <Consumable
        v-for="(consumable, idx) in consumables.data"
        :key="consumable.id"
        v-model="consumables.data![idx]"
        :consumables="consumables.data!"
        :weighted-products="weightedProducts.data"
        :nutrient-fields="filteredNutritionData"
        @title-update="updateWeightedTitles"
        @weights-update="weightedProducts.execute"
        @use-existing-product="tryRereateConsumable"
        @remove="tryRemoveConsumable"
      />
    </template>

    <NoData
      v-else
      title="No products added"
      subtitle="Add products to start tracking your nutritions"
    />

    <div class="h-30" />

    <template #overlay>
      <ProductLauncher
        :visible="isProductLauncherOpen"
        :weighted-products="weightedProducts.data"
        :consumables="consumables.data ?? []"
        @create="tryCreateConsumable"
        @select="trySelectWeightedProduct"
        @locate="scrollIntoConsumable"
        @remove="tryRemoveWeightedProduct"
        @close="()=> {isProductLauncherOpen=false; consumables.execute()}"
      />
    </template>
  
    <template #controls>
      <div class="fixed right-0 bottom-0 m-4">
        <div class="flex flex-col gap-2">
          <button
            class="flex gap-2 shadow-lg shadow-primary/40 bg-linear-to-r from-grad-start to-grad-end transition-transform duration-200 hover:-translate-x-1 text-grad-text p-4 rounded-lg font-bold items-center"
            @click="isProductLauncherOpen = true"
          >
            <Plus class="stroke-2" /> Add product
          </button>

          <button
            class="flex gap-2 shadow-lg shadow-red-600/40 bg-linear-to-r from-red-600 to-orange-600 transition-transform duration-200 hover:-translate-x-1 text-grad-text p-4 rounded-lg font-bold items-center"
            @click="tryResetDate"
          >
            <TrashIcon class="stroke-2" /> Reset date
          </button>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

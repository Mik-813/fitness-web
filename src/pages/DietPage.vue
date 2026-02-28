<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useDateFormat } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import * as endpoints from '$src/api/endpoints'
import DateSelector from '$src/components/DateSelector.vue'
import Consumable from '$src/components/diet/ConsumableComponent.vue'
import ProductLauncher from '$src/components/diet/ProductLauncher.vue'
import Stats from '$src/components/diet/StatsComponent.vue'
import Plus from '$src/components/icons/PlusIcon.vue'
import TrashIcon from '$src/components/icons/TrashIcon.vue'
import NoData from '$src/components/NoData.vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import { customToast } from '$src/utils/custom-toast'
import { popIndentifiable } from '$src/utils/pop-indentifiable'

function getDateFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const dateStr = urlParams.get('date')
  return dateStr ? new Date(dateStr) : undefined
}
const today = new Date(Date.now())
const currentDate = ref(getDateFromURL() ?? today)
const datesState = endpoints.getDatesRequest({ filter: 'consumables' }).use({})
const dates = computed(() => {
  const list = Object.keys(datesState.data).map(dateStr => new Date(dateStr))
  const hasToday = list.some(d => d.toDateString() === today.toDateString())
  const hasCurrentDate = list.some(d => d.toDateString() === currentDate.value.toDateString())
  if (!hasToday) list.push(today)
  if (currentDate.value.toDateString() != today.toDateString() && !hasCurrentDate)
    list.push(currentDate.value)
  return list
})
const consumables = computed(() => endpoints.getConsumablesRequest(currentDate.value).use(undefined))

const weightedProducts = computed(() => endpoints.getWeightedProductsRequest().use([]))
const isProductLauncherOpen = ref(false)

const transitionName = ref('slide-left')

function slideLeft() {
  transitionName.value = 'slide-left'
}

function slideRight() {
  transitionName.value = 'slide-right'
}

watch(currentDate, (newDate, oldDate) => {
  if (newDate < oldDate) {
    slideRight()
  }
  else {
    slideLeft()
  }
})

async function tryRemoveConsumable(consumable: Consumable){
  if (!consumables.value.data) return
  const success = await consumables.value.mutate(
    popIndentifiable(consumable, consumables.value.data),
    endpoints.removeConsumableRequest(consumable.id).invoke3,
  )

  if (!success) {
    customToast.error('Couldn\'t delete product')
  }
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


async function tryUpdateConsumable(consumable: Consumable) {
  if (!consumables.value.data) return

  const success = await consumables.value.mutate(
    consumables.value.data.map(c => c.id === consumable.id ? consumable : c),
    endpoints.updateConsumableRequest(consumable.id, consumable).invoke3,
  )

  if (!success) {
    customToast.error('Couldn\'t update product')
  }
}

async function tryCreateConsumable(title: string, weightedProduct?: WeightedProduct) {
  if (!consumables.value.data) return
  
  const consumable = {
    title,
    record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value,
    weight_g: 100,
    consumption_g: 0,
    ...weightedProduct,
  } as Consumable

  const success = await consumables.value.mutate(
    consumables.value.data.concat(consumable),
    endpoints.createConsumableRequest(consumable).invoke3,
    true,
  )

  if (!success) {
    customToast.error('Couldn\'t create new product')
  }
}

async function tryRemoveWeightedProduct(weightedProduct: WeightedProduct) {
  const success = await weightedProducts.value.mutate(
    popIndentifiable(weightedProduct, weightedProducts.value.data),
    endpoints.removeWeightedProductRequest(weightedProduct.id).invoke3,
  )

  if (!success) {
    customToast.error('Couldn\'t delete product')
  }
}

async function tryResetDate() {
  const success = await consumables.value.mutate(
    [],
    endpoints.removeDatesRequest({
      filter: 'consumables',
      record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value, 
    }).invoke3,
  )

  if (!success) {
    customToast.error('Couldn\'t reset date')
  }
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
</script>

<template>
  <div class="bg-linear-to-r from-grad-start to-grad-end">
    <DateSelector
      v-model="currentDate"
      :available-dates="dates"
    />
  </div>

  <div class="sticky top-0 z-30 -mt-4 bg-linear-to-r from-grad-start to-grad-end p-4 flex flex-col gap-4">
    <Stats
      :stats="[
        { title: 'Calories', formula: (p) => (p.kcal_100g ?? 0) / 100 },
        // { title: 'Carbs', formula: (p) => (p.carbs_100g ?? 0) / 100 },
        // { title: 'Protein', formula: (p) => (p.protein_100g ?? 0) / 100 },
        // { title: 'Fat', formula: (p) => (p.fat_100g ?? 0) / 100 },
        // { title: 'Sugar', formula: (p) => (p.sugar_100g ?? 0) / 100 },
        // { title: 'Fiber', formula: (p) => (p.fiber_100g ?? 0) / 100 }
      ]"
      :consumables="consumables.data"
    />
  </div>

  <div class="grid w-full relative overflow-hidden h-screen z-0">
    <Transition :name="transitionName">
      <div
        v-if="consumables.data !== undefined"
        :key="currentDate.toISOString()"
        class="flex flex-col w-full h-full overflow-hidden relative col-start-1 row-start-1 bg-main-bg"
      >
        <ScrollableTemplate :disable-scroll="isProductLauncherOpen">
          <main
            v-auto-animate
            class="px-4 py-8 max-w-4xl mx-auto"
          >
            <template v-if="consumables.data.length > 0">
              <div
                v-for="consumable in consumables.data ?? []"
                :key="consumable.id"
              >
                <Consumable
                  :consumable="consumable"
                  :consumables="consumables.data ?? []"
                  @remove="tryRemoveConsumable"
                />
              </div>
            </template>

            <NoData
              v-else
              title="No products provided"
              subtitle="Add some food items to start tracking your calories"
            />
          </main>

          <div class="h-30" />
        </ScrollableTemplate>

        <ProductLauncher
          :visible="isProductLauncherOpen"
          :weighted-products="weightedProducts.data"
          :consumables="consumables.data ?? []"
          @create="tryCreateConsumable"
          @select="trySelectWeightedProduct"
          @locate="scrollIntoConsumable"
          @remove="tryRemoveWeightedProduct"
          @close="isProductLauncherOpen=false"
        />
      </div>
    </Transition>
  </div>
  
  <div class="fixed right-0 bottom-0 m-4">
    <div class="flex flex-col gap-2">
      <button
        class="flex gap-2 bg-gradient-to-r from-grad-start to-grad-end hover:opacity-90 transition-opacity duration-200 text-grad-text p-4 rounded-lg font-bold items-center"
        @click="isProductLauncherOpen = true"
      >
        <Plus class="stroke-2" /> Add product
      </button>

      <button
        class="flex gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:opacity-90 transition-opacity duration-200 text-grad-text p-4 rounded-lg font-bold items-center"
        @click="tryResetDate"
      >
        <TrashIcon class="stroke-2" /> Reset date
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

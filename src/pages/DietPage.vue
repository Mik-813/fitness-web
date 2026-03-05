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

const transitionName = ref('slide-up')

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
  consumables.value.mutate({
    data: popIndentifiable(consumable, consumables.value.data),
    request: endpoints.removeConsumableRequest(consumable.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete product')
    },
    onSuccess: () => {
      weightedProducts.value.execute()
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
    request: endpoints.updateConsumableRequest(consumable.id, consumable).invoke,
    onError: () => {
      customToast.error('Couldn\'t update product')
    },
  })
}

async function tryCreateConsumable(title: string, weightedProduct?: WeightedProduct) {
  if (!consumables.value.data) return
  
  consumables.value.mutate({
    request: endpoints.createConsumableRequest({
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
  await endpoints.removeConsumableRequest(consumable.id).invoke()
  tryCreateConsumable(title)
}

async function tryRemoveWeightedProduct(weightedProduct: WeightedProduct) {
  weightedProducts.value.mutate({
    data: popIndentifiable(weightedProduct, weightedProducts.value.data),
    request: endpoints.removeWeightedProductRequest(weightedProduct.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete product')
    },
  })
}

async function tryResetDate() {
  consumables.value.mutate({
    data: [],
    request: endpoints.removeDatesRequest({
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
   
  weightedProducts.value.mutate({
    data: weightedProducts.value.data.map(
      // eslint-disable-next-line @stylistic/object-property-newline
      obj => obj.title === oldTitle ? { ...obj, title } : obj,
    ), 
  })
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
                v-for="(consumable, idx) in consumables.data ?? []"
                :key="consumable.id"
              >
                <Consumable
                  v-model="consumables.data[idx]"
                  :consumables="consumables.data"
                  :weighted-products="weightedProducts.data"
                  @title-update="updateWeightedTitles"
                  @weights-update="weightedProducts.execute"
                  @use-existing-product="tryRereateConsumable"
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
          @close="()=> {isProductLauncherOpen=false; consumables.execute()}"
        />
      </div>
    </Transition>
  
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

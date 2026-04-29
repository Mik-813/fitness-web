<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import millify from 'millify'
import { ref, onMounted, watch, computed } from 'vue'
import { endpoints } from '$src/api/endpoints'
import WeightModal from '$src/components/diet/WeightModal.vue'
import ChevronDown from '$src/components/icons/ChevronDownIcon.vue'
import PlusIcon from '$src/components/icons/PlusIcon.vue'
import SparkIcon from '$src/components/icons/SparkIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import Slider from '$src/components/reusable/SliderComponent.vue'
import ThrobberComponent from '$src/components/reusable/ThrobberComponent.vue'
import { settings } from '$src/states/state'
import { customToast } from '$src/utils/custom-toast'
import { isNumber } from '$src/utils/is-number'
import { showModal } from '$src/utils/show-modal'


const containerRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})

const props = defineProps<{
  consumables: Consumable[]
  weightedProducts: WeightedProduct[]
  nutrientFields: Array<{
    key: NutrientKey
    title: string
    unit: string
    per: string
  }>
  onUseExistingProduct: (title: string, consumable: Consumable) => void
  onWeightsUpdate: () => void
  onTitleUpdate: (title: string, oldTitle: string) => void
  onRemove: (consumable: Consumable) => void
}>()

const consumableModel = defineModel<Consumable>({ required: true })
const consumable = endpoints.getConsumable(consumableModel.value.id).use(consumableModel.value, false)
watch(() => consumable.data, (newValue) => {
  if (consumableModel.value !== newValue) {
    consumableModel.value = newValue
  }
})

watch(consumableModel, (newValue) => {
  if (consumable.data !== newValue) {
    consumable.data = newValue
  }
})

const nutrition = computed(() => endpoints.generateNutrition({
  title: consumable.data.title,
  features: props.nutrientFields.map(field => field.key),
}).use(undefined, false))

const computedNutritionLoading = computed(() => nutrition.value?.isLoading)


const isWrapped = ref(true)
const isNutriListOpen = ref(false)

const errors = ref<ConsumableError>({})

  
async function mutateConsumable(prop: Partial<Consumable>) {
  const newData = {
    ...consumable.data,
    ...prop,
  }
  return await consumable.mutate({
    data: newData,
    request: async () => {
      const res = await endpoints.updateConsumable(
        consumable.data.id,
        newData,
      ).invoke()
      if (res.error) {
        customToast.error(res.error.message)
        if (res.error.errors) {
          errors.value = res.error.errors
        }
      }
      return res
    }, 
    debounce: 500, 
  })
}

let tempTitle = consumable.data.title
async function handleTitleChange(value: string) {
  tempTitle = value
  errors.value.title = ''
  errors.value.needs_recreate = false

  if (value === consumable.data.title) return

  if (!value) {
    errors.value.title = 'Title cannot be empty'
    return
  }
  
  if (props.consumables.some(c => c.title === value && c.id !== consumable.data.id)) {
    errors.value.title = 'The product with this title was already added'
    return
  }

  if (props.weightedProducts.some(c => c.title === value)) {
    errors.value.title = `The product title conflicts with existing product "${value}"`
    errors.value.needs_recreate = true
    return
  }

  props.onTitleUpdate(value, consumable.data.title)
  mutateConsumable({ title: value })
}

function handleConsumptionChange(value: number) {
  mutateConsumable({ consumption_g: value })
}


function handleWeightChange(value: number) {
  props.onWeightsUpdate()
  errors.value.weight_g = ''
  if (value < consumable.data.consumption_g) {
    customToast.error('Weight can\'t be less than consumption')
    errors.value.weight_g = 'Weight can\'t be less than consumption'
    return
  }

  mutateConsumable({ weight_g: value })
}

function updateAddWeight(value: string): boolean {
  const weight = Number(value)
  if (!isNumber(weight)) {
    customToast.error('Weight should be a valid number')
    return false
  }
  props.onWeightsUpdate()
  errors.value.weights_g = ''
  if (consumable.data.weights_g.includes(weight)) {
    customToast.error('Weight already exists')
    return false
  }
  if (weight < 1) {
    customToast.error('Weight should be at least 1')
    return false
  }
  
  mutateConsumable({
    weights_g: [
      ...consumable.data.weights_g, 
      weight,
    ], 
  })
  return true
}

function showAddWeightModal() {
  const clean = showModal(
    WeightModal, 
    {
      onSubmit: (weight: number) => {
        if (updateAddWeight(weight.toString())) {
          clean()
        }
      },
    },
  )
}

function toggleWrapping() {
  isWrapped.value = !isWrapped.value
}

async function overrideExistingProduct() {
  const { error } = await endpoints.updateConsumable(
    consumable.data.id, 
    {
      ...consumable.data,
      override: true, 
    },
  ).invoke()

  if (error) {
    customToast.error('Couldn\'t override product')
  }
}

async function fetchNutrition() {
  if (!nutrition.value) return
  const res = await nutrition.value.execute()
  if (res.data) {
    mutateConsumable(res.data as Partial<Consumable>)
  }
  else {
    customToast.error('Couldn\'t fetch nutrition')
  }
}
</script>

<template>
  <div
    class="relative bg-linear-to-r from-grad-start to-grad-end rounded-xl ring-0 transition-shadow"
    :data-hot-product-title="consumable.data.title"
  >
    <div
      ref="containerRef"
      class="bg-white rounded-lg p-4 overflow-hidden"
    >
      <div class="flex items-center justify-between">
        <button
          class="text-gray-500 px-1"
          @click="toggleWrapping"
        >
          <div :style="{ rotate: isWrapped ? '-90deg' : '0deg', transition: 'rotate 0.2s' }">
            <ChevronDown class="size-5" />
          </div>
        </button>
        
        <span
          class="font-semibold"
          :class="consumable.data.title ? 'text-gray-800' : 'text-gray-400'"
        >
          {{ consumable.data.title || "(Empty title)" }}
        </span>

        <button
          class="text-gray-500 px-1"
          @click="onRemove(consumable.data)"
        >
          <XMarkIcon />
        </button>
      </div>

      <ul
        v-auto-animate
        class="flex flex-col gap-2"
      >
        <div class="pt-4" />
        
        <template v-if="!isWrapped">
          <div>
            <div class="flex gap-2 items-center">
              <div class="flex-1">
                <CustomInput
                  :value="consumable.data.title"
                  :error="errors.title"
                  label="Title"
                  type="text"
                  @input="handleTitleChange"
                />
              </div>

              <div class="pl-2 pr-1 ">
                <button
                  class="flex rounded-lg hover:scale-105 ring-2 ring-primary/10 hover:ring-primary/20 transition-all p-2"
                  title="Auto-fill nutrients"
                  :disabled="computedNutritionLoading"
                  @click="fetchNutrition"
                >
                  <ThrobberComponent
                    v-if="computedNutritionLoading"
                    class="w-6 h-6"
                  />

                  <SparkIcon
                    v-else
                    class="w-6 h-6"
                  />
                </button>
              </div>

              <span
                v-if="errors.needs_recreate"
                class="text-xs px-1"
              >
                You can either 
                <button
                  class="text-primary"
                  @click="() => onUseExistingProduct(tempTitle, consumable.data)"
                >
                  use existing product
                </button>
                or
                <button
                  class="text-primary"
                  @click="overrideExistingProduct"
                >
                  override the product
                </button>
              </span>
            </div>

            <template
              v-for="field in nutrientFields"
              :key="field.key"
            >
              <CustomInput
                v-if="settings.data?.[field.key]"
                :value="consumable.data[field.key]"
                :error="errors[field.key]"
                type="calculate"
                :label="`${field.title} (${field.unit}/${field.per})`"
                @input="(v) => isNumber(Number(v)) && mutateConsumable({ [field.key]: Number(v) })"
              />
            </template>

            <div
              v-auto-animate
              class="flex gap-2 pt-3 px-1"
            >
              <button
                v-for="weight, index in consumable.data.weights_g"
                :key="index"
                class="px-3 py-0.75 font-bold rounded-md w-fit text-sm"
                :class="weight===consumable.data.weight_g ? 'bg-secondary text-grad-text ring-2 ring-secondary ring-offset-2' : 'text-secondary bg-secondary/10'"
                @click="()=>handleWeightChange(weight)"
              >
                {{ `${weight}g` }}
              </button>

              <button
                class="px-2 py-0.75 font-bold rounded-md w-fit text-sm text-secondary bg-secondary/10 flex items-center justify-center"
                @click="showAddWeightModal"
              >
                <PlusIcon class-name="w-4 h-4 stroke-2" />
              </button>
            </div>

            <div class="mb-4" />
          </div>
        </template>

        <Slider
          :current-value="consumable.data.consumption_g"
          :max-value="consumable.data.weight_g"
          @current-value-change="handleConsumptionChange"
          @max-value-change="handleWeightChange"
        />
      </ul>
    </div>

    <div
      v-auto-animate
      class="flex flex-col items-center gap-1"
    >
      <template v-if="isNutriListOpen">
        <div 
          v-for="field in nutrientFields"
          :key="field.key"
          class="flex justify-between gap-1 items-center p-5 text-white bg-white/5 w-full"
        >
          <span class="font-semibold">
            {{ `${field.title} (${field.unit})` }}
          </span>

          <span class="text-sm">
            {{ millify(((consumable.data[field.key] ?? 0) * (consumable.data.consumption_g ?? 0)) / 100) }}
          </span>
        </div>
      </template>
      
      <div class="flex justify-center w-full">
        <button
          class="text-white p-2"
          @click="isNutriListOpen = !isNutriListOpen"
        >
          <div :style="{ rotate: isNutriListOpen ? '-180deg' : '0deg', transition: 'rotate 0.2s' }">
            <ChevronDown class="size-5 stroke-2" />
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

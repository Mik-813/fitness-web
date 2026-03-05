<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import millify from 'millify'
import { ref, onMounted, watch } from 'vue'
import * as endpoints from '$src/api/endpoints'
import CheckIcon from '$src/components/icons/CheckIcon.vue'
import ChevronDown from '$src/components/icons/ChevronDownIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import Slider from '$src/components/reusable/SliderComponent.vue'
import { customToast } from '$src/utils/custom-toast'


const containerRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})

const consumableModel = defineModel<Consumable>({ required: true })
const props = defineProps<{
  consumables: Consumable[]
  weightedProducts: WeightedProduct[]
  onUseExistingProduct: (title: string, consumable: Consumable) => void
  onWeightsUpdate: () => void
  onTitleUpdate: (title: string, oldTitle: string) => void
  onRemove: (consumable: Consumable) => void
}>()


const consumable = endpoints.getConsumableRequest(consumableModel.value.id).use(consumableModel.value, false)
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

const isWrapped = ref(true)
const isNutriListOpen = ref(false)

const addWeightQuery = ref('')

const errors = ref<ConsumableError>({})
  
async function mutateConsumable(prop: Partial<Consumable>) {
  return await consumable.mutate({
    data: {
      ...consumable.data,
      ...prop,
    },
    request: async () => {
      const res = await endpoints.updateConsumableRequest(
        consumable.data.id,
        consumable.data,
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


function handleKcalChange(value: string) {
  mutateConsumable({ kcal_100g: Number(value) })
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

function handleAddWeightChange(value: string) {
  props.onWeightsUpdate()
  addWeightQuery.value = value
  errors.value.weights_g = ''
  if (!value) return
  const weight = Number(value)
  if (consumable.data.weights_g.includes(weight)) {
    const errStr = 'Weight already exists'
    errors.value.weights_g = errStr
    return
  }
  if (weight < 1) {
    const errStr = 'Weight should be at least 1'
    errors.value.weights_g = errStr
    return
  }
}

function updateAddWeight() {
  mutateConsumable({
    weights_g: [
      ...consumable.data.weights_g, 
      Number(addWeightQuery.value),
    ], 
  })
  addWeightQuery.value = ''
}

function toggleWrapping() {
  isWrapped.value = !isWrapped.value
}

async function overrideExistingProduct() {
  const { error } = await endpoints.updateConsumableRequest(
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
</script>

<template>
  <div
    class="relative bg-linear-to-r from-grad-start to-grad-end rounded-xl ring-0 transition-all mb-4"
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

      <ul v-auto-animate>
        <div class="pt-4" />
        
        <template v-if="!isWrapped">
          <div>
            <CustomInput
              :value="consumable.data.title"
              :error="errors.title"
              label="Title"
              type="text"
              @input="handleTitleChange"
            />

            <span
              v-if="errors.needs_recreate "
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

          <CustomInput
            :value="consumable.data.kcal_100g"
            :error="errors.kcal_100g"
            type="calculate"
            label="Calories (kcal/100g)"
            @input="handleKcalChange"
          />
          
          <div class="flex w-full">
            <CustomInput
              :value="addWeightQuery"
              :error="errors.weights_g"
              class="w-full"
              type="calculate"
              label="Add weight (g)"
              @input="handleAddWeightChange"
              @enter-down="updateAddWeight"
            />
          

            <div
              v-if="!errors.weight_g && addWeightQuery"
              class="p-2 rounded"
            >
              <button
                class="bg-secondary rounded p-3"
                @click="updateAddWeight"
              >
                <CheckIcon class-name="text-grad-text size-5 stroke-2" />
              </button>
            </div>
          </div>

          <div class="flex gap-2 pt-3 px-1">
            <button
              v-for="weight, index in consumable.data.weights_g"
              :key="index"
              class="px-3 py-0.5 font-bold rounded w-fit text-sm"
              :class="weight===consumable.data.weight_g ? 'bg-secondary text-grad-text ring-2 ring-secondary ring-offset-2' : 'text-secondary bg-secondary/10'"
              @click="()=>handleWeightChange(weight)"
            >
              {{ `${weight}g` }}
            </button>
          </div>

          <div class="mb-4" />
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
      <div
        v-if="isNutriListOpen"
        class="flex flex-col items-center gap-1 p-4 pt-8 text-white bg-white/5 w-full"
      >
        <span class="font-semibold">
          Calories (kcal)
        </span>

        <span class="text-sm">
          {{ millify(((consumable.data.kcal_100g ?? 0) * (consumable.data.consumption_g ?? 0)) / 100) }}
        </span>
      </div>
      
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

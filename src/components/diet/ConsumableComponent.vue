<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import millify from 'millify'
import { ref, onMounted, watch } from 'vue'
import CheckIcon from '../icons/CheckIcon.vue'
import * as endpoints from '$src/api/endpoints'
import ChevronDown from '$src/components/icons/ChevronDownIcon.vue'
import XMarkIcon from '$src/components/icons/XMarkIcon.vue'
import CustomInput from '$src/components/inputs/CustomInput.vue'
import Slider from '$src/components/reusable/SliderComponent.vue'
import { customToast } from '$src/utils/custom-toast'
import { debounce } from '$src/utils/timers'

const props = defineProps<{
  consumable: Consumable
  onRemove: (consumable: Consumable) => void
}>()

const isWrapped = ref(true)
const isNutriListOpen = ref(false)

const containerRef = ref<HTMLDivElement | null>(null)

const consumable = ref(props.consumable)
watch(() => props.consumable, (value) => {
  consumable.value = value
})

const errors = ref<ConsumableError>({})

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }
})

function toggleWrapping() {
  isWrapped.value = !isWrapped.value
}

function handleTitleChange(title: string) {
  consumable.value.title = title
  debounceUpdateConsumable()
}

function handleConsumptionChange(value: number) {
  consumable.value.consumption_g = value
  debounceUpdateConsumable()
}

function handleWeightChange(weight: number) {
  errors.value.weight_g = ''
  if (weight < consumable.value.consumption_g) {
    customToast.error('Weight can\'t be less than consumption')
    errors.value.weight_g = 'Weight can\'t be less than consumption'
    return
  }
  consumable.value.weight_g = weight
  debounceUpdateConsumable()
}

const addWeightQuery = ref('')

function handleAddWeightChange(value: string) {
  addWeightQuery.value = value
  errors.value.weights_g = ''
  if (!value) return
  const weight = Number(value)
  if (consumable.value.weights_g.includes(weight)) {
    const errStr = 'Weight already exists'
    customToast.error(errStr)
    errors.value.weights_g = errStr
    return
  }
  if (weight < 1) {
    const errStr = 'Weight should be at least 1'
    customToast.error(errStr)
    errors.value.weights_g = errStr
    return
  }
}

function updateAddWeight() {
  consumable.value.weights_g.push(Number(addWeightQuery.value))
  debounceUpdateConsumable()
  addWeightQuery.value = ''
}

function handleKcalChange(value: string) {
  consumable.value.kcal_100g = Number(value)
  debounceUpdateConsumable()
}

const debounceUpdateConsumable = debounce(
  async () => {
    const { error } = await endpoints.updateConsumableRequest(
      consumable.value.id,
      consumable.value,
    ).invoke()
    if (error) {
      customToast.error(error.message)
      if (error.errors) {
        errors.value = error.errors
      }
    }
  }, 
  500,
)
</script>

<template>
  <div
    class="relative bg-gradient-to-r from-grad-start to-grad-end rounded-xl ring-0 transition-all mb-4"
    :data-hot-product-title="consumable.title"
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
          :class="consumable.title ? 'text-gray-800' : 'text-gray-400'"
        >
          {{ consumable.title || "(Empty title)" }}
        </span>

        <button
          class="text-gray-500 px-1"
          @click="onRemove(consumable)"
        >
          <XMarkIcon />
        </button>
      </div>

      <ul v-auto-animate>
        <div class="pt-4" />
        
        <template v-if="!isWrapped">
          <CustomInput
            :value="consumable.title"
            :error="errors.title"
            label="Title"
            @input="handleTitleChange"
          />

          <CustomInput
            :value="consumable.kcal_100g"
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

          <div class="text-sm text-primary font-bold">
            Weights
          </div>

          <div class="flex gap-2 pt-3 px-1">
            <button
              v-for="weight, index in consumable.weights_g"
              :key="index"
              class="px-3 py-0.5 font-bold rounded w-fit text-sm"
              :class="weight===consumable.weight_g ? 'bg-secondary text-grad-text ring-2 ring-secondary ring-offset-2' : 'text-secondary bg-secondary/10'"
              @click="()=>handleWeightChange(weight)"
            >
              {{ `${weight}g` }}
            </button>
          </div>

          <div class="mb-4" />
        </template>

        <Slider
          :current-value="consumable.consumption_g"
          :max-value="consumable.weight_g"
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
          {{ millify(((consumable.kcal_100g ?? 0) * (consumable.consumption_g ?? 0)) / 100) }}
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

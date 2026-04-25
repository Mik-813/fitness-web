<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import Fuse from 'fuse.js'
import { ref, computed, onMounted, watch } from 'vue'
import SortIcon from '../icons/SortIcon.vue'
import { edbApi } from '$src/api/endpoints'
import FilterIcon from '$src/components/icons/FilterIcon.vue'
import MagnifierIcon from '$src/components/icons/MagnifierIcon.vue'
import DropdownComponent from '$src/components/reusable/DropdownComponent.vue'
import ScrollableTemplate from '$src/components/templates/ScrollableTemplate.vue'
import ExerciseTags from '$src/components/workout/ExerciseTags.vue'

const props = defineProps<{
  exercises: Exercise[]
  visible: boolean
  onClose: () => void
  onLocate: (title: string) => void
  onSelect: (item: DbExercise) => void
}>()

const filters = ref<ExerciseFilters>({})
const dbExercises = computed(() => edbApi.getFilteredExericises(filters.value).use(undefined)) 

const cachedExercises = ref<DbExercise[]>([])

watch(
  () => dbExercises.value.data?.data,
  (newData) => {
    if (newData) {
      const newItems = newData.filter(
        (item) => !cachedExercises.value.some((cached) => cached.exerciseId === item.exerciseId),
      )
      if (newItems.length > 0) {
        cachedExercises.value = [...cachedExercises.value, ...newItems]
      }
    }
  },
  { immediate: true },
)

const fuse = computed(() => new Fuse(cachedExercises.value, {
  keys: ['name'],
  threshold: 0.1,
}))

const filteredExercises = computed(() => {
  if (!searchQuery.value.trim()) return cachedExercises.value
  return fuse.value.search(searchQuery.value.trim()).map(result => result.item)
})


const disableHoverTransition = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const dropdownContainer = ref<HTMLElement | null>(null)

onClickOutside(dropdownContainer, () => {
  closeDropdown()
})

const exactExerciseMatch = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return false
  return props.exercises.some(c => c.title.toLowerCase() === query)
})

const showLocateButton = computed(() => exactExerciseMatch.value && filteredExercises.value.length === 0)

const closeDropdown = () => {
  props.onClose()
  searchQuery.value = ''
}

const handleItemClick = (item: DbExercise) => {
  props.onSelect(item)
  closeDropdown()
}

const handleLocate = () => {
  props.onLocate(searchQuery.value)
  closeDropdown()
}

function onSearchQueryChange() {
  filters.value.search = searchQuery.value.trim()
}

onMounted(() => {
  searchInput.value?.focus()
})

const tagsCache = new WeakMap<DbExercise, string[]>()

function getTags(item: DbExercise) {
  if (tagsCache.has(item)) {
    return tagsCache.get(item)!
  }

  const { 
    targetMuscles,
    bodyParts,
    equipments,
    secondaryMuscles,
  } = item
  
  const generatedTags = [...targetMuscles]
  
  for (const secondaryMuscle of secondaryMuscles) {
    generatedTags.push(secondaryMuscle)
  }

  for (const bodypart of bodyParts) {
    if (bodypart?.toLowerCase()) {
      generatedTags.push(bodypart)
    }
  }

  for (const equipment of equipments) {
    generatedTags.push(equipment)
  }
  
  tagsCache.set(item, generatedTags)
  
  return generatedTags
}
const filterRef = ref<HTMLElement | null>(null)
const isFilterOpen = ref(false)

function onFilterOpen(){
  isFilterOpen.value = true
}

function onFilterSelected() {
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="absolute inset-0 z-30 bg-black/20 backdrop-blur-sm flex items-start justify-center p-4"
    >
      <div 
        ref="dropdownContainer"
        class="bg-pane-bg rounded-lg flex flex-col w-full max-w-lg overflow-hidden mt-12 border-4 border-pane-bg"
      >
        <div class="flex p-1">
          <div class="flex pl-2 pr-3 gap-3">
            <button>
              <SortIcon class-name="text-primary stroke-2 size-6" />
            </button>

            <button
              ref="filterRef"
              @click="onFilterOpen"
            >
              <FilterIcon class-name="text-primary stroke-2 size-6" />
  
              <Transition name="fade">
                <DropdownComponent
                  v-if="isFilterOpen"
                  :items="[/* its unclear what should be here rn */ ]"
                  :trigger-ref="filterRef"
                  @select="onFilterSelected"
                  @close="isFilterOpen = false"
                />
              </Transition>
            </button>
          </div>

          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Find exercises"
            class="text-primary py-2 px-3 flex-1 text-sm border-2 border-primary outline-none bg-transparent rounded-md"
            autofocus
            @input="onSearchQueryChange"
          >
        </div>
        <!-- create a component that containes filters right here  -->
        <div
          v-if="filteredExercises.length" 
          class="px-2 pt-1"
        >
          <hr class="mx-auto border-t border-dashed border-primary m-0">
        </div>

        <div class="flex flex-col max-h-[60vh] overflow-hidden">
          <ScrollableTemplate>
            <div
              v-for="(item, index) in filteredExercises"
              :key="item.exerciseId || index" 
              class="
              hover:pl-4
              p-3
              flex justify-between text-sm rounded-sm gap-4
              even:bg-primary/5
              text-primary
              odd:bg-transparent"
              :class="disableHoverTransition ? '' : 'duration-200 transition-[padding]'"
            >
              <img 
                :src="item.gifUrl ?? 'https://placehold.co/150x150/555555/ffffff?text=N'" 
                :alt="item.name"
                class="rounded-2xl size-20"
              >

              <button
                class="flex-1 min-w-0 cursor-pointer flex flex-col gap-2 justify-center text-left group"
                @click="handleItemClick(item)"
              >
                <div class="font-semibold text-base truncate w-full first-letter:uppercase">
                  {{ item.name }}
                </div>

                <ExerciseTags :tags="getTags(item)" />
              </button>
            </div>
          </ScrollableTemplate>


          <button
            v-if="showLocateButton"
            class="flex gap-0.5 items-center px-1 hover:bg-primary/5 rounded-sm text-sm cursor-pointer w-full text-primary transition-colors"
            @click="handleLocate"
          >
            <div class="p-1.5">
              <magnifier-icon class="size-7 stroke-[1.5]" />
            </div>

            <span class="text-sm font-medium">
              {{ searchQuery || "Locate untitled product" }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

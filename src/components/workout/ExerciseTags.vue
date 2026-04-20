<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ChevronDownIcon from '$src/components/icons/ChevronDownIcon.vue'

const props = defineProps<{ exercise: Exercise, }>()
const tagsContainerRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isScrolling = ref(false)


const checkScroll = () => {
  if (!tagsContainerRef.value || isScrolling.value) return
  const { scrollLeft, scrollWidth, clientWidth } = tagsContainerRef.value
  
  
  canScrollLeft.value = scrollLeft > 1
  canScrollRight.value = Math.ceil(scrollLeft + clientWidth) < scrollWidth
}

const scrollTags = (direction: 'left' | 'right') => {
  if (!tagsContainerRef.value) return
  const scrollAmount = 150 
  const { scrollLeft, clientWidth, scrollWidth } = tagsContainerRef.value

  let targetScrollLeft = scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
  targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, scrollWidth - clientWidth))

  isScrolling.value = true

  if (direction === 'right') {
    if (Math.ceil(targetScrollLeft + clientWidth) >= scrollWidth) {
      canScrollRight.value = false
    }
    canScrollLeft.value = true
  }
  else {
    if (targetScrollLeft <= 1) {
      canScrollLeft.value = false
    }
    canScrollRight.value = true
  }
  
  tagsContainerRef.value.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  })

  if (scrollTimeout) clearTimeout(scrollTimeout)

  scrollTimeout = setTimeout(
    () => {
      isScrolling.value = false
      checkScroll()
    }, 
    500,
  )
}


const tags = computed(() => {
  const { muscle, secondary_muscle: secondaryMuscle, bodypart } = props.exercise
  
  const generatedTags = [muscle]
  
  if (secondaryMuscle) {
    generatedTags.push(secondaryMuscle)
  }
  
  if (bodypart && bodypart.toLowerCase() !== muscle.toLowerCase()) {
    generatedTags.push(bodypart)
  }
  
  return generatedTags
})

let tagsObserver: ResizeObserver | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null


const handleWheel = (e: WheelEvent) => {
  if (!tagsContainerRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = tagsContainerRef.value
  const isAtLeftEdge = scrollLeft <= 0
  const isAtRightEdge = Math.ceil(scrollLeft + clientWidth) >= scrollWidth

  if ((e.deltaY < 0 && isAtLeftEdge) || (e.deltaY > 0 && isAtRightEdge)) {
    return
  }

  e.preventDefault()
  
  tagsContainerRef.value.scrollLeft += e.deltaY 
}


onMounted(() => {
  tagsObserver = new ResizeObserver(() => {
    checkScroll()
  })
  if (tagsContainerRef.value) tagsObserver.observe(tagsContainerRef.value)
  
  nextTick(checkScroll)
})


onUnmounted(() => {
  tagsObserver?.disconnect()
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <div class="relative flex items-center w-full">
    <Transition name="fade">
      <div 
        v-show="canScrollLeft"
        class="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-white via-white/90 to-transparent flex items-center justify-start z-10"
      >
        <button 
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
          @click.stop="scrollTags('left')"
        >
          <ChevronDownIcon class-name="size-4 stroke-3 rotate-90" />
        </button>
      </div>
    </Transition>
        
    <div 
      ref="tagsContainerRef"
      class="flex gap-2 overflow-x-auto w-full no-scrollbar relative z-0 scroll-smooth"
      @scroll="checkScroll"
      @wheel="handleWheel"
    >
      <span 
        v-for="(tag, index) in tags" 
        :key="index" 
        class="whitespace-nowrap bg-grad-start/20 text-grad-start font-semibold px-1.5 py-0.5 rounded-md text-sm lowercase"
      >
        {{ tag }}
      </span>
    </div>

    <Transition name="fade">
      <div 
        v-show="canScrollRight"
        class="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-white via-white/90 to-transparent flex items-center justify-end z-10"
      >
        <button 
          class="text-gray-400 hover:text-gray-600 focus:outline-none rounded-full p-0.5 -mr-1"
          @click.stop="scrollTags('right')"
        >
          <ChevronDownIcon class-name="size-4 stroke-3 -rotate-90" />
        </button>
      </div>
    </Transition>
  </div>
</template>

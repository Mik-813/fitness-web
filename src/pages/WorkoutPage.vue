<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useDateFormat } from '@vueuse/core'
import { computed, ref } from 'vue'
import { endpoints } from '$src/api/endpoints'
import PlusIcon from '$src/components/icons/PlusIcon.vue'
import TrashIcon from '$src/components/icons/TrashIcon.vue'
import NoData from '$src/components/NoData.vue'
import PageLayout from '$src/components/templates/PageLayout.vue'
import ExerciseLauncher from '$src/components/workout/ExerciseLauncher.vue'
import ExercisePane from '$src/components/workout/ExercisePane.vue'
import TimerComponent from '$src/components/workout/TimerComponent.vue'
import { currentDate } from '$src/states/date'
import { settings } from '$src/states/state'
import { customToast } from '$src/utils/custom-toast'
import { popElementById } from '$src/utils/pop-indentifiable'

const exercises = computed(() => endpoints.getExercises(currentDate.value).use(undefined))

async function tryRemoveExercise(exercise: Exercise){
  if (!exercises.value.data) return
  exercises.value.mutate({
    data: popElementById(exercise, exercises.value.data),
    request: endpoints.removeExercise(exercise.id).invoke,
    onError: () => {
      customToast.error('Couldn\'t delete exercise')
    },
  })
}

const isExerciseLauncherOpen = ref(false)

function scrollIntoExercise(title: string) {
  const element = document.querySelector(
    `[data-exercise-title="${title}"]`,
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

function trySelectDbExercise(dbExercise: DbExercise){
  if (!exercises.value.data) return
  if (exercises.value.data.some(e => e.db_exercise_id === dbExercise.exerciseId)) {
    scrollIntoExercise(dbExercise.name)
    return
  }
  exercises.value.mutate({
    request: endpoints.createExercise({
      record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value,
      db_exercise_id: dbExercise.exerciseId,
    }).invoke,
    refetch: true,
    onError: () => {
      customToast.error('Couldn\'t create new exercise')
    },
  })
}


async function tryResetDate() {
  exercises.value.mutate({
    data: [],
    request: endpoints.removeDates({
      filter: 'exercises',
      record_date: useDateFormat(currentDate.value, 'YYYY-MM-DD').value,
    }).invoke,
    onError: () => {
      customToast.error('Couldn\'t reset date')
    }, 
  })
}
</script>

<template>
  <div class="flex flex-col h-dvh w-full relative overflow-hidden">
    <div class="z-10 shrink-0">
      <TimerComponent :limit="settings.data?.rest_limit ?? 0" />
    </div>
    
    <PageLayout :hide="exercises.data === undefined">
      <div
        v-if="exercises.data !== undefined"
        v-auto-animate
        class="flex flex-col gap-4 mt-4"
      >
        <ExercisePane
          v-for="(exercise, idx) in exercises.data"
          :key="exercise.id"
          v-model="exercises.data![idx]"
          @remove="tryRemoveExercise"
        />

        <NoData
          v-if="exercises.data.length === 0"
          title="No exercises provided"
          subtitle="Add some exercises to start tracking your progress"
        />
      </div>
      
      <span
        v-else
        class="h-30"
      >
        Loading...
      </span>

      <template #overlay>
        <ExerciseLauncher
          :visible="isExerciseLauncherOpen"
          :exercises="exercises.data!"
          @close="()=> (isExerciseLauncherOpen=false)"
          @locate="scrollIntoExercise"
          @select="trySelectDbExercise"
        />
      </template>

      <template #controls>
        <div class="fixed right-0 bottom-0 m-4">
          <div class="flex flex-col gap-2">
            <button
              class="flex gap-2 shadow border-4 border-pane-bg/50 bg-primary transition-transform duration-200 hover:-translate-x-1 text-grad-text p-2.5 rounded-xl font-bold items-center"
              @click="isExerciseLauncherOpen = true"
            >
              <PlusIcon class="stroke-2" />

              <span class="hidden sm:block">
                Add exercise
              </span>
            </button>

            <button
              class="flex gap-2 shadow border-4 border-pane-bg/50 bg-red-600 transition-transform duration-200 hover:-translate-x-1 text-grad-text p-2.5 rounded-xl font-bold items-center"
              @click="tryResetDate"
            >
              <TrashIcon class="stroke-2" />

              <span class="hidden sm:block">
                Reset date
              </span>
            </button>
          </div>
        </div>
      </template>
    </PageLayout>
  </div>
</template>

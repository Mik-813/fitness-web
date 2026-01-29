<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import _logo from '$src/assets/logo.png'
import { routeNames } from '$src/router'
import { cap } from '$src/utils/stringFormatting'

const logo = _logo
const router = useRouter()
const active = ref<string>(routeNames.home)
</script>

<template>
  <header class="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-200 ">
    <div class="flex items-center gap-3">
      <img
        :src="logo"
        alt="App Logo"
        class="w-14 h-14 object-contain rounded-xl"
      >

      <div>
        <div class="text-[#082032] font-semibold text-base">
          Grinder
        </div>

        <div class="text-sm text-[#082032]/70 mt-0.5">
          Training and diet tracking
        </div>
      </div>
    </div>

    <div class="sm:w-full sm:flex-1" />

    <div
      role="tablist"
      aria-label="Select section"
      class="flex justify-evenly gap-2"
    >
      <button
        :class="['px-4 py-2 font-semibold cursor-pointer transition border-b-2', active === routeNames.statistics ? 'text-[#0b2a3a] border-[#0b2a3a]' : 'text-[#082032] border-transparent']"
        role="tab"
        :aria-selected="active === routeNames.statistics"
        @click="active = routeNames.statistics; router.push({ name: routeNames.statistics })"
      >
        {{ cap(routeNames.statistics) }}
      </button>

      <button
        :class="['px-4 py-2 font-semibold cursor-pointer transition border-b-2', active === routeNames.diet ? 'text-[#0b2a3a] border-[#0b2a3a]' : 'text-[#082032] border-transparent']"
        role="tab"
        :aria-selected="active === routeNames.diet"
        @click="active = routeNames.diet; router.push({ name: routeNames.diet })"
      >
        {{ cap(routeNames.diet) }}
      </button>

      <button
        :class="['px-4 py-2 font-semibold cursor-pointer transition border-b-2', active === routeNames.training ? 'text-[#0b2a3a] border-[#0b2a3a]' : 'text-[#082032] border-transparent']"
        role="tab"
        :aria-selected="active === routeNames.training"
        @click="active = routeNames.training; router.push({ name: routeNames.training })"
      >
        {{ cap(routeNames.training) }}
      </button>
    </div>
  </header>
</template>

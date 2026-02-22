<script setup lang="ts">
// import CustomInput from '$src/inputs/reusable/CustomInput.vue'

// 1. Initialize State
// Svelte: let settings = $state(...)
// Vue: const settings = ref(...) 
// Note: If 'settings' is an object, Vue internally makes it deep reactive.

// 2. Sync Side Effects
// Svelte: $effect(() => { ... })
// Vue: watchEffect(() => { ... })
// This runs immediately and re-runs whenever dependencies (settings.value) change.
</script>

<template>
  <div class="flex flex-col gap-2 text-gray-500 text-sm">
    <!-- <div class="flex items-center justify-between">
      <span>Set currency sign:</span>
      
      <CustomInput 
        v-model:value="settings.currency_sign" 
        label="" 
        placeholder="(unmanaged currency)" 
      />
    </div>

    <button 
      class="bg-red-500 text-white p-4 rounded font-bold" 
      @click="actions.clearAll"
    >
      Clear data
    </button> -->
  </div>
</template>

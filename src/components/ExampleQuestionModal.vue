<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CheckboxInput from '$src/components/inputs/CheckboxInput.vue'
import ModalWindow from '$src/components/reusable/ModalWindow.vue'

defineProps<{ title: string, }>() 

const dontAskAgainChecked = ref(false)

const isModalVisible = ref(false)
onMounted(() => {
  isModalVisible.value = true
})
</script>

<template>
  <ModalWindow
    title="Product title conflict"
    :visible="isModalVisible"
    :disable-native-closing="true"
  >
    <div class="flex flex-col gap-4">
      <div class="text-pane-text text-sm pb-3 flex flex-col gap-2">
        <p>
          The product title conflicts with already
          existing product
          <span>"<b>{{ title }}</b>".</span>
          You can either use existing product or override the product
        </p>
      </div>
      
      <div class="flex flex-1">
        <CheckboxInput
          v-model="dontAskAgainChecked"
          label="Don't ask again"
        />

        <div />
      </div>

      <div class="flex gap-2">
        <button 
          class="flex-1 bg-primary/5 rounded-lg p-2 font-semibold text-sm hover:bg-primary/20 duration-200"
          @click="()=>{isModalVisible = false}"
        >
          Use "{{ title }}"
        </button>

        <button
          class="flex-1 bg-secondary/5 rounded-lg p-2 font-semibold text-sm hover:bg-secondary/20 duration-200"
          @click="()=>{isModalVisible = false}"
        >
          Override "{{ title }}"
        </button>
      </div>
    </div>
  </ModalWindow>
</template>

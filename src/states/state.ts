import { computed } from 'vue'
import { endpoints } from '$src/api/endpoints'

export const settings = computed(() => endpoints.getSettings().use(undefined))

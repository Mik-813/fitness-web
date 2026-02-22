import { type Component } from 'vue'
import { toast } from 'vue-sonner'

type titleT = (() => string | Component) | string | Component

export const customToast = {
  error: (message: titleT) => toast.error(
    message, 
    {
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626',
      }, 
    },
  ),
}

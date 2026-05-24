import { type Component } from 'vue'
import { toast } from 'vue-sonner'

type titleT = (() => string | Component) | string | Component

export const customToast = {
  error: (message: titleT) => toast.error(
    message, 
    {
      position: 'bottom-left',
      style: {
        background: '#ef4444',
        color: 'white',
        border: '1px solid #dc2626',
      }, 
    },
  ),
  success: (message: titleT) => toast.success(
    message, 
    {
      position: 'bottom-left',
      style: {
        background: '#a855f7',
        color: 'white',
        border: '1px solid #9333ea',
      }, 
    },
  ),
}

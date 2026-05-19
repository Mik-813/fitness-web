import { createApp } from 'vue'
import '$src/styles.css'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import App from '$src/App.vue'
import router from '$src/router'

createApp(App)
  .use(
    VueReCaptcha, 
    {
      siteKey: import.meta.env.RECAPTCHA_SITE_KEY,
      loaderOptions: { explicitRenderParameters: { badge: 'bottomleft' } }, 
    },
  )
  .use(router)
  .mount('#app')

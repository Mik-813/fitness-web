import { createApp } from 'vue'
import '$src/styles.css'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import App from '$src/App.vue'
import router from '$src/router'

createApp(App)
  .use(
    VueReCaptcha, 
    {
      siteKey: '6LfCNlosAAAAAN6ym_NZg_IXdk09bnoaz6qfGmxz',
      loaderOptions: {}, 
    },
  )
  .use(router)
  .mount('#app')

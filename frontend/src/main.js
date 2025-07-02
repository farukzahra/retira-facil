import { createApp } from 'vue'
import App from './App.vue'

// Router
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { pt } from 'vuetify/locale'

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'pt',
    messages: { pt }
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#90CAF9',
          secondary: '#03DAC6',
          error: '#EF5350',
          success: '#66BB6A',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
  }
})

createApp(App).use(router).use(vuetify).mount('#app')

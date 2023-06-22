// Styles
import './assets/styles/main.scss'
import './assets/styles/fonts.css'
import './assets/styles/animations.scss'

// App
import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)

// Vuetify
import vuetify from './plugins/vuetify'
app.use(vuetify)

// Vue-toastification
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
app.use(Toast)

// Pinia
import { createPinia } from "pinia"
const pinia = createPinia()
app.use(pinia)

// Router
import router from './router'
app.use(router)

app.mount("#app")

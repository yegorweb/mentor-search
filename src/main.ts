import { createApp } from "vue"
import App from "./App.vue"
import { registerPlugins } from './plugins/index'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
import { createPinia } from "pinia"
import router from './router'
import { useAuth } from "./stores/auth"

const pinia = createPinia()

const app = createApp(App)

registerPlugins(app)

app.use(Toast).use(pinia)

app.use(router)
app.mount("#app")
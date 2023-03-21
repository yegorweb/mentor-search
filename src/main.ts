import { createApp } from "vue"
import App from "./App.vue"
import { registerPlugins } from './plugins/index'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App)

registerPlugins(app)

app.mount("#app")
app.use(Toast)
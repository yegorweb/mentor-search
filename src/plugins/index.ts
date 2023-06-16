/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import { App } from 'vue'

export function registerPlugins(app: App) {
  loadFonts()
  app
    .use(vuetify)
}

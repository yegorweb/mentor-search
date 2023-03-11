/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#4D6A79',
          success: '#BBF551',
          accent: '#FC5259',
          secondary: '#17AECA',
          attention:'#4ADEC8',
          info:'F3E12E'
          // primary: '#FFE89C',
          // success: '#8EE894',
          // accent: '#CD87DA',
          // // TODO
          // secondary: '#000000',
        },
      },
    },
  },
})

// primary: '#1D191A',
// success: '#8EE894',
// accent: '#BD8D14',
// secondary: '#582801',
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createVuetify } from 'vuetify'

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#5F5566',
          secondary: '#80ADA0',
          accent: '#8AEA92',
          text_gray: '#4A4A4A', 
          button: '#8F8F8F'
          // success: '#BBF551',
          // attention:'#4ADEC8',
          // info:'F3E12E'
        },
      },
    },
  },
})

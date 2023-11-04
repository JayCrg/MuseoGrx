import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config'
import VCalendar from 'v-calendar';


import App from './App.vue'
import router from './router'

import 'v-calendar/style.css';
import '@formkit/themes/genesis'
import '@formkit/addons/css/multistep';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './assets/styles.css'



/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faTicket } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(faUser,faMagnifyingGlass, faTicket, faGoogle, faGithub, faEye, faEyeSlash, faCaretDown, faFile, faPlus, faMinus)



const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(plugin, config)
app.use(router)
app.use(VCalendar, {})


app.mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import config from './formkit.config'
import VuePrlx from 'vue-prlx/src/index'
import { VuePrlxDirective } from 'vue-prlx/src/index'

import App from './App.vue'
import router from './router'

import '@formkit/themes/genesis'
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

/* add icons to the library */
library.add(faUser,faMagnifyingGlass, faTicket, faGoogle, faGithub, faEye, faEyeSlash, faCaretDown)


/*add vue-plrx library*/

// As a plugin

// As a directive (local)


const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(plugin, config)
app.use(router)
app.use(VuePrlx)
app.directive('prlx', VuePrlxDirective)

app.mount('#app')

// formkit.config.js
import { defaultConfig } from '@formkit/vue'
import { createFloatingLabelsPlugin } from '@formkit/addons'
import { createMultiStepPlugin } from '@formkit/addons'
import { es } from '@formkit/i18n'

import '@formkit/addons/css/floatingLabels'

const config = defaultConfig({
    locales: { es },
    locale: 'es',
    plugins: [
        createFloatingLabelsPlugin({
            useAsDefault: false, // defaults to false
        }),
        createMultiStepPlugin(),
    ],
})

export default config
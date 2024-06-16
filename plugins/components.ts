import { Card, CardGroup, NuxtImg } from '#components'

// Add them to main entry (useful for content usage)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtImg', NuxtImg)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('CardGroup', CardGroup)
})

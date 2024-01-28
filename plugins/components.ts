import { NuxtImg, ULandingHero, ULandingSection } from '#components'

// Add them to main entry (useful for content usage)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('NuxtImg', NuxtImg)
  nuxtApp.vueApp.component('LandingHero', ULandingHero)
  nuxtApp.vueApp.component('LandingSection', ULandingSection)
})

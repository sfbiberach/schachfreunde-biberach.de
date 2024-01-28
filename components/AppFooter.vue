<script setup lang="ts">
const appConfig = useAppConfig()

const { data: footerTexts } = await useAsyncData('footer', () => queryContent('_texts/footer').find())
</script>

<template>
  <UFooter
    :ui="{
      bottom: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: '!py-6', left: '~', center: '~', right: '~' },
      top: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: 'py-8 lg:py-12' },
    }"
  >
    <template #top>
      <UFooterColumns :links="appConfig.links.footer" :ui="{ right: 'flex flex-col lg:grid grid-flow-col auto-cols-fr gap-8' }">
        <template #right>
          <NewsletterForm class="space-y-6" />
          <div v-for="(text, index) in footerTexts" :key="index" class="space-y-6 text-sm">
            <h3 class="text-sm/6 font-semibold text-gray-900 dark:text-white">
              {{ text.title }}
            </h3>
            <ContentRenderer :value="text" />
          </div>
        </template>
      </UFooterColumns>
    </template>
    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © {{ new Date().getFullYear() }}
        <NuxtLink to="https://www.happydesigns.de/" target="_blank">
          happydesigns
        </NuxtLink>
      </p>
    </template>
    <template #right>
      <!-- <UColorModeSelect class="w-32" />
      <UDivider color="gray" orientation="vertical" class="w-8 h-8" /> -->
      <div class="-ml-[0.375rem]">
        <UButton aria-label="Sfr. HN-Biberach auf Instagram" to="https://www.instagram.com/schachfreundeheilbronnbiberach/" target="_blank" icon="i-simple-icons-instagram" v-bind="($ui.button.secondary as any)" />
        <UButton aria-label="Sfr. HN-Biberach auf Facebook" to="https://www.facebook.com/Schachfreunde.HN.Biberach/" target="_blank" icon="i-simple-icons-facebook" v-bind="($ui.button.secondary as any)" />
        <UButton aria-label="Sfr. HN-Biberach auf GitHub" to="https://github.com/sfbiberach" target="_blank" icon="i-simple-icons-github" v-bind="($ui.button.secondary as any)" />
      </div>
    </template>
  </UFooter>
</template>

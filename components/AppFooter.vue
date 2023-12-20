<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<!-- eslint-disable vue/no-extra-parens -->
<template>
  <UFooter
    :ui="{
      bottom: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: '!py-6', left: '~', center: '~', right: '~' },
      top: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: 'py-8 lg:py-12' },
    }"
  >
    <template #top>
      <UFooterColumns :links="appConfig.links.footer">
        <template #right>
          <div class="space-y-4">
            <NewsletterForm label="Abboniere unseren Newsletter" description="Bleibe auf dem Laufenden über neue Beiträge, Veranstaltungen und mehr." />
            <UFormGroup name="theme" label="Farbschema">
              <UColorModeSelect class="w-32" />
            </UFormGroup>
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
      <UButton aria-label="Sfr. HN-Biberach auf Instagram" to="https://www.instagram.com/schachfreundeheilbronnbiberach/" target="_blank" icon="i-simple-icons-instagram" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Sfr. HN-Biberach auf Facebook" to="https://www.facebook.com/Schachfreunde.HN.Biberach/" target="_blank" icon="i-simple-icons-facebook" v-bind="($ui.button.secondary as any)" />
      <UButton aria-label="Sfr. HN-Biberach auf GitHub" to="https://github.com/sfbiberach" target="_blank" icon="i-simple-icons-github" v-bind="($ui.button.secondary as any)" />
    </template>
  </UFooter>
</template>

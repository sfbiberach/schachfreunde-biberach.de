<script setup>
const links = [{
  label: 'Community',
  children: [{
    label: 'Nuxters',
    to: 'https://nuxters.nuxt.com',
    target: '_blank',
  }, {
    label: 'Video Courses',
    to: 'https://masteringnuxt.com/nuxt3?ref=nuxt',
    target: '_blank',
  }, {
    label: 'Nuxt on GitHub',
    to: 'https://github.com/nuxt',
    target: '_blank',
  }],
}, {
  label: 'Solutions',
  children: [{
    label: 'Nuxt Content',
    to: 'https://content.nuxt.com/',
    target: '_blank',
  }, {
    label: 'Nuxt DevTools',
    to: 'https://devtools.nuxt.com/',
    target: '_blank',
  }, {
    label: 'Nuxt Image',
    to: 'https://image.nuxt.com/',
    target: '_blank',
  }, {
    label: 'Nuxt UI',
    to: 'https://ui.nuxt.com/',
    target: '_blank',
  }],
}, {
  label: 'Rechtliches',
  children: [{
    label: 'Impressum',
    to: '/impressum',
  }, {
    label: 'Datenschutz',
    to: '/datenschutz',
  }],
}]
</script>

<template>
  <UFooter
    :ui="{
      bottom: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: '!py-6' },
      top: { wrapper: 'border-t border-gray-200 dark:border-gray-800', container: 'py-8 lg:py-12' },
    }"
  >
    <template #top>
      <UFooterColumns :links="links">
        <template #right>
          <UFormGroup name="email" label="Subscribe to our newsletter" size="lg">
            <UInput type="email" :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton type="submit" size="2xs" color="black" label="Subscribe" />
              </template>
            </UInput>
          </UFormGroup>
          <UColorModeSelect class="w-32 mt-4" />
        </template>
      </UFooterColumns>
    </template>
    <template #left>
      Copyright © {{ new Date().getFullYear() }} Sfr. HN-Biberach 1978 e.&nbsp;V.
    </template>
  </UFooter>
</template>

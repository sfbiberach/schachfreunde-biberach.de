<script setup>
const links = [{
  label: 'Homepage',
  children: [{
    label: 'Aktuelles',
    to: '/',
  }, {
    label: 'Verein',
    to: '/verein',
  }, {
    label: 'Mannschaften',
    to: '/mannschaften',
  }, {
    label: 'Turniere',
    to: '/turniere',
  }],
}, {
  label: 'Wichtige Links',
  children: [{
    label: 'Unterländer Schachtage',
    to: 'https://www.unterlaender-schachtage.de/',
    target: '_blank',
  }, {
    label: 'Aktuelle DWZ-Liste',
    to: 'https://schach.in/zahlen/C0652/',
    target: '_blank',
  }, {
    label: 'Facebook-Seite',
    to: 'https://www.facebook.com/Schachfreunde.HN.Biberach/',
    target: '_blank',
  }, {
    label: 'Google Vereinskalender',
    to: 'https://calendar.google.com/calendar/embed?src=dimi.triantafillidis%40web.de&ctz=Europe%2FBerlin',
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
      Copyright © {{ new Date().getFullYear() }} Sfr. HN-Biberach 1978 e.&nbsp;V.
    </template>
  </UFooter>
</template>

<script setup lang="ts">
type ContactGroupId = 'board' | 'sport-youth' | 'organization'

interface ContactDetails {
  group: ContactGroupId
  order: number
  role: string
  email: string
  responsibilities: string[]
}

interface ContactPerson {
  name: string
  contact: ContactDetails
}

const groupDefinitions = [
  {
    id: 'board',
    title: 'Vorstand',
    description: 'Allgemeine Vereinsangelegenheiten und die Vertretung des Vereins.',
    icon: 'i-ph-users-three-duotone',
    gridClass: 'lg:grid-cols-2!',
  },
  {
    id: 'sport-youth',
    title: 'Spielbetrieb & Jugend',
    description: 'Mannschaftsschach, Turniere, Training und Nachwuchsarbeit.',
    icon: 'i-ph-castle-turret-duotone',
    gridClass: 'lg:grid-cols-2!',
  },
  {
    id: 'organization',
    title: 'Organisation & Kommunikation',
    description: 'Mitgliedschaft, Finanzen, interne Organisation und Öffentlichkeitsarbeit.',
    icon: 'i-ph-megaphone-duotone',
    gridClass: 'lg:grid-cols-3!',
  },
] as const

definePageMeta({
  heroBackground: 'opacity-35',
})

const { data: page } = await usePageContent({
  collection: 'page',
  path: '/kontakt',
})
const { data: users } = await useAsyncData('contact-directory', () => queryCollection('user').all())
const { copy, copied } = useClipboard()
const copiedEmail = ref<string>()

usePageSeo(page)
const header = computed(() => resolvePageHeader(page.value))
const contactGroups = computed(() => {
  const contacts = (users.value || []) as ContactPerson[]

  return groupDefinitions.map(group => ({
    ...group,
    people: contacts
      .filter(person => person.contact?.group === group.id)
      .sort((a, b) => a.contact.order - b.contact.order)
      .map(person => ({ ...person, initials: getInitials(person.name) })),
  }))
})

function getInitials(name: string) {
  const parts = name.replace(/^Dr\.\s+/, '').trim().split(/\s+/)
  return `${parts[0]?.[0] || ''}${parts.at(-1)?.[0] || ''}`.toUpperCase()
}

function emailWasCopied(email: string) {
  return copied.value && copiedEmail.value === email
}

function copyEmail(email: string) {
  copiedEmail.value = email
  copy(email, {
    id: `contact-email-copy:${email}`,
    title: 'E-Mail-Adresse kopiert',
    description: email,
    icon: 'i-ph-check-circle-duotone',
    color: 'success',
    duration: 2500,
  })
}
</script>

<template>
  <NuxtLayout>
    <UPageSection
      v-if="header"
      class="contact-hero border-b border-default"
      :ui="{
        container: 'py-10 sm:py-12 lg:py-14',
      }"
    >
      <div class="max-w-3xl">
        <div class="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <UIcon name="i-ph-address-book-duotone" class="size-5" />
          <span>Ansprechpartner im Verein</span>
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
          {{ header.title }}
        </h1>
        <p class="mt-4 text-lg leading-8 text-muted">
          {{ header.description }}
        </p>
      </div>
    </UPageSection>

    <UPageSection
      :ui="{
        container: 'py-10 sm:py-12 lg:py-16',
      }"
    >
      <div>
        <section
          v-for="(group, groupIndex) in contactGroups"
          :key="group.id"
          :aria-labelledby="`contact-group-${group.id}`"
          :class="groupIndex > 0 ? 'mt-12 border-t border-default pt-12 sm:mt-14 sm:pt-14' : ''"
        >
          <div class="flex items-start gap-4">
            <UIcon :name="group.icon" class="mt-1 size-6 shrink-0 text-primary" />
            <div class="min-w-0">
              <h2 :id="`contact-group-${group.id}`" class="text-2xl font-semibold text-highlighted sm:text-3xl">
                {{ group.title }}
              </h2>
              <p class="mt-1 text-muted">
                {{ group.description }}
              </p>
            </div>
          </div>

          <UPageGrid class="mt-6 sm:grid-cols-2!" :class="group.gridClass">
            <UCard
              v-for="person in group.people"
              :key="person.contact.email"
              variant="subtle"
              :ui="{
                root: 'h-full flex flex-col',
                body: 'flex-1 p-5 sm:p-5',
                footer: 'mt-auto p-0 sm:px-0',
              }"
            >
              <div class="flex items-center gap-4">
                <UAvatar
                  :alt="person.name"
                  :text="person.initials"
                  size="xl"
                  class="bg-primary/8 text-toned ring-1 ring-inset ring-primary/20"
                />
                <div class="min-w-0">
                  <h3 class="text-base font-semibold text-highlighted">
                    {{ person.name }}
                  </h3>
                  <UBadge
                    :label="person.contact.role"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                    class="mt-1"
                  />
                </div>
              </div>

              <ul class="mt-5 space-y-2.5 text-sm leading-6 text-toned">
                <li
                  v-for="responsibility in person.contact.responsibilities"
                  :key="responsibility"
                  class="flex items-start gap-3"
                >
                  <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                  <span>{{ responsibility }}</span>
                </li>
              </ul>

              <template #footer>
                <div class="email-action flex min-w-0 items-center gap-1 px-4 py-3 sm:px-5">
                  <UButton
                    :label="person.contact.email"
                    :to="`mailto:${person.contact.email}`"
                    icon="i-ph-envelope-simple-duotone"
                    variant="link"
                    class="min-w-0 flex-1 justify-start px-0"
                    :ui="{
                      label: 'whitespace-normal break-all text-left',
                    }"
                  />

                  <UTooltip
                    :text="emailWasCopied(person.contact.email) ? 'Kopiert' : 'E-Mail-Adresse kopieren'"
                    :delay-duration="100"
                  >
                    <UButton
                      :icon="emailWasCopied(person.contact.email) ? 'i-ph-check-bold' : 'i-ph-copy-duotone'"
                      :color="emailWasCopied(person.contact.email) ? 'success' : 'neutral'"
                      variant="ghost"
                      size="sm"
                      :aria-label="emailWasCopied(person.contact.email) ? 'E-Mail-Adresse kopiert' : `${person.contact.email} kopieren`"
                      @click="copyEmail(person.contact.email)"
                    />
                  </UTooltip>
                </div>
              </template>
            </UCard>
          </UPageGrid>
        </section>
      </div>
    </UPageSection>
  </NuxtLayout>
</template>

<style scoped>
.contact-hero {
  background:
    radial-gradient(circle at 82% 10%, color-mix(in oklab, var(--ui-primary) 10%, transparent), transparent 36%),
    linear-gradient(180deg, color-mix(in oklab, var(--ui-bg-elevated) 52%, var(--ui-bg)), var(--ui-bg));
}

.email-action {
  background-color: color-mix(in oklab, var(--ui-bg-elevated) 72%, var(--ui-bg));
}
</style>

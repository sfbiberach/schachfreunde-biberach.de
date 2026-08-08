<script setup lang="ts">
definePageMeta({
  validate: isContentPageRoute,
})

const { data: page } = await usePageContent({ collection: 'content' })
useSiteOgImage(page, { kind: 'page', eyebrow: 'Rechtliches' })
</script>

<template>
  <HContentPage :page collection="content" />
</template>

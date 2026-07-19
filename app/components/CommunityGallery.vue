<script setup lang="ts">
import { NuxtLink } from '#components'

interface GalleryImage {
  src: string
  alt: string
  width?: number
  height?: number
  position?: string
  eyebrow?: string
  caption?: string
  to?: string
}

defineProps<{
  images: GalleryImage[]
}>()

function imageClass(index: number) {
  if (index === 0) {
    return 'md:col-span-2 lg:col-span-7 lg:row-span-2 lg:min-h-136'
  }
  return 'lg:col-span-5 lg:min-h-64'
}

function imageSizes(index: number) {
  return index === 0
    ? '100vw md:100vw lg:60vw'
    : '100vw md:50vw lg:40vw'
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-fr">
    <component
      :is="image.to ? NuxtLink : 'figure'"
      v-for="(image, index) in images"
      :key="image.src"
      :to="image.to"
      class="gallery-card group relative isolate min-h-72 overflow-hidden rounded-2xl bg-elevated shadow-sm ring-1 ring-default"
      :class="imageClass(index)"
    >
      <NuxtImg
        :src="image.src"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        :sizes="imageSizes(index)"
        loading="lazy"
        class="absolute inset-0 -z-20 size-full object-cover transition duration-500 ease-out group-hover:scale-[1.025]"
        :style="{ objectPosition: image.position || 'center center' }"
      />
      <div class="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/12 to-transparent" aria-hidden="true" />

      <div class="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <p v-if="image.eyebrow" class="text-xs font-semibold uppercase tracking-widest text-primary-200">
          {{ image.eyebrow }}
        </p>
        <p v-if="image.caption" class="mt-2 max-w-xl text-lg font-semibold leading-snug">
          {{ image.caption }}
        </p>
        <span v-if="image.to" class="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/80">
          Zum Bericht
          <UIcon name="i-ph-arrow-up-right" class="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </component>
  </div>
</template>

<style scoped>
.gallery-card:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .gallery-card img,
  .gallery-card svg {
    transition: none;
  }
}
</style>

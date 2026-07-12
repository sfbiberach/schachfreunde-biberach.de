<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

const columnsClass = computed(() => props.images.length > 1 ? 'md:grid-cols-2' : '')
</script>

<template>
  <section class="gallery">
    <div class="layout grid gap-8 my-16 grid-cols-1" :class="columnsClass">
      <NuxtImg
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        alt=""
        class="object-cover w-full aspect-video rounded-md"
      />
    </div>
  </section>
</template>

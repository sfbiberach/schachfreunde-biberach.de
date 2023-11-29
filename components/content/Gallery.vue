<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  images: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
</script>

<template>
  <section class="gallery">
    <div class="layout grid gap-8 my-16 grid-cols-1" :class="Math.min(props.images.length, 2)">
      <NuxtImg
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :width="16"
        :height="9"
        alt=""
        class="object-cover w-full aspect-video rounded-md"
      />
    </div>
  </section>
</template>

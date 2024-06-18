<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  items: {
    type: Array as PropType<{ src: string, alt: string }[]>,
    default: () => [],
  },
})

const previewImages = computed(() => props.items.slice(0, 4))
const open = ref(false)
const carouselRef = ref()

function openImage(index: number) {
  open.value = true
  // carouselRef.value?.select(index)
  // setTimeout(() => carouselRef.value?.select(index), 0)
  setTimeout(() => {
    if (carouselRef.value)
      carouselRef.value.page = index
  }, 1)
}
</script>

<template>
  <div class="not-prose">
    <div class="grid gap-2 my-8 grid-cols-2 rounded-xl overflow-hidden w-full">
      <NuxtImg
        v-for="(image, index) in previewImages"
        :key="index"
        :src="image.src"
        :alt="image.alt"
        class="object-cover w-full h-full max-h-[40rem] !rounded-none cursor-pointer"
        @click="openImage(index + 1)"
      />
    </div>
    <UModal v-model="open" :ui="{ width: 'w-[unset] sm:max-w-content' }">
      <UCarousel
        ref="carouselRef" v-slot="{ item }"
        :items="props.items" :ui="{ item: 'basis-full box-border' }"
        :prev-button="{ color: 'gray', icon: 'i-ph-arrow-left' }" :next-button="{ color: 'gray', icon: 'i-ph-arrow-right' }"
        fullscreen arrows indicators
      >
        <img :src="item.src" class="aspect-auto" draggable="false">
      </UCarousel>
    </UModal>
  </div>
</template>

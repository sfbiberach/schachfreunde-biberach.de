<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  ui: {
    type: Object,
  },
})
</script>

<template>
  <UCarousel v-slot="{ item }" :items="props.items" :ui="{ container: 'gap-4', item: '' }" arrows indicators class="not-prose" :prev-button="{ class: 'disabled:hidden' }" :next-button="{ class: 'disabled:hidden' }">
    <img v-bind="item" draggable="false" :class="{ ui }" class="h-80 max-w-fit">
  </UCarousel>
</template>

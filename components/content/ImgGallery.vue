<script setup lang="ts">
import type { PropType } from 'vue'
import { onKeyStroke } from '@vueuse/core'

const props = defineProps({
  items: {
    type: Array as PropType<{ src: string, alt: string }[]>,
    default: () => [],
  },
})

const imageContainerEl = ref<HTMLElement>()
const imageEl = ref<HTMLElement>()

const previewImages = computed(() => props.items.slice(0, 4))
const isOpen = ref(false)

const currentIndex = ref(0)
const isFirstImg = computed(() => currentIndex.value === 0)
const isLastImg = computed(() => currentIndex.value === props.items.length - 1)
const image = computed(() => props.items[currentIndex.value])

onKeyStroke('Escape', () => {
  closeImage()
})

onKeyStroke('ArrowLeft', () => {
  if (isFirstImg.value)
    closeImage()
  else
    openImage(currentIndex.value - 1)
})

onKeyStroke('ArrowRight', () => {
  if (isLastImg.value)
    openImage(currentIndex.value + 1)
  else
    closeImage()
})

function openImage(index: number) {
  isOpen.value = true
}

function closeImage() {
  isOpen.value = false
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
    <UModal v-model="isOpen" :ui="{ base: '!bg-transparent', width: 'sm:max-w-[unset] sm:max-w-content' }" fullscreen>
      <div class="absolute inset-0 w-full h-full z-[-1] opacity-50">
        <img
          :src="image.src"
          class="object-cover w-full h-full blur-[70px] brightness-[.2] will-change-[filter]"
          alt=""
        >
      </div>
      <UCard
        :ui="{
          base: 'h-full flex flex-col !bg-transparent dark:!bg-transparent',
          divide: 'divide-y divide-transparent dark:divide-transparent',
          body: {
            base: 'grow flex flex-col justify-center',
          },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex gap-4 h-24">
              <img
                v-for="(previewImage, index) in items" :key="index"
                :src="previewImage.src" :alt="previewImage.alt"
                class="rounded-xl"
              >
            </div>
          </div>
        </template>
        <div class="flex items-center justify-center md:justify-between gap-x-4 w-full">
          <!-- previous image if not the first image -->
          <UTooltip
            v-if="!isFirstImg"
            text="Previous"
            :shortcuts="['←']"
          >
            <UButton
              variant="ghost"
              color="gray"
              size="lg"
              icon="i-heroicons-chevron-left"
              class="hidden md:flex ml-4"
              aria-label="Go to previous image"
              @click="openImage(currentIndex - 1)"
            />
          </UTooltip>

          <div
            v-else
            class="flex group"
          >
            <!-- back to gallery if first movie -->
            <UTooltip
              text="Back to gallery"
              :shortcuts="['Esc']"
            >
              <UButton
                size="xl"
                color="gray"
                variant="ghost"
                class="back hidden md:flex ml-4 transition-colors duration-200"
                aria-label="Back to gallery"
                @click="closeImage()"
              >
                <UIcon
                  name="i-heroicons-rectangle-group-20-solid"
                  class="w-6 h-6"
                />
              </UButton>
            </UTooltip>
          </div>
          <!-- image -->
          <div class="relative flex items-center justify-center xl:m-16">
            <div ref="imageContainerEl">
              <div class="group">
                <img
                  v-if="image"
                  ref="imageEl"
                  :src="image.src"
                  :alt="image.alt"
                  class="rounded object-contain transition-all duration-200 block"
                  crossorigin="anonymous"
                >
              </div>
            </div>
          </div>

          <UTooltip
            v-if="!isLastImg"
            text="Next"
            :shortcuts="['→']"
          >
            <UButton
              variant="ghost"
              color="gray"
              size="lg"
              icon="i-heroicons-chevron-right"
              :ui="{ rounded: 'rounded-full' }"
              class="hidden md:flex mr-4"
              aria-label="Go to next image"
              @click="openImage(currentIndex + 1)"
            />
          </UTooltip>

          <!-- back to gallery if last image -->
          <UTooltip
            v-else
            text="Back to gallery"
            :shortcuts="['Esc']"
          >
            <div class="flex">
              <UButton
                variant="ghost"
                color="gray"
                size="xl"
                class="back hidden md:flex mr-4 transition-colors duration-200"
                aria-label="Back to gallery"
                @click="closeImage()"
              >
                <UIcon
                  name="i-heroicons-rectangle-group-20-solid"
                  class="w-6 h-6"
                />
              </UButton>
            </div>
          </UTooltip>
        </div>
      </UCard>

      <!-- <UCarousel
        ref="carouselRef"
        :items="props.items" :ui="{ item: 'basis-full box-border' }"
        :prev-button="{ color: 'gray', icon: 'i-ph-arrow-left' }" :next-button="{ color: 'gray', icon: 'i-ph-arrow-right' }"
        fullscreen arrows indicators
      >
        <template #default="{ item }">
          <img :src="item.src" class="aspect-auto" draggable="false">
        </template>
        <template #indicator="{ onClick, page, active }">
          <UButton
            :label="String(page)"
            :variant="active ? 'solid' : 'outline'"
            size="2xs"
            class="rounded-full min-w-6 justify-center"
            @click="onClick(page)"
          />
        </template>
      </UCarousel> -->
    </UModal>
  </div>
</template>

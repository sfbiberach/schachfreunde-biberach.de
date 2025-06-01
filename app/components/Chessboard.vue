<script setup>
// No script logic needed for a static grid
</script>

<template>
  <Transition appear name="fade">
    <div class="absolute inset-0 w-full max-h-300 mx-auto overflow-hidden fade-out-bottom">
      <!-- Modified for full width, removed max-w-md and mx-auto -->
      <div class="grid grid-cols-8 grid-rows-8 w-full aspect-[8/8] border border-primary-300 dark:border-primary-700">
        <template v-for="rowIndex in 8" :key="`row-${rowIndex}`">
          <template v-for="colIndex in 8" :key="`cell-${rowIndex}-${colIndex}`">
            <div
              class="flex items-center justify-center hover:bg-opacity-80"
              :class=" [
                ((rowIndex - 1 + colIndex - 1) % 2 !== 0) ? 'bg-primary-700/20 dark:bg-primary-900' : 'bg-primary-200/20 dark:bg-primary-400',
              ]"
            >
              <!-- Cell content can go here, e.g., chess pieces -->
            </div>
          </template>
        </template>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-out-bottom {
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%); /* For Safari/Chrome */
}
</style>

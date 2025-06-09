<script setup>
const seeds = useState('chessboard-seeds', () =>
  Array.from({ length: 64 }, () => Math.random()))
</script>

<template>
  <Transition appear name="fade">
    <div class="absolute inset-x-0 top-0 w-full max-h-192 overflow-visible fade-out-bottom">
      <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 grid-rows-8 w-full max-h-full aspect-[4/8] md:aspect-[6/8] lg:aspect-square">
        <template v-for="rowIndex in 8" :key="`row-${rowIndex}`">
          <template v-for="colIndex in 8" :key="`cell-${rowIndex}-${colIndex}`">
            <div
              class="flex items-center justify-center hover:bg-opacity-80 flicker"
              :class=" [
                ((rowIndex - 1 + colIndex - 1) % 2 !== 0) ? 'bg-primary-700/20 dark:bg-primary-900/20' : 'bg-primary-200/20 dark:bg-primary-400/20',
                (colIndex > 4 ? 'hidden md:flex' : ''),
                (colIndex > 6 ? 'hidden lg:flex' : ''),
              ]"
              :style="{
                '--duration': `${8 + seeds[(rowIndex - 1) * 8 + (colIndex - 1)] * 12}s`,
                '--delay': `${seeds[(rowIndex - 1) * 8 + (colIndex - 1)] * 3}s`,
              }"
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
  transition: opacity 0.5s cubic-bezier(0.6, 0.05, 0.25, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-out-bottom {
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%); /* For Safari/Chrome */
}

@keyframes flicker {
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.36; }
}
.flicker {
  animation: flicker var(--duration) ease-in-out var(--delay) infinite both;
}
</style>

<script setup lang="ts">
function getCellPrimaryStrength(rowIndex: number, colIndex: number) {
  const rowProgress = (rowIndex - 1) / 11
  const columnProgress = (colIndex - 1) / 7
  const diagonalProgress = rowProgress * 0.4 + columnProgress * 0.6
  const isLight = (rowIndex + colIndex) % 2 === 0
  const strongestMix = isLight ? 19 : 7
  const weakestMix = isLight ? 7 : 2

  return `${weakestMix + (strongestMix - weakestMix) * (1 - diagonalProgress)}%`
}

function getCellSaturation(rowIndex: number, colIndex: number) {
  const rowProgress = (rowIndex - 1) / 11
  const columnProgress = (colIndex - 1) / 7
  const colorProgress = Math.max(0, 1 - columnProgress * 0.82 - rowProgress * 0.18)

  return 0.06 + colorProgress ** 1.45 * 1.04
}
</script>

<template>
  <div
    class="chessboard pointer-events-none absolute inset-0 overflow-hidden select-none"
    aria-hidden="true"
    inert
  >
    <div class="chessboard-grid">
      <template v-for="rowIndex in 12" :key="`row-${rowIndex}`">
        <div
          v-for="colIndex in 8"
          :key="`cell-${rowIndex}-${colIndex}`"
          class="chessboard-cell"
          :class="{
            'chessboard-cell--light': (rowIndex + colIndex) % 2 === 0,
            'chessboard-cell--dark': (rowIndex + colIndex) % 2 !== 0,
            'chessboard-cell--animated': (rowIndex * 5 + colIndex * 3) % 4 === 0,
            'hidden md:block': colIndex > 4 && colIndex <= 6,
            'hidden lg:block': colIndex > 6,
          }"
          :style="{
            '--cell-primary': getCellPrimaryStrength(rowIndex, colIndex),
            '--cell-saturation': getCellSaturation(rowIndex, colIndex),
            '--pulse-duration': `${12 + (rowIndex * 3 + colIndex * 5) % 9}s`,
            '--pulse-delay': `${-((rowIndex * 7 + colIndex * 2) % 15)}s`,
          }"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.chessboard {
  --board-columns: 4;
  mask-image: linear-gradient(
    to bottom left,
    rgb(0 0 0 / 0.9) 0%,
    rgb(0 0 0 / 0.68) 26%,
    rgb(0 0 0 / 0.24) 52%,
    transparent 76%
  );
  -webkit-mask-image: linear-gradient(
    to bottom left,
    rgb(0 0 0 / 0.9) 0%,
    rgb(0 0 0 / 0.68) 26%,
    rgb(0 0 0 / 0.24) 52%,
    transparent 76%
  );
}

.chessboard-grid {
  display: grid;
  grid-template-columns: repeat(var(--board-columns), minmax(0, 1fr));
  width: 100%;
}

.chessboard-cell {
  aspect-ratio: 1;
  filter: saturate(var(--cell-saturation));
}

.chessboard-cell--light {
  background-color: color-mix(in oklab, var(--ui-primary) var(--cell-primary), transparent);
}

.chessboard-cell--dark {
  background-color: color-mix(in oklab, var(--ui-primary) var(--cell-primary), transparent);
}

:global(.light .chessboard-cell--light) {
  background-color: color-mix(in oklab, var(--ui-primary) calc(var(--cell-primary) + 5%), var(--ui-bg-muted));
}

:global(.light .chessboard-cell--dark) {
  background-color: color-mix(in oklab, var(--ui-primary) calc(var(--cell-primary) + 4%), var(--ui-bg));
}

.chessboard-cell--animated {
  animation: board-breathe var(--pulse-duration) ease-in-out var(--pulse-delay) infinite both;
}

@keyframes board-breathe {
  0%,
  100% {
    opacity: 0.72;
    filter: saturate(var(--cell-saturation)) brightness(0.96);
  }

  50% {
    opacity: 0.94;
    filter: saturate(var(--cell-saturation)) brightness(1.03);
  }
}

@media (min-width: 48rem) {
  .chessboard {
    --board-columns: 6;
  }
}

@media (min-width: 64rem) {
  .chessboard {
    --board-columns: 8;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chessboard-cell--animated {
    animation: none;
  }
}
</style>

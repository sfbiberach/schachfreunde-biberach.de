<template>
  <div class="relative w-full">
    <div class="absolute top-0 left-0 w-full pointer-events-none custom-gradient-height bg-gradient-to-b from-primary to-transparent opacity-20 dark:opacity-15" />
  </div>
</template>

<style scoped>
.custom-gradient-height {
  height: 420px;
  height: clamp(360px, 12vw, 480px);
}
</style>

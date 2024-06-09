<template>
  <div class="relative w-full">
    <div class="absolute top-0 left-0 w-full custom-gradient-height bg-gradient-to-b from-primary to-transparent opacity-20 dark:opacity-15" />
    <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-100" />
    <div class="relative z-10 pt-[2px]" />
  </div>
</template>

<style scoped>
.custom-gradient-height {
  height: 360px;
  height: clamp(280px, 12vw, 420px);
}
</style>

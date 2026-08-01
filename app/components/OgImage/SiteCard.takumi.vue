<script setup lang="ts">
const props = defineProps({
  accent: { type: String, required: true },
  accentName: { type: String, required: true },
  description: { type: String, required: true },
  eyebrow: { type: String, required: true },
  format: { type: String, required: true },
  image: { type: String, default: undefined },
  imageAlt: { type: String, default: undefined },
  imagePosition: { type: String, default: undefined },
  meta: { type: String, default: undefined },
  title: { type: String, required: true },
})

const isPortrait = computed(() => props.format === 'portrait')
const isSquare = computed(() => props.format === 'square')
const isTall = computed(() => isPortrait.value || isSquare.value)
const hasImage = computed(() => Boolean(props.image))
const boardColumns = 8
const boardRows = 8
const boardSize = computed(() => isTall.value ? 1080 : 630)
const boardSquareSize = computed(() => boardSize.value / boardColumns)
const tiles = computed(() => Array.from({ length: boardColumns * boardRows }, (_, index) => index))
const imageBoardFade = computed(() => isPortrait.value
  ? [0, 0, 0, 0, 0.10, 0.46, 0.22, 0.08]
  : isSquare.value
    ? [0, 0, 0, 0.12, 0.46, 0.24, 0.10, 0.04]
    : [0.01, 0.02, 0.03, 0.05, 0.09, 0.16, 0.28, 0.46])

function toHexAlpha(opacity: number) {
  return Math.round(opacity * 255).toString(16).padStart(2, '0')
}

function boardTileBackground(tile: number) {
  const row = Math.floor(tile / boardColumns)
  const column = tile % boardColumns
  const alternate = (tile + row) % 2 === 1

  if (!hasImage.value) {
    return alternate ? [props.accent, '20'].join('') : 'rgba(15, 23, 42, 0.08)'
  }

  const opacity = imageBoardFade.value[isTall.value ? row : column] || 0
  return alternate
    ? [props.accent, toHexAlpha(opacity * 0.42)].join('')
    : ['rgba(11, 18, 32, ', opacity, ')'].join('')
}

const boardStyle = computed(() => ({
  position: 'absolute' as const,
  zIndex: 0,
  overflow: 'hidden' as const,
  opacity: hasImage.value ? 1 : 0.88,
  right: hasImage.value && !isTall.value ? '48%' : '0',
  top: '0',
  width: `${boardSize.value}px`,
  height: `${boardSize.value}px`,
}))

const contentStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'flex-end',
  position: 'relative' as const,
  zIndex: 3,
  boxSizing: 'border-box' as const,
  width: hasImage.value && !isTall.value ? '52%' : '100%',
  height: '100%',
  padding: isPortrait.value ? '76px 76px 112px' : isSquare.value ? '68px' : '52px 78px 48px 62px',
}))

const imageStyle = computed(() => ({
  position: 'absolute' as const,
  zIndex: 1,
  objectFit: 'cover' as const,
  objectPosition: props.imagePosition || 'center',
  ...(isTall.value
    ? { left: '0', top: '0', width: '100%', height: '44%' }
    : { right: '0', top: '0', width: '48%', height: '100%' }),
}))

const tallImageContentBackdropStyle = computed(() => ({
  position: 'absolute' as const,
  zIndex: 2,
  left: '0',
  right: '0',
  bottom: '0',
  top: '44%',
  backgroundImage: 'linear-gradient(180deg, rgba(11,18,32,0) 0%, rgba(11,18,32,0.82) 14%, #0b1220 26%)',
}))

const titleStyle = computed(() => ({
  color: '#ffffff',
  fontFamily: 'Inter, sans-serif',
  fontSize: isPortrait.value ? '76px' : isSquare.value ? '68px' : hasImage.value ? '56px' : '62px',
  fontWeight: 800,
  letterSpacing: '-0.045em',
  lineHeight: 1.12,
  margin: '0',
  maxWidth: !hasImage.value && !isTall.value ? '830px' : undefined,
  maxHeight: isTall.value ? '270px' : '204px',
  paddingBottom: '12px',
  overflow: 'visible',
}))
</script>

<template>
  <div
    :style="{
      position: 'relative',
      display: 'flex',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#111827',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
    }"
  >
    <div :style="boardStyle">
      <div
        v-for="tile in tiles"
        :key="tile"
        :style="{
          position: 'absolute',
          left: `${(tile % boardColumns) * boardSquareSize}px`,
          top: `${Math.floor(tile / boardColumns) * boardSquareSize}px`,
          width: `${boardSquareSize}px`,
          height: `${boardSquareSize}px`,
          backgroundColor: boardTileBackground(tile),
          borderRight: image ? 'none' : '1px solid rgba(96, 165, 250, 0.11)',
          borderBottom: image ? 'none' : '1px solid rgba(96, 165, 250, 0.11)',
        }"
      />
    </div>

    <img v-if="image" :src="image" :alt="imageAlt || ''" :style="imageStyle">
    <div v-if="image && isTall" :style="tallImageContentBackdropStyle" />

    <div
      v-if="!image"
      :style="{
        position: 'absolute',
        zIndex: 1,
        inset: '0',
        backgroundImage: isTall
          ? `linear-gradient(180deg, transparent 10%, rgba(11,18,32,0.28) 30%, #0b1220 52%), radial-gradient(circle at 78% 14%, ${accent}1f, transparent 34%)`
          : `linear-gradient(90deg, #0b1220 0%, #0b1220 48%, rgba(11,18,32,0.92) 60%, rgba(11,18,32,0.28) 100%), radial-gradient(circle at 82% 18%, ${accent}24, transparent 32%)`,
      }"
    />

    <div :style="contentStyle">
      <div :style="{ display: 'flex', alignItems: 'center', marginBottom: isTall ? '54px' : '34px' }">
        <img src="/favicon.svg" alt="" :style="{ width: '52px', height: '52px', marginRight: '16px' }">
        <div :style="{ display: 'flex', flexDirection: 'column' }">
          <span :style="{ color: '#f8fafc', fontSize: '19px', fontWeight: 650, letterSpacing: '-0.018em', lineHeight: 1.15 }">Schachfreunde Heilbronn-Biberach</span>
          <span :style="{ color: '#bfdbfe', fontSize: '14px', fontWeight: 520, marginTop: '5px' }">schachfreunde-biberach.de</span>
        </div>
      </div>

      <div :style="{ display: 'flex', alignItems: 'center', marginBottom: '20px' }">
        <span :style="{ width: '34px', height: '5px', borderRadius: '9px', backgroundColor: accent, marginRight: '14px' }" />
        <span :style="{ color: accent, fontSize: isTall ? '24px' : '20px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }">
          {{ eyebrow }}
        </span>
      </div>

      <h1 class="og-card-title" :style="titleStyle">
        {{ title }}
      </h1>
      <p
        :style="{
          color: '#cbd5e1',
          fontSize: isTall ? '31px' : '24px',
          lineHeight: 1.35,
          margin: isTall ? '30px 0 0' : '24px 0 0',
          maxWidth: image && !isTall ? '660px' : '870px',
          maxHeight: isTall ? '126px' : '68px',
          overflow: 'hidden',
        }"
      >
        {{ description }}
      </p>

      <div v-if="meta" :style="{ display: 'flex', marginTop: isTall ? '44px' : '28px' }">
        <span
          :style="{
            color: '#f8fafc',
            fontSize: isTall ? '23px' : '18px',
            fontWeight: 650,
            lineHeight: 1.3,
            width: '100%',
          }"
        >
          {{ meta }}
        </span>
      </div>
    </div>

    <div :style="{ position: 'absolute', zIndex: 4, left: '0', bottom: '0', width: '100%', height: '8px', backgroundColor: accent }" />
  </div>
</template>

<style scoped>
.og-card-title {
  font-family: Inter, sans-serif;
  font-weight: 800;
}
</style>

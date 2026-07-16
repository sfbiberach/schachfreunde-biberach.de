<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const COLUMN_COUNT = 18
const ROW_COUNT = 14
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT
const INITIAL_HOLE_RADIUS = 0.74
const TARGET_HOLE_RADIUS = 2.25
const GROW_DURATION = 1050
const COLLAPSE_DURATION = 420
const POINTER_FOLLOW_TIME = 75
const CELL_EDGE_SOFTNESS = 0.42

const board = useTemplateRef<HTMLDivElement>('board')
const backdrop = useTemplateRef<HTMLDivElement>('backdrop')
const lineCanvas = useTemplateRef<HTMLCanvasElement>('lineCanvas')
const appConfig = useAppConfig()
const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
const coarsePointer = useMediaQuery('(pointer: coarse)')

const cells = Array.from({ length: CELL_COUNT }, (_, index) => {
  const row = Math.floor(index / COLUMN_COUNT)
  const column = index % COLUMN_COUNT

  return {
    index,
    row,
    column,
    isLight: (row + column) % 2 === 0,
  }
})

const removedStates = Array<boolean>(CELL_COUNT).fill(false)
const removalWeights = new Float32Array(CELL_COUNT)

let animationFrame: number | undefined
let cellElements: HTMLElement[] = []
let canvasContext: CanvasRenderingContext2D | null = null
let cellSize = 0
let boardWidth = 0
let boardHeight = 0
let boardOrigin = { x: 0, y: 0 }
let boardXAxis = { x: 1, y: 0 }
let boardYAxis = { x: 0, y: 1 }
let backdropBounds: DOMRect | undefined
let lineColor = ''
let holeIsActive = false
let lastHoleX = Number.NaN
let lastHoleY = Number.NaN
let targetPointerX = Number.NaN
let targetPointerY = Number.NaN
let currentPointerX = Number.NaN
let currentPointerY = Number.NaN
let effectProgress = 0
let targetEffectProgress = 0
let lastFrameTime = 0
let needsMeasurement = true
let resizeObserver: ResizeObserver | undefined

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value))
}

function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  const progress = clamp((value - edgeStart) / (edgeEnd - edgeStart))
  return progress * progress * (3 - 2 * progress)
}

function measureBoard() {
  const boardElement = board.value
  const backdropElement = backdrop.value
  const canvasElement = lineCanvas.value

  if (!boardElement || !backdropElement || !canvasElement) {
    return
  }

  cellElements = Array.from(boardElement.querySelectorAll<HTMLElement>('[data-board-cell]'))

  const firstCellBounds = cellElements[0]?.getBoundingClientRect()
  const nextColumnBounds = cellElements[1]?.getBoundingClientRect()
  const nextRowBounds = cellElements[COLUMN_COUNT]?.getBoundingClientRect()

  if (!firstCellBounds || !nextColumnBounds || !nextRowBounds) {
    return
  }

  const firstCenter = {
    x: firstCellBounds.left + firstCellBounds.width / 2,
    y: firstCellBounds.top + firstCellBounds.height / 2,
  }
  const nextColumnCenter = {
    x: nextColumnBounds.left + nextColumnBounds.width / 2,
    y: nextColumnBounds.top + nextColumnBounds.height / 2,
  }
  const nextRowCenter = {
    x: nextRowBounds.left + nextRowBounds.width / 2,
    y: nextRowBounds.top + nextRowBounds.height / 2,
  }
  const columnVector = {
    x: nextColumnCenter.x - firstCenter.x,
    y: nextColumnCenter.y - firstCenter.y,
  }
  const rowVector = {
    x: nextRowCenter.x - firstCenter.x,
    y: nextRowCenter.y - firstCenter.y,
  }

  cellSize = Math.hypot(columnVector.x, columnVector.y)

  if (!cellSize) {
    return
  }

  boardXAxis = {
    x: columnVector.x / cellSize,
    y: columnVector.y / cellSize,
  }
  boardYAxis = {
    x: rowVector.x / cellSize,
    y: rowVector.y / cellSize,
  }
  boardOrigin = {
    x: firstCenter.x - (boardXAxis.x + boardYAxis.x) * cellSize / 2,
    y: firstCenter.y - (boardXAxis.y + boardYAxis.y) * cellSize / 2,
  }
  boardWidth = cellSize * COLUMN_COUNT
  boardHeight = cellSize * ROW_COUNT
  backdropBounds = backdropElement.getBoundingClientRect()

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
  canvasElement.width = Math.round(boardWidth * pixelRatio)
  canvasElement.height = Math.round(boardHeight * pixelRatio)
  canvasContext = canvasElement.getContext('2d')
  canvasContext?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  lineColor = getComputedStyle(canvasElement).color
  needsMeasurement = false
}

function toBoardCoordinates(pointerX: number, pointerY: number) {
  const deltaX = pointerX - boardOrigin.x
  const deltaY = pointerY - boardOrigin.y

  return {
    x: deltaX * boardXAxis.x + deltaY * boardXAxis.y,
    y: deltaX * boardYAxis.x + deltaY * boardYAxis.y,
  }
}

function traceVisibleGrid(context: CanvasRenderingContext2D) {
  context.beginPath()

  for (let column = 0; column <= COLUMN_COUNT; column += 1) {
    const x = column * cellSize

    for (let row = 0; row < ROW_COUNT; row += 1) {
      const leftCell = column > 0 ? removedStates[row * COLUMN_COUNT + column - 1] : true
      const rightCell = column < COLUMN_COUNT ? removedStates[row * COLUMN_COUNT + column] : true

      if (leftCell && rightCell) {
        continue
      }

      context.moveTo(x, row * cellSize)
      context.lineTo(x, (row + 1) * cellSize)
    }
  }

  for (let row = 0; row <= ROW_COUNT; row += 1) {
    const y = row * cellSize

    for (let column = 0; column < COLUMN_COUNT; column += 1) {
      const topCell = row > 0 ? removedStates[(row - 1) * COLUMN_COUNT + column] : true
      const bottomCell = row < ROW_COUNT ? removedStates[row * COLUMN_COUNT + column] : true

      if (topCell && bottomCell) {
        continue
      }

      context.moveTo(column * cellSize, y)
      context.lineTo((column + 1) * cellSize, y)
    }
  }
}

function drawGlowPass(context: CanvasRenderingContext2D, lineWidth: number, opacity: number) {
  context.lineWidth = lineWidth

  for (let column = 0; column <= COLUMN_COUNT; column += 1) {
    const x = column * cellSize

    for (let row = 0; row < ROW_COUNT; row += 1) {
      const leftWeight = column > 0 ? removalWeights[row * COLUMN_COUNT + column - 1] ?? 0 : 0
      const rightWeight = column < COLUMN_COUNT ? removalWeights[row * COLUMN_COUNT + column] ?? 0 : 0
      const edgeStrength = Math.abs(leftWeight - rightWeight)

      if (edgeStrength < 0.025) {
        continue
      }

      context.globalAlpha = opacity * edgeStrength
      context.beginPath()
      context.moveTo(x, row * cellSize)
      context.lineTo(x, (row + 1) * cellSize)
      context.stroke()
    }
  }

  for (let row = 0; row <= ROW_COUNT; row += 1) {
    const y = row * cellSize

    for (let column = 0; column < COLUMN_COUNT; column += 1) {
      const topWeight = row > 0 ? removalWeights[(row - 1) * COLUMN_COUNT + column] ?? 0 : 0
      const bottomWeight = row < ROW_COUNT ? removalWeights[row * COLUMN_COUNT + column] ?? 0 : 0
      const edgeStrength = Math.abs(topWeight - bottomWeight)

      if (edgeStrength < 0.025) {
        continue
      }

      context.globalAlpha = opacity * edgeStrength
      context.beginPath()
      context.moveTo(column * cellSize, y)
      context.lineTo((column + 1) * cellSize, y)
      context.stroke()
    }
  }
}

function drawHoleGlow(glowProgress: number) {
  const context = canvasContext

  if (!context || glowProgress <= 0) {
    return
  }

  context.save()
  context.strokeStyle = lineColor
  context.lineCap = 'round'
  context.lineJoin = 'round'
  drawGlowPass(context, Math.max(4, cellSize * 0.075), 0.1 * glowProgress)
  drawGlowPass(context, 1.35, 0.48 * glowProgress)
  context.restore()
}

function drawGridHighlight(
  pointerX: number,
  pointerY: number,
  lineProgress: number,
  holeRadius: number,
  glowProgress: number,
) {
  const context = canvasContext

  if (!context || !cellSize) {
    return
  }

  context.clearRect(0, 0, boardWidth, boardHeight)

  if (lineProgress <= 0 && glowProgress <= 0) {
    return
  }

  const pointer = toBoardCoordinates(pointerX, pointerY)
  const lineRadius = Math.max(
    cellSize * 0.8,
    holeRadius + cellSize * (0.35 + 2.65 * lineProgress),
  )

  if (lineProgress > 0) {
    context.save()
    context.strokeStyle = lineColor
    context.lineWidth = 1
    context.globalAlpha = 0.72 * lineProgress
    traceVisibleGrid(context)
    context.stroke()
    context.globalCompositeOperation = 'destination-in'

    const falloff = context.createRadialGradient(
      pointer.x,
      pointer.y,
      0,
      pointer.x,
      pointer.y,
      lineRadius,
    )
    falloff.addColorStop(0, 'rgb(0 0 0 / 0.95)')
    falloff.addColorStop(0.28, 'rgb(0 0 0 / 0.82)')
    falloff.addColorStop(0.55, 'rgb(0 0 0 / 0.5)')
    falloff.addColorStop(0.78, 'rgb(0 0 0 / 0.2)')
    falloff.addColorStop(1, 'rgb(0 0 0 / 0)')
    context.fillStyle = falloff
    context.fillRect(0, 0, boardWidth, boardHeight)
    context.restore()
  }

  drawHoleGlow(glowProgress)
}

function clearHighlight() {
  canvasContext?.clearRect(0, 0, boardWidth, boardHeight)
}

function resetCells() {
  for (let index = 0; index < cellElements.length; index += 1) {
    if (!removedStates[index]) {
      continue
    }

    cellElements[index]?.classList.remove('cta-board__cell--removed')
  }

  removedStates.fill(false)
  removalWeights.fill(0)
  clearHighlight()
  lastHoleX = Number.NaN
  lastHoleY = Number.NaN
  targetPointerX = Number.NaN
  targetPointerY = Number.NaN
  currentPointerX = Number.NaN
  currentPointerY = Number.NaN
  holeIsActive = false
}

function applyEffect(pointerX: number, pointerY: number, progress: number) {
  if (needsMeasurement) {
    measureBoard()
  }

  if (!cellElements.length || !cellSize) {
    return
  }

  const pointer = toBoardCoordinates(pointerX, pointerY)
  const holeProgress = smoothstep(0, 1, progress)
  const lineProgress = smoothstep(0.36, 1, progress)
  const glowProgress = smoothstep(0.58, 1, progress)
  const holeRadius = progress > 0
    ? INITIAL_HOLE_RADIUS + (TARGET_HOLE_RADIUS - INITIAL_HOLE_RADIUS) * holeProgress
    : 0
  const removeThreshold = cellSize * holeRadius
  const edgeSoftness = cellSize * CELL_EDGE_SOFTNESS

  for (const cell of cells) {
    const centerX = (cell.column + 0.5) * cellSize
    const centerY = (cell.row + 0.5) * cellSize
    const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY)
    const isRemoved = removeThreshold > 0 && distance < removeThreshold

    removalWeights[cell.index] = removeThreshold > 0
      ? 1 - smoothstep(removeThreshold - edgeSoftness, removeThreshold + edgeSoftness, distance)
      : 0

    if (removedStates[cell.index] === isRemoved) {
      continue
    }

    cellElements[cell.index]?.classList.toggle('cta-board__cell--removed', isRemoved)
    removedStates[cell.index] = isRemoved
  }

  drawGridHighlight(pointerX, pointerY, lineProgress, removeThreshold, glowProgress)
  lastHoleX = pointerX
  lastHoleY = pointerY
  holeIsActive = progress > 0 || targetEffectProgress > 0
}

function ensureAnimation() {
  if (animationFrame || reduceMotion.value || coarsePointer.value) {
    return
  }

  animationFrame = requestAnimationFrame(animateEffect)
}

function animateEffect(timestamp: number) {
  const elapsed = lastFrameTime ? Math.min(timestamp - lastFrameTime, 48) : 16
  lastFrameTime = timestamp

  if (targetEffectProgress > effectProgress) {
    effectProgress = Math.min(targetEffectProgress, effectProgress + elapsed / GROW_DURATION)
  }
  else if (targetEffectProgress < effectProgress) {
    effectProgress = Math.max(targetEffectProgress, effectProgress - elapsed / COLLAPSE_DURATION)
  }

  if (Number.isFinite(targetPointerX) && Number.isFinite(targetPointerY)) {
    if (!Number.isFinite(currentPointerX) || !Number.isFinite(currentPointerY)) {
      currentPointerX = targetPointerX
      currentPointerY = targetPointerY
    }
    else {
      const followAmount = 1 - Math.exp(-elapsed / POINTER_FOLLOW_TIME)
      currentPointerX += (targetPointerX - currentPointerX) * followAmount
      currentPointerY += (targetPointerY - currentPointerY) * followAmount
    }

    applyEffect(currentPointerX, currentPointerY, effectProgress)
  }

  const pointerIsMoving = Math.hypot(
    targetPointerX - currentPointerX,
    targetPointerY - currentPointerY,
  ) > 0.15
  const progressIsMoving = Math.abs(targetEffectProgress - effectProgress) > 0.0001

  if (pointerIsMoving || progressIsMoving || needsMeasurement) {
    animationFrame = requestAnimationFrame(animateEffect)
    return
  }

  animationFrame = undefined
  lastFrameTime = 0

  if (effectProgress <= 0) {
    resetCells()
  }
}

function updatePointer(event: PointerEvent) {
  if (reduceMotion.value || coarsePointer.value) {
    return
  }

  if (needsMeasurement) {
    measureBoard()
  }

  const bounds = backdropBounds
  const isInside = bounds
    && event.clientX >= bounds.left
    && event.clientX <= bounds.right
    && event.clientY >= bounds.top
    && event.clientY <= bounds.bottom

  if (!isInside) {
    if (holeIsActive) {
      targetEffectProgress = 0
      ensureAnimation()
    }
    return
  }

  targetPointerX = event.clientX
  targetPointerY = event.clientY
  targetEffectProgress = 1
  holeIsActive = true
  ensureAnimation()
}

function markForMeasurement() {
  needsMeasurement = true

  if (holeIsActive) {
    ensureAnimation()
  }
}

function applyStaticHole() {
  if (needsMeasurement) {
    measureBoard()
  }

  const bounds = backdropBounds

  if (bounds) {
    targetPointerX = bounds.left + bounds.width * 0.66
    targetPointerY = bounds.top + bounds.height * 0.5
    currentPointerX = targetPointerX
    currentPointerY = targetPointerY
    targetEffectProgress = 1
    effectProgress = 1
    holeIsActive = true
    applyEffect(currentPointerX, currentPointerY, effectProgress)
  }
}

onMounted(async () => {
  await nextTick()
  measureBoard()

  resizeObserver = new ResizeObserver(() => {
    markForMeasurement()

    if (coarsePointer.value || reduceMotion.value) {
      requestAnimationFrame(applyStaticHole)
    }
  })

  if (backdrop.value) {
    resizeObserver.observe(backdrop.value)
  }

  if (coarsePointer.value || reduceMotion.value) {
    applyStaticHole()
  }

  window.addEventListener('pointermove', updatePointer, { passive: true })
  window.addEventListener('scroll', markForMeasurement, { passive: true })
})

watch(() => appConfig.ui.colors.primary, async () => {
  await nextTick()

  if (lineCanvas.value) {
    lineColor = getComputedStyle(lineCanvas.value).color
  }

  if (holeIsActive) {
    applyEffect(lastHoleX, lastHoleY, effectProgress)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', updatePointer)
  window.removeEventListener('scroll', markForMeasurement)
  resizeObserver?.disconnect()

  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div
    ref="backdrop"
    class="cta-backdrop pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
    inert
  >
    <div ref="board" class="cta-board absolute">
      <div
        v-for="cell in cells"
        :key="cell.index"
        data-board-cell
        class="cta-board__cell"
        :class="cell.isLight ? 'cta-board__cell--light' : 'cta-board__cell--dark'"
      />

      <canvas ref="lineCanvas" class="cta-board__canvas absolute inset-0 size-full" />
    </div>
  </div>
</template>

<style scoped>
.cta-backdrop {
  background-color: var(--ui-bg);
}

.cta-board {
  --cell-size: clamp(4rem, 5.5vw, 6rem);
  top: 50%;
  left: 50%;
  display: grid;
  grid-template-columns: repeat(18, var(--cell-size));
  grid-auto-rows: var(--cell-size);
  width: calc(var(--cell-size) * 18);
  transform: translate(-50%, -50%) rotate(-7deg);
}

.cta-board__cell {
  position: relative;
  transition: opacity 320ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

.cta-board__cell--light {
  background-color: color-mix(in oklab, var(--ui-primary) 5%, var(--ui-bg));
}

.cta-board__cell--dark {
  background-color: color-mix(in oklab, var(--ui-primary) 1.5%, var(--ui-bg));
}

.cta-board__cell--removed {
  opacity: 0;
}

.cta-board__canvas {
  z-index: 1;
  color: var(--ui-primary);
}

@media (max-width: 47.999rem) {
  .cta-board {
    --cell-size: 4rem;
    transform: translate(-50%, -50%) rotate(-4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-board__cell {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

interface BoardSquare {
  column: number
  row: number
}

interface RouteLanding {
  id: string
  square: BoardSquare
  strength: number
}

const COLUMN_COUNT = 18
const ROW_COUNT = 14
const CELL_COUNT = COLUMN_COUNT * ROW_COUNT
const MOVE_DURATION = 340
const MOVE_PAUSE = 70
const CAPTURE_DURATION = 620

const DEFAULT_KNIGHT: BoardSquare = { column: 7, row: 8 }
const KNIGHT_MOVES = [
  { column: 1, row: 2 },
  { column: 2, row: 1 },
  { column: 2, row: -1 },
  { column: 1, row: -2 },
  { column: -1, row: -2 },
  { column: -2, row: -1 },
  { column: -2, row: 1 },
  { column: -1, row: 2 },
] as const

const board = useTemplateRef<HTMLDivElement>('board')
const backdrop = useTemplateRef<HTMLDivElement>('backdrop')
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

const knightSquare = shallowRef<BoardSquare>({ ...DEFAULT_KNIGHT })
const hoverSquare = shallowRef<BoardSquare>()
const targetPawn = shallowRef<BoardSquare>()
const captureSquare = shallowRef<BoardSquare>()
const isChasing = ref(false)

let cellElements: HTMLElement[] = []
let cellSize = 0
let boardOrigin = { x: 0, y: 0 }
let boardXAxis = { x: 1, y: 0 }
let boardYAxis = { x: 0, y: 1 }
let backdropBounds: DOMRect | undefined
let needsMeasurement = true
let moveTimer: number | undefined
let captureTimer: number | undefined
let resizeObserver: ResizeObserver | undefined

const activePawn = computed(() => targetPawn.value ?? hoverSquare.value)
const previewPath = computed(() => activePawn.value
  ? findKnightPath(knightSquare.value, activePawn.value)
  : [])
const routeLandings = computed<RouteLanding[]>(() => {
  const landings = previewPath.value.slice(1)

  return landings.map((square, index) => {
    return {
      id: squareKey(square),
      square,
      strength: Math.max(0.4, 1 - index * 0.12),
    }
  })
})

function squareKey(square: BoardSquare) {
  return `${square.column}:${square.row}`
}

function parseSquareKey(key: string): BoardSquare {
  const [column, row] = key.split(':').map(Number)
  return { column: column ?? 0, row: row ?? 0 }
}

function isSameSquare(first?: BoardSquare, second?: BoardSquare) {
  return Boolean(first && second && first.column === second.column && first.row === second.row)
}

function isOnBoard(square: BoardSquare) {
  return square.column >= 0
    && square.column < COLUMN_COUNT
    && square.row >= 0
    && square.row < ROW_COUNT
}

function findKnightPath(start: BoardSquare, target: BoardSquare) {
  if (isSameSquare(start, target)) {
    return [{ ...start }]
  }

  const startKey = squareKey(start)
  const targetKey = squareKey(target)
  const queue: BoardSquare[] = [{ ...start }]
  const previous = new Map<string, string | undefined>([[startKey, undefined]])

  for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
    const current = queue[queueIndex]

    if (!current) {
      continue
    }

    for (const move of KNIGHT_MOVES) {
      const next = {
        column: current.column + move.column,
        row: current.row + move.row,
      }
      const nextKey = squareKey(next)

      if (!isOnBoard(next) || previous.has(nextKey)) {
        continue
      }

      previous.set(nextKey, squareKey(current))
      queue.push(next)

      if (nextKey === targetKey) {
        queueIndex = queue.length
        break
      }
    }
  }

  if (!previous.has(targetKey)) {
    return [{ ...start }]
  }

  const path: BoardSquare[] = []
  let cursor: string | undefined = targetKey

  while (cursor) {
    path.unshift(parseSquareKey(cursor))
    cursor = previous.get(cursor)
  }

  return path
}

function squareStyle(square: BoardSquare) {
  return {
    left: `${(square.column + 0.5) / COLUMN_COUNT * 100}%`,
    top: `${(square.row + 0.5) / ROW_COUNT * 100}%`,
  }
}

function measureBoard() {
  const boardElement = board.value
  const backdropElement = backdrop.value

  if (!boardElement || !backdropElement) {
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
  backdropBounds = backdropElement.getBoundingClientRect()
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

function squareFromPointer(pointerX: number, pointerY: number) {
  const pointer = toBoardCoordinates(pointerX, pointerY)

  return {
    column: Math.min(COLUMN_COUNT - 1, Math.max(0, Math.floor(pointer.x / cellSize))),
    row: Math.min(ROW_COUNT - 1, Math.max(0, Math.floor(pointer.y / cellSize))),
  }
}

function isInsideBackdrop(pointerX: number, pointerY: number) {
  const bounds = backdropBounds

  return Boolean(
    bounds
    && pointerX >= bounds.left
    && pointerX <= bounds.right
    && pointerY >= bounds.top
    && pointerY <= bounds.bottom,
  )
}

function clearMoveTimer() {
  if (moveTimer) {
    window.clearTimeout(moveTimer)
    moveTimer = undefined
  }
}

function finishCapture() {
  const capturedSquare = targetPawn.value

  if (!capturedSquare) {
    return
  }

  captureSquare.value = { ...capturedSquare }
  targetPawn.value = undefined
  hoverSquare.value = undefined
  isChasing.value = false

  if (captureTimer) {
    window.clearTimeout(captureTimer)
  }

  captureTimer = window.setTimeout(() => {
    captureSquare.value = undefined
    captureTimer = undefined
  }, CAPTURE_DURATION)
}

function performNextMove() {
  moveTimer = undefined

  if (reduceMotion.value) {
    return
  }

  const destination = targetPawn.value

  if (!destination) {
    return
  }

  const path = findKnightPath(knightSquare.value, destination)
  const nextSquare = path[1]

  if (!nextSquare) {
    if (targetPawn.value && isSameSquare(knightSquare.value, targetPawn.value)) {
      finishCapture()
    }
    return
  }

  knightSquare.value = { ...nextSquare }

  moveTimer = window.setTimeout(() => {
    if (targetPawn.value && isSameSquare(knightSquare.value, targetPawn.value)) {
      finishCapture()
      return
    }

    if (targetPawn.value) {
      scheduleNextMove(MOVE_PAUSE)
    }
  }, MOVE_DURATION)
}

function scheduleNextMove(delay = MOVE_PAUSE) {
  if (reduceMotion.value || (!targetPawn.value && coarsePointer.value)) {
    return
  }

  clearMoveTimer()
  moveTimer = window.setTimeout(performNextMove, delay)
}

function updatePointer(event: PointerEvent) {
  if (reduceMotion.value || coarsePointer.value || isChasing.value) {
    return
  }

  if (needsMeasurement) {
    measureBoard()
  }

  if (!isInsideBackdrop(event.clientX, event.clientY)) {
    hoverSquare.value = undefined
    return
  }

  const nextSquare = squareFromPointer(event.clientX, event.clientY)

  if (isSameSquare(nextSquare, hoverSquare.value)) {
    return
  }

  hoverSquare.value = nextSquare
}

function placeTarget(event: PointerEvent) {
  if (reduceMotion.value || event.button !== 0 || isChasing.value) {
    return
  }

  if (needsMeasurement) {
    measureBoard()
  }

  if (!isInsideBackdrop(event.clientX, event.clientY)) {
    return
  }

  const eventTarget = event.target

  if (
    eventTarget instanceof Element
    && eventTarget.closest('a, button, input, textarea, select, img, [role="button"]')
  ) {
    return
  }

  const nextTarget = squareFromPointer(event.clientX, event.clientY)

  if (isSameSquare(nextTarget, knightSquare.value)) {
    return
  }

  clearMoveTimer()
  hoverSquare.value = { ...nextTarget }
  targetPawn.value = { ...nextTarget }
  isChasing.value = true
  scheduleNextMove(80)
}

function markForMeasurement() {
  needsMeasurement = true
}

onMounted(async () => {
  await nextTick()
  measureBoard()

  resizeObserver = new ResizeObserver(markForMeasurement)

  if (backdrop.value) {
    resizeObserver.observe(backdrop.value)
  }

  window.addEventListener('pointermove', updatePointer, { passive: true })
  window.addEventListener('pointerdown', placeTarget, { passive: true })
  window.addEventListener('scroll', markForMeasurement, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', updatePointer)
  window.removeEventListener('pointerdown', placeTarget)
  window.removeEventListener('scroll', markForMeasurement)
  resizeObserver?.disconnect()
  clearMoveTimer()

  if (captureTimer) {
    window.clearTimeout(captureTimer)
  }
})
</script>

<template>
  <div
    ref="backdrop"
    class="cta-backdrop pointer-events-none absolute inset-0 overflow-hidden"
    :data-interaction-state="isChasing ? 'chasing' : activePawn ? 'preview' : 'idle'"
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

      <span
        v-for="landing in routeLandings"
        :key="landing.id"
        class="cta-board__route-landing"
        :style="[
          squareStyle(landing.square),
          { '--route-strength': landing.strength },
        ]"
        aria-hidden="true"
      />

      <span
        v-if="activePawn"
        class="cta-board__piece cta-board__pawn"
        :class="targetPawn ? 'cta-board__pawn--target' : 'cta-board__pawn--ghost'"
        :style="squareStyle(activePawn)"
        :data-pawn-column="activePawn.column"
        :data-pawn-row="activePawn.row"
      >
        <span class="cta-board__piece-glyph" aria-hidden="true">♟</span>
      </span>

      <span
        class="cta-board__piece cta-board__knight"
        :style="squareStyle(knightSquare)"
        :data-knight-column="knightSquare.column"
        :data-knight-row="knightSquare.row"
      >
        <span class="cta-board__piece-glyph" aria-hidden="true">♞</span>
      </span>

      <span
        v-if="captureSquare"
        class="cta-board__capture"
        :style="squareStyle(captureSquare)"
      />
    </div>
  </div>
</template>

<style scoped>
.cta-backdrop {
  background-color: var(--ui-bg);
}

.cta-board {
  --cell-size: clamp(4rem, 5.5vw, 6rem);
  --piece-counter-rotation: 7deg;
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
}

.cta-board__cell--light {
  background-color: color-mix(in oklab, var(--ui-primary) 5%, var(--ui-bg));
}

.cta-board__cell--dark {
  background-color: color-mix(in oklab, var(--ui-primary) 1.5%, var(--ui-bg));
}

.cta-board__route-landing {
  position: absolute;
  z-index: 1;
  width: var(--cell-size);
  height: var(--cell-size);
  transform: translate(-50%, -50%);
  border-radius: 0.35rem;
  background: color-mix(in oklab, var(--ui-primary) 5%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in oklab, var(--ui-primary) 18%, transparent),
    inset 0 0 1rem color-mix(in oklab, var(--ui-primary) 6%, transparent);
  opacity: calc(0.45 + var(--route-strength) * 0.4);
  pointer-events: none;
  transition: left 160ms ease, top 160ms ease, opacity 160ms ease;
}

.cta-board__piece,
.cta-board__capture {
  position: absolute;
  width: var(--cell-size);
  height: var(--cell-size);
  transform: translate(-50%, -50%) rotate(var(--piece-counter-rotation));
}

.cta-board__piece {
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    left 340ms cubic-bezier(0.22, 1, 0.36, 1),
    top 340ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 180ms ease,
    filter 180ms ease;
}

.cta-board__piece::before {
  position: absolute;
  inset: 13%;
  z-index: -1;
  border-radius: 9999px;
  background: radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 24%, transparent), transparent 70%);
  content: '';
  filter: blur(0.35rem);
}

.cta-board__piece-glyph {
  display: block;
  font-family: "Segoe UI Symbol", "Noto Sans Symbols 2", sans-serif;
  font-size: calc(var(--cell-size) * 0.72);
  font-weight: 400;
  line-height: 1;
  transform: translateY(-2%);
}

.cta-board__knight {
  color: color-mix(in oklab, var(--ui-primary) 84%, white);
  filter:
    drop-shadow(0 0.16rem 0.06rem color-mix(in oklab, black 55%, transparent))
    drop-shadow(0 0 0.45rem color-mix(in oklab, var(--ui-primary) 38%, transparent));
}

.cta-board__pawn {
  color: color-mix(in oklab, var(--ui-primary) 60%, var(--ui-text-highlighted));
}

.cta-board__pawn--ghost {
  opacity: 0.46;
  filter: saturate(0.7);
}

.cta-board__pawn--target {
  opacity: 0.9;
  filter:
    drop-shadow(0 0.16rem 0.06rem color-mix(in oklab, black 50%, transparent))
    drop-shadow(0 0 0.45rem color-mix(in oklab, var(--ui-primary) 42%, transparent));
}

.cta-board__pawn--target::before {
  animation: target-breathe 1.25s ease-in-out infinite;
}

.cta-board__capture {
  z-index: 2;
  border: 2px solid var(--ui-primary);
  border-radius: 9999px;
  animation: capture-ring 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes target-breathe {
  50% { opacity: 0.55; transform: scale(1.18); }
}

@keyframes capture-ring {
  from { opacity: 0.9; transform: translate(-50%, -50%) rotate(var(--piece-counter-rotation)) scale(0.28); }
  to { opacity: 0; transform: translate(-50%, -50%) rotate(var(--piece-counter-rotation)) scale(1.05); }
}

@media (max-width: 47.999rem) {
  .cta-board {
    --cell-size: 4rem;
    --piece-counter-rotation: 4deg;
    transform: translate(-50%, -50%) rotate(-4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-board__piece {
    transition: none;
  }

  .cta-board__pawn--target::before,
  .cta-board__capture {
    animation: none;
  }
}
</style>

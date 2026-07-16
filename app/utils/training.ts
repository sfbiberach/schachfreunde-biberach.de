import type { NextTraining, TrainingSchedule } from '~~/shared/types/training'

function getBerlinDateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  return Object.fromEntries(parts.map(part => [part.type, part.value]))
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function parseMinutes(time: string) {
  const [hours = '0', minutes = '0'] = time.split(':')
  return Number(hours) * 60 + Number(minutes)
}

export function getNextTraining(schedule: TrainingSchedule, now = new Date()): NextTraining | null {
  const berlin = getBerlinDateTimeParts(now)
  const today = `${berlin.year}-${berlin.month}-${berlin.day}`
  const start = new Date(`${today}T12:00:00Z`)
  const currentMinutes = Number(berlin.hour) * 60 + Number(berlin.minute)
  const trainingEnd = parseMinutes(schedule.adultTime)
  let skippedNotice: string | undefined

  for (let offset = 0; offset <= 370; offset++) {
    const candidate = new Date(start)
    candidate.setUTCDate(start.getUTCDate() + offset)

    if (candidate.getUTCDay() !== schedule.weekday) {
      continue
    }

    const date = formatDateKey(candidate)
    if (date === today && currentMinutes > trainingEnd) {
      continue
    }

    const exception = schedule.exceptions?.find((entry) => {
      const until = entry.until || entry.from
      return date >= entry.from && date <= until
    })

    if (exception) {
      skippedNotice ||= exception.label || 'Training entfällt'
      continue
    }

    return {
      date,
      youthTime: schedule.youthTime,
      adultTime: schedule.adultTime,
      notice: skippedNotice,
    }
  }

  return null
}

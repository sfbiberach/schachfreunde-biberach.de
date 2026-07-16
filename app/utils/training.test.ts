import type { TrainingSchedule } from '~~/shared/types/training'
import { describe, expect, it } from 'vitest'
import { getNextTraining } from './training'

const schedule: TrainingSchedule = {
  weekday: 5,
  youthTime: '18:00',
  adultTime: '20:15',
  exceptions: [],
}

describe('getNextTraining', () => {
  it('returns the next regular training day', () => {
    expect(getNextTraining(schedule, new Date('2026-07-15T12:00:00Z'))).toMatchObject({
      date: '2026-07-17',
      youthTime: '18:00',
      adultTime: '20:15',
    })
  })

  it('moves to the following week after the adult training has ended', () => {
    expect(getNextTraining(schedule, new Date('2026-07-17T20:30:00Z'))?.date).toBe('2026-07-24')
  })

  it('skips cancellations and carries their notice into the result', () => {
    expect(getNextTraining({
      ...schedule,
      exceptions: [
        {
          from: '2026-07-17',
          until: '2026-07-31',
          label: 'Sommerpause',
        },
      ],
    }, new Date('2026-07-15T12:00:00Z'))).toMatchObject({
      date: '2026-08-07',
      notice: 'Sommerpause',
    })
  })
})

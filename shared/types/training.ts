export interface TrainingException {
  from: string
  until?: string
  label?: string
}

export interface TrainingSchedule {
  weekday: number
  youthTime: string
  adultTime: string
  exceptions?: TrainingException[]
}

export interface NextTraining {
  date: string
  youthTime: string
  adultTime: string
  notice?: string
}

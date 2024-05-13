import { addHours, set, isWithinInterval } from 'date-fns'

export type OpeningHours = Partial<{
  MONDAY: OpeningHour
  TUESDAY: OpeningHour
  WEDNESDAY: OpeningHour
  THURSDAY: OpeningHour
  FRIDAY: OpeningHour
  SATURDAY: OpeningHour
  SUNDAY: OpeningHour
}>

type OpeningHour = {
  open: string
  close: string
}[]

type OpeningHoursStatusViewmodelParams = {
  openingHours: OpeningHours
  currentDate: Date
}

export type OpeningHoursStatusViewmodelState = 'open' | 'open-soon' | 'close-soon' | 'close'
export type OpeningHoursStatusViewmodel = {
  state: OpeningHoursStatusViewmodelState
  text: string
}

export const getOpeningHoursStatus = ({
  openingHours,
  currentDate,
}: OpeningHoursStatusViewmodelParams): OpeningHoursStatusViewmodel => {
  const currentOpeningHours = openingHours[getHoursFromCurrentDate(currentDate)] || []
  const periods = currentOpeningHours.map(({ open, close }) => {
    const openAt = getDateFromOpeningHour(currentDate, open)
    const closeAt = getDateFromOpeningHour(currentDate, close)
    return createPeriod(openAt, closeAt)
  })
  return getStateFromPeriods(periods, currentDate)
}

const getStateFromPeriods = (
  periods: Period[],
  currentDate: Date,
  index = 0
): OpeningHoursStatusViewmodel => {
  const period = periods[index]
  if (!period) {
    return closeState()
  }

  if (period.isPassed(currentDate)) {
    return getStateFromPeriods(periods, currentDate, index + 1)
  }

  if (period.isOpen(currentDate)) {
    if (period.isClosingSoon(currentDate)) {
      return closeSoonState(period.closeAt)
    }
    return openState(period.closeAt)
  }

  if (period.isOpenningSoon(currentDate)) {
    return openSoonState(period.openAt)
  }

  return getStateFromPeriods(periods, currentDate, index + 1)
}

type Period = ReturnType<typeof createPeriod>

const createPeriod = (openAt: Date, closeAt: Date) => ({
  closeAt,
  openAt,
  isOpeningSoon: (currentDate: Date) => addHours(currentDate, 1) >= openAt,
  isClosingSoon: (currentDate: Date) => addHours(currentDate, 1) >= closeAt,
  isOpen: (currentDate: Date) => isWithinInterval(currentDate, { start: openAt, end: closeAt }),
  isPassed: (currentDate: Date) => currentDate > closeAt,
})

const dayToOpeningHours: Record<number, keyof OpeningHours> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
}

const getHoursFromCurrentDate = (currentDate: Date): keyof OpeningHours => {
  const day = currentDate.getDay()
  const openingHours = dayToOpeningHours[day]
  if (!openingHours) {
    throw new Error('Invalid day')
  }
  return openingHours
}

const getDateFromOpeningHour = (currentDate: Date, openingHour: string): Date => {
  const [hour, minute] = openingHour.split(':').map((value) => parseInt(value))
  return set(currentDate, {
    hours: hour,
    minutes: minute,
  })
}

const closeState = (): OpeningHoursStatusViewmodel => ({
  state: 'close',
  text: 'Fermé',
})

const openState = (openDate: Date): OpeningHoursStatusViewmodel => ({
  state: 'open',
  text: `Ouvert jusqu’à ${formatDate(openDate)}`,
})

const openSoonState = (openDate: Date): OpeningHoursStatusViewmodel => ({
  state: 'open-soon',
  text: `Ouvre bientôt - ${formatDate(openDate)}`,
})

const closeSoonState = (closeDate: Date): OpeningHoursStatusViewmodel => ({
  state: 'close-soon',
  text: `Ferme bientôt - ${formatDate(closeDate)}`,
})

const formatDate = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours}h${minutes ? minutes : ''}`
}

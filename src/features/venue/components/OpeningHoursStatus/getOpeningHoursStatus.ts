import { addHours, set, isWithinInterval } from 'date-fns'

import { OpeningHours } from 'features/venue/types'

type OpeningHoursStatusParams = {
  openingHours: OpeningHours
  currentDate: Date
}

export type OpeningHoursStatusState = 'open' | 'open-soon' | 'close-soon' | 'close'
export type OpeningHoursStatus = {
  state: OpeningHoursStatusState
  text: string
}

export const getOpeningHoursStatus = ({
  openingHours,
  currentDate,
}: OpeningHoursStatusParams): OpeningHoursStatus => {
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
): OpeningHoursStatus => {
  const period = periods[index]
  if (!period) {
    return {
      state: 'close',
      text: 'Fermé',
    }
  }

  if (period.isPassed(currentDate)) {
    return getStateFromPeriods(periods, currentDate, index + 1)
  }

  if (period.isOpen(currentDate)) {
    if (period.isClosingSoon(currentDate)) {
      return {
        state: 'close-soon',
        text: `Ferme bientôt - ${formatDate(period.closeAt)}`,
      }
    }
    return {
      state: 'open',
      text: `Ouvert jusqu’à ${formatDate(period.closeAt)}`,
    }
  }

  if (period.isOpeningSoon(currentDate)) {
    return {
      state: 'open-soon',
      text: `Ouvre bientôt - ${formatDate(period.openAt)}`,
    }
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

const formatDate = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours}h${minutes || ''}`
}

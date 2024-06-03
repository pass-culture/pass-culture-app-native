import { addHours, set, isWithinInterval, subHours } from 'date-fns'

import { OpeningHours, OpeningHoursStatusState } from 'features/venue/types'

type OpeningHoursStatusParams = {
  openingHours: OpeningHours
  currentDate: Date
}

type OpeningHoursStatus = {
  state: OpeningHoursStatusState
  text: string
  nextChange?: Date
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

  const nextDay = addHours(currentDate, 24)
  const nextDayOpeningHour = openingHours[getHoursFromCurrentDate(nextDay)]?.[0]
  const nextDayOpenAt =
    nextDayOpeningHour && getDateFromOpeningHour(nextDay, nextDayOpeningHour.open)

  return getStateFromPeriods(periods, currentDate, nextDayOpenAt)
}

const getStateFromPeriods = (
  periods: Period[],
  currentDate: Date,
  nextDayOpenAt?: Date,
  index = 0
): OpeningHoursStatus => {
  const period = periods[index]
  if (!period) {
    const lastPeriod = periods[periods.length - 1]
    if (lastPeriod && lastPeriod.openAt > currentDate) {
      return {
        state: 'close',
        text: 'Fermé',
        nextChange: subHours(lastPeriod.openAt, 1),
      }
    }

    return {
      state: 'close',
      text: 'Fermé',
      nextChange: nextDayOpenAt && subHours(nextDayOpenAt, 1),
    }
  }

  if (period.isPassed(currentDate)) {
    return getStateFromPeriods(periods, currentDate, nextDayOpenAt, index + 1)
  }

  if (period.isOpen(currentDate)) {
    if (period.isClosingSoon(currentDate)) {
      return {
        state: 'close-soon',
        text: `Ferme bientôt - ${formatDate(period.closeAt)}`,
        nextChange: period.closeAt,
      }
    }
    return {
      state: 'open',
      text: `Ouvert jusqu’à ${formatDate(period.closeAt)}`,
      nextChange: subHours(period.closeAt, 1),
    }
  }

  if (period.isOpeningSoon(currentDate)) {
    return {
      state: 'open-soon',
      text: `Ouvre bientôt - ${formatDate(period.openAt)}`,
      nextChange: period.openAt,
    }
  }

  return getStateFromPeriods(periods, currentDate, nextDayOpenAt, index + 1)
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

const DAY_TO_OPENING_HOURS = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
} as const

const getHoursFromCurrentDate = (currentDate: Date): keyof OpeningHours => {
  const day = currentDate.getDay()
  const openingHours = DAY_TO_OPENING_HOURS[day]
  return openingHours
}

const getDateFromOpeningHour = (currentDate: Date, openingHour: string): Date => {
  const [hour, minute] = openingHour.split(':').map((value) => parseInt(value))
  return set(currentDate, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  })
}

const formatDate = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours}h${minutes || ''}`
}

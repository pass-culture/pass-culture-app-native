import { addHours, set, isWithinInterval, subHours, isSameDay } from 'date-fns'

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

const DAY_NUMBER_TO_DAY_NAME = {
  0: 'dimanche',
  1: 'lundi',
  2: 'mardi',
  3: 'mercredi',
  4: 'jeudi',
  5: 'vendredi',
  6: 'samedi',
} as const

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

  const actualState = getStateFromPeriods(periods, currentDate, nextDayOpenAt)
  const hasOpenDay = Object.values(openingHours).some((value) => !!value)
  const isClosedOrClosingSoon = ['close', 'close-soon'].includes(actualState.state)
  if (isClosedOrClosingSoon && hasOpenDay) {
    const nextOpenDay = getNextOpenDay(currentDate, openingHours)
    const nextDayName = getNextDayName(nextOpenDay, currentDate)

    return {
      ...actualState,
      text: `${actualState.text} - Ouvre ${nextDayName} à ${formatDate(nextOpenDay)}`,
    }
  }
  return actualState
}

const getNextDayName = (nextOpenDay: Date, currentDate: Date): string => {
  const dayName = DAY_NUMBER_TO_DAY_NAME[nextOpenDay.getDay()]

  const isNextOpenDayToday = isSameDay(nextOpenDay, currentDate)
  if (isNextOpenDayToday) return 'aujourd’hui'

  const isNextOpenDayTomorrow = nextOpenDay.getDay() == (currentDate.getDay() + 1) % 7
  if (isNextOpenDayTomorrow) return 'demain'

  const isNextOpenDaySameWeekday = nextOpenDay.getDay() == currentDate.getDay()
  if (isNextOpenDaySameWeekday) return dayName + ' prochain'

  return dayName
}

const getNextOpenDay = (currentDate: Date, openingHours: OpeningHours): Date => {
  const currentDayIndex = getHoursFromCurrentDate(currentDate)
  const nextOpeningHours = openingHours[currentDayIndex] || []
  const nextOpenHours = nextOpeningHours.find(
    ({ open }) => getDateFromOpeningHour(currentDate, open) > currentDate
  )

  if (nextOpenHours) {
    return getDateFromOpeningHour(currentDate, nextOpenHours.open)
  }

  const nextDay = addHours(currentDate, 24)
  nextDay.setHours(0, 0, 0)
  return getNextOpenDay(nextDay, openingHours)
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
      text: `Fermé`,
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

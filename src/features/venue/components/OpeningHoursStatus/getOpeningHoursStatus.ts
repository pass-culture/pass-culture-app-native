import { addHours, set, isWithinInterval, isSameDay, addMilliseconds } from 'date-fns'

import { OpeningHours, OpeningHoursStatusState } from 'features/venue/types'

export const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000
export const ONE_HOUR_IN_MILLISECONDS = 2 * THIRTY_MINUTES_IN_MILLISECONDS

type OpeningHoursStatusParams = {
  openingHours: OpeningHours
  currentDate: Date
}

type OpeningHoursStatus = {
  openingState: OpeningHoursStatusState
  openingLabel: string
  nextChangeTime?: Date
}

export const getOpeningHoursStatus = ({
  openingHours,
  currentDate,
}: OpeningHoursStatusParams): OpeningHoursStatus => {
  const currentOpeningPeriod = getCurrentOpeningPeriod(openingHours, currentDate)
  const nextOpeningPeriod = getNextOpeningPeriod(openingHours, currentDate)
  const { openingState, openingLabel } = computeOpeningState(
    currentOpeningPeriod,
    nextOpeningPeriod,
    currentDate
  )

  const nextChangeTime = getNextChangeTime(currentOpeningPeriod, nextOpeningPeriod)
  return { openingState, openingLabel, nextChangeTime }
}

const getCurrentOpeningPeriod = (
  openingHours: OpeningHours,
  currentDate: Date
): Period | undefined => {
  const currentOpeningPeriods = getOpeningPeriods(openingHours, currentDate)
  return currentOpeningPeriods.find((period) => period.isOpen(currentDate))
}

const getNextOpeningPeriod = (openingHours: OpeningHours, date: Date): Period | undefined => {
  const hasOpenDay = Object.values(openingHours).some((value) => !!value && value.length > 0)
  if (!hasOpenDay) {
    return undefined
  }

  return getFirstOpenPeriodAfterDate(openingHours, date)
}

const getFirstOpenPeriodAfterDate = (openingHours: OpeningHours, date: Date): Period => {
  const openingPeriods = getOpeningPeriods(openingHours, date)
  const nextOpenPeriod = openingPeriods.find((period) => period.openAt > date)

  if (nextOpenPeriod) {
    return nextOpenPeriod
  }

  const nextDay = addHours(date, 24)
  nextDay.setHours(0, 0, 0)
  return getFirstOpenPeriodAfterDate(openingHours, nextDay)
}

const DAY_INDEX_TO_OPENING_HOURS_KEYS = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
} as const

const getOpeningPeriods = (openingHours: OpeningHours, date: Date): Period[] => {
  const dayIndex = date.getDay()
  const dayOfWeek = DAY_INDEX_TO_OPENING_HOURS_KEYS[dayIndex]
  const dayOpeningHours = openingHours[dayOfWeek] || []
  return dayOpeningHours.map(({ close, open }) => createPeriod({ open, close }, date))
}

type Period = ReturnType<typeof createPeriod>

const createPeriod = ({ open, close }: { open: string; close: string }, date: Date) => {
  const closeAt = getDateFromHour(date, close)
  const openAt = getDateFromHour(date, open)
  return {
    closeAt,
    openAt,
    isOpeningSoon: (currentDate: Date) =>
      addMilliseconds(currentDate, ONE_HOUR_IN_MILLISECONDS) >= openAt,
    isClosingSoon: (currentDate: Date) =>
      addMilliseconds(currentDate, ONE_HOUR_IN_MILLISECONDS) >= closeAt,
    isOpen: (currentDate: Date) => isWithinInterval(currentDate, { start: openAt, end: closeAt }),
  }
}

const getDateFromHour = (currentDate: Date, hourString: string): Date => {
  const [hour, minute] = hourString.split(':').map((value) => parseInt(value))
  return set(currentDate, {
    hours: hour,
    minutes: minute,
    seconds: 0,
    milliseconds: 0,
  })
}

const computeOpeningState = (
  currentOpenPeriod: Period | undefined,
  nextOpenPeriod: Period | undefined,
  date: Date
): { openingState: OpeningHoursStatusState; openingLabel: string } => {
  let openingState: OpeningHoursStatusState = 'close'
  let openingLabel = 'Fermé'
  if (!nextOpenPeriod) return { openingState, openingLabel }

  if (currentOpenPeriod) {
    if (currentOpenPeriod.isClosingSoon(date)) {
      openingState = 'close-soon'
      openingLabel = `Ferme bientôt - ${formatHours(currentOpenPeriod.closeAt)}`
    } else {
      openingState = 'open'
      openingLabel = `Ouvert jusqu’à ${formatHours(currentOpenPeriod.closeAt)}`
    }
  } else if (nextOpenPeriod.isOpeningSoon(date)) {
    openingState = 'open-soon'
    openingLabel = `Ouvre bientôt - ${formatHours(nextOpenPeriod.openAt)}`
  }

  if (openingState === 'close' || openingState === 'close-soon') {
    const nextDayName = getNextDayName(nextOpenPeriod.openAt, date)
    openingLabel += ` - Ouvre ${nextDayName} à ${formatHours(nextOpenPeriod.openAt)}`
  }
  return { openingState, openingLabel }
}

const formatHours = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${hours}h${minutes || ''}`
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

const getNextDayName = (nextOpenDate: Date, currentDate: Date): string => {
  const isNextOpenDayToday = isSameDay(nextOpenDate, currentDate)
  if (isNextOpenDayToday) return 'aujourd’hui'

  const isNextOpenDayTomorrow = nextOpenDate.getDay() === (currentDate.getDay() + 1) % 7
  if (isNextOpenDayTomorrow) return 'demain'

  const isNextOpenDaySameWeekday = nextOpenDate.getDay() === currentDate.getDay()
  const dayName = DAY_NUMBER_TO_DAY_NAME[nextOpenDate.getDay()]
  if (isNextOpenDaySameWeekday) return `${dayName} prochain`

  return dayName
}

const getNextChangeTime = (
  currentOpenPeriod: Period | undefined,
  nextOpenPeriod: Period | undefined
): Date | undefined => {
  if (currentOpenPeriod) {
    return currentOpenPeriod.closeAt
  }
  if (nextOpenPeriod) {
    return nextOpenPeriod.openAt
  }
  return undefined
}

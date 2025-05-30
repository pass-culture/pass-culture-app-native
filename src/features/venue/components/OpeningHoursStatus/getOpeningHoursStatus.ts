import {
  addHours,
  addMilliseconds,
  differenceInMinutes,
  format,
  isSameDay,
  isWithinInterval,
} from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

import { OpeningHour, OpeningHours, OpeningHoursStatusState } from 'features/venue/types'

export const THIRTY_MINUTES_IN_MILLISECONDS = 30 * 60 * 1000
export const ONE_HOUR_IN_MILLISECONDS = 2 * THIRTY_MINUTES_IN_MILLISECONDS

type OpeningHoursStatusParams = {
  openingHours: OpeningHours
  currentDate: Date
  timezone: string
}

type OpeningHoursStatus = {
  openingState: OpeningHoursStatusState
  openingLabel: string
  nextChangeTime?: Date
}

export const getOpeningHoursStatus = ({
  openingHours,
  currentDate,
  timezone,
}: OpeningHoursStatusParams): OpeningHoursStatus => {
  const currentDateAtVenueTimezone = utcToZonedTime(currentDate, timezone)
  const currentOpeningPeriod = getCurrentOpeningPeriod(openingHours, currentDateAtVenueTimezone)
  const nextOpeningPeriod = getNextOpeningPeriod(openingHours, currentDateAtVenueTimezone)
  const { openingState, openingLabel } = computeOpeningState(
    currentOpeningPeriod,
    nextOpeningPeriod,
    currentDateAtVenueTimezone
  )

  const nextChangeTime = getNextChangeTime(currentOpeningPeriod, nextOpeningPeriod, timezone)
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

const getFirstOpenPeriodAfterDate = (
  openingHours: OpeningHours,
  date: Date,
  daysAheadChecked = 0
): Period | undefined => {
  const openingPeriods = getOpeningPeriods(openingHours, date)

  const nextOpenPeriod = openingPeriods.find((period) => {
    return period.openAt >= date
  })
  // Avoid infinite loop, 7 days maximum
  if (nextOpenPeriod || daysAheadChecked >= 7) {
    return nextOpenPeriod
  }

  const nextDay = addHours(date, 24)
  nextDay.setHours(0, 0, 0)
  return getFirstOpenPeriodAfterDate(openingHours, nextDay, daysAheadChecked + 1)
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

const createPeriod = ({ open, close }: OpeningHour, date: Date) => {
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
  const date = new Date(currentDate)
  date.setHours(hour || 0, minute, 0, 0)
  return date
}

const computeOpeningState = (
  currentOpenPeriod: Period | undefined,
  nextOpenPeriod: Period | undefined,
  date: Date
): { openingState: OpeningHoursStatusState; openingLabel: string } => {
  const isOvernightEvent = computeIfOvernightEvent(currentOpenPeriod, nextOpenPeriod)

  let openingState: OpeningHoursStatusState = 'close'
  let openingLabel = 'Fermé'
  if (!nextOpenPeriod) return { openingState, openingLabel }

  if (currentOpenPeriod) {
    if (currentOpenPeriod.isClosingSoon(date)) {
      openingState = isOvernightEvent ? 'open' : 'close-soon'
      openingLabel = isOvernightEvent
        ? `Ouvert jusqu’à ${formatHours(nextOpenPeriod.closeAt)}`
        : `Ferme bientôt - ${formatHours(currentOpenPeriod.closeAt)}`
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

const computeIfOvernightEvent = (
  currentOpenPeriod: Period | undefined,
  nextOpenPeriod: Period | undefined
) => {
  if (!currentOpenPeriod || !nextOpenPeriod) return false

  const minutesBetweenCloseAndOpen = differenceInMinutes(
    nextOpenPeriod.openAt,
    currentOpenPeriod.closeAt
  )

  const MAX_ALLOWED_MINUTES = 5
  if (minutesBetweenCloseAndOpen <= MAX_ALLOWED_MINUTES) return true
  return false
}

const formatHours = (date: Date): string => {
  const hours = format(date, 'H')
  const minutes = format(date, 'mm')
  return `${hours}h${minutes == '00' ? '' : minutes}`
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
  nextOpenPeriod: Period | undefined,
  timezone: string
): Date | undefined => {
  if (currentOpenPeriod) {
    return zonedTimeToUtc(currentOpenPeriod.closeAt, timezone)
  }
  if (nextOpenPeriod) {
    return zonedTimeToUtc(nextOpenPeriod.openAt, timezone)
  }
  return undefined
}

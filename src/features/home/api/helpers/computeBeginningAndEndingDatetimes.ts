import {
  addDays,
  endOfDay,
  format,
  isFriday,
  isSaturday,
  isSunday,
  nextFriday,
  nextSunday,
} from 'date-fns'

type Parameters = {
  beginningDatetime?: string
  endingDatetime?: string
  upcomingWeekendEvent?: boolean
  eventDuringNextXDays?: number
  currentWeekEvent?: boolean
}
export const computeBeginningAndEndingDatetimes = ({
  beginningDatetime,
  endingDatetime,
  upcomingWeekendEvent,
  eventDuringNextXDays,
  currentWeekEvent,
}: Parameters): {
  beginningDatetime: string | undefined
  endingDatetime: string | undefined
} => {
  if (beginningDatetime || endingDatetime) {
    return computeDatetimes(beginningDatetime, endingDatetime)
  }
  if (upcomingWeekendEvent) {
    return computeUpcomingWeekendDatetimes()
  }
  if (eventDuringNextXDays) {
    return computeDuringNextXDaysDatetimes(eventDuringNextXDays)
  }
  if (currentWeekEvent) {
    return computeCurrentWeekDatetimes()
  }

  return {
    beginningDatetime: undefined,
    endingDatetime: undefined,
  }
}

const formatDateToContentfulAndAlgoliaFormat = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mmxxx")
}

const computeUpcomingWeekendDatetimes = () => {
  const now = new Date()
  const isInWeekend = (isFriday(now) && now.getHours() > 14) || isSaturday(now) || isSunday(now)

  const thisFriday = nextFriday(now)
  thisFriday.setHours(14) // corresponds to 3pm (CET)

  const computedBeginningDatetime = isInWeekend ? now : thisFriday
  const computedEndingDatetime = endOfDay(nextSunday(now))

  return {
    beginningDatetime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDatetime),
    endingDatetime: formatDateToContentfulAndAlgoliaFormat(computedEndingDatetime),
  }
}

const computeDuringNextXDaysDatetimes = (eventInNextXDays: number) => {
  const computedBeginningDatetime = new Date()
  const computedEndingDatetime = addDays(computedBeginningDatetime, eventInNextXDays)

  return {
    beginningDatetime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDatetime),
    endingDatetime: formatDateToContentfulAndAlgoliaFormat(computedEndingDatetime),
  }
}
const computeCurrentWeekDatetimes = () => {
  const computedBeginningDatetime = new Date()
  const computedEndingDatetime = endOfDay(nextSunday(computedBeginningDatetime))

  return {
    beginningDatetime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDatetime),
    endingDatetime: formatDateToContentfulAndAlgoliaFormat(computedEndingDatetime),
  }
}

const computeDatetimes = (
  beginningDatetime: string | undefined,
  endingDatetime: string | undefined
) => ({
  beginningDatetime: beginningDatetime
    ? formatDateToContentfulAndAlgoliaFormat(new Date(beginningDatetime))
    : undefined,
  endingDatetime: endingDatetime
    ? formatDateToContentfulAndAlgoliaFormat(new Date(endingDatetime))
    : undefined,
})

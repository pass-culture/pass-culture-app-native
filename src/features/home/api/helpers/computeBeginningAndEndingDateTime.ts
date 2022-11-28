import { addDays, endOfDay, format, nextSunday } from 'date-fns'

export const computeBeginningAndEndingDatetime = (
  beginningDatetime?: string,
  endingDatetime?: string,
  eventInNextXDays?: number,
  currentWeekEvent?: boolean
): {
  beginningDatetime: string | undefined
  endingDatetime: string | undefined
} => {
  if (beginningDatetime || endingDatetime) {
    return computeDatetimes(beginningDatetime, endingDatetime)
  }
  if (eventInNextXDays) {
    return computeEventInNextDaysDatetimes(eventInNextXDays)
  }
  if (currentWeekEvent) {
    return computeCurrentWeekEventDatetimes()
  }

  return {
    beginningDatetime: undefined,
    endingDatetime: undefined,
  }
}

const formatDateToContentfulAndAlgoliaFormat = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mmxxx")
}

const computeEventInNextDaysDatetimes = (eventInNextXDays: number) => {
  const computedBeginningDatetime = new Date()
  const computedEndingDatetime = addDays(computedBeginningDatetime, eventInNextXDays)

  return {
    beginningDatetime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDatetime),
    endingDatetime: formatDateToContentfulAndAlgoliaFormat(computedEndingDatetime),
  }
}
const computeCurrentWeekEventDatetimes = () => {
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

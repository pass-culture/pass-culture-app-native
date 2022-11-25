import { addDays, endOfDay, format, nextSunday } from 'date-fns'

export const computeBeginningAndEndingDateTime = (
  beginningDateTime?: string,
  endingDateTime?: string,
  eventInNextXDays?: number,
  currentWeekEvent?: boolean
): {
  beginningDateTime: string | undefined
  endingDateTime: string | undefined
} => {
  if (beginningDateTime || endingDateTime) {
    return computeDateTimes(beginningDateTime, endingDateTime)
  }
  if (eventInNextXDays) {
    return computeEventInNextDaysDateTimes(eventInNextXDays)
  }
  if (currentWeekEvent) {
    return computeCurrentWeekEventDateTimes()
  }

  return {
    beginningDateTime: undefined,
    endingDateTime: undefined,
  }
}

const formatDateToContentfulAndAlgoliaFormat = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mmxxx")
}

const computeEventInNextDaysDateTimes = (eventInNextXDays: number) => {
  const computedBeginningDateTime = new Date()
  const computedEndingDateTime = addDays(computedBeginningDateTime, eventInNextXDays)

  return {
    beginningDateTime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDateTime),
    endingDateTime: formatDateToContentfulAndAlgoliaFormat(computedEndingDateTime),
  }
}
const computeCurrentWeekEventDateTimes = () => {
  const computedBeginningDateTime = new Date()
  const computedEndingDateTime = endOfDay(nextSunday(computedBeginningDateTime))

  return {
    beginningDateTime: formatDateToContentfulAndAlgoliaFormat(computedBeginningDateTime),
    endingDateTime: formatDateToContentfulAndAlgoliaFormat(computedEndingDateTime),
  }
}

const computeDateTimes = (
  beginningDateTime: string | undefined,
  endingDateTime: string | undefined
) => ({
  beginningDateTime: beginningDateTime
    ? formatDateToContentfulAndAlgoliaFormat(new Date(beginningDateTime))
    : undefined,
  endingDateTime: endingDateTime
    ? formatDateToContentfulAndAlgoliaFormat(new Date(endingDateTime))
    : undefined,
})

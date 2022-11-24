import { addDays, format } from 'date-fns'

export const computeBeginningAndEndingDateTime = (
  beginningDateTime?: string,
  endingDateTime?: string,
  eventInNextXDays?: number
): {
  beginningDateTime: string | undefined
  endingDateTime: string | undefined
} => {
  if (beginningDateTime || endingDateTime) {
    return {
      beginningDateTime: beginningDateTime
        ? formatDateToContentfulAndAlgoliaFormat(new Date(beginningDateTime))
        : undefined,
      endingDateTime: endingDateTime
        ? formatDateToContentfulAndAlgoliaFormat(new Date(endingDateTime))
        : undefined,
    }
  }
  if (eventInNextXDays) {
    const today = new Date()
    const computedBeginingDateTime = today
    const computedEndingDateTime = addDays(today, eventInNextXDays)

    return {
      beginningDateTime: formatDateToContentfulAndAlgoliaFormat(computedBeginingDateTime),
      endingDateTime: formatDateToContentfulAndAlgoliaFormat(computedEndingDateTime),
    }
  }
  return {
    beginningDateTime: undefined,
    endingDateTime: undefined,
  }
}

const formatDateToContentfulAndAlgoliaFormat = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mmxxx")
}

import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'

export const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) => {
  if (!lastUpdatedDate) return
  const utcDate = new Date(lastUpdatedDate)
  const timeZoneOffest = new Date(lastUpdatedDate).getTimezoneOffset()
  const localDate = utcDate.setMinutes(utcDate.getMinutes() - timeZoneOffest)
  const day = formatToSlashedFrenchDate(new Date(localDate).toISOString())
  const hour = formatToHour(new Date(localDate))
  return `${day} à ${hour}`
}

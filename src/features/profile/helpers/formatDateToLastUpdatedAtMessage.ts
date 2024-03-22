import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour, localizeUTCDate } from 'libs/parsers/formatDates'

export const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | Date | undefined) => {
  if (!lastUpdatedDate) return
  const localDate = new Date(localizeUTCDate(lastUpdatedDate))
  const day = formatToSlashedFrenchDate(localDate)
  const hour = formatToHour(localDate)
  return `${day} à ${hour}`
}

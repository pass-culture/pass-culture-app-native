import { formatToSlashedFrenchDate } from 'libs/dates'
import { formatToHour } from 'libs/parsers/formatDates'

export const formatDateToLastUpdatedAtMessage = (lastUpdatedDate: string | undefined) => {
  if (!lastUpdatedDate) return
  const day = formatToSlashedFrenchDate(new Date(lastUpdatedDate).toISOString())
  const hour = formatToHour(new Date(lastUpdatedDate))
  return `${day} à ${hour}`
}

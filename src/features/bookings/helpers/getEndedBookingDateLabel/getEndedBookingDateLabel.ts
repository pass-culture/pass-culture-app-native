import { formatToSlashedFrenchDate } from 'libs/dates'

export function getEndedBookingDateLabel(
  cancellationDate?: string | null,
  dateUsed?: string | null
) {
  const endDate = dateUsed ?? cancellationDate
  if (endDate) return `le ${formatToSlashedFrenchDate(endDate)}`
  return null
}

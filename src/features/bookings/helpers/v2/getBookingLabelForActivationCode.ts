import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'

export const getBookingLabelForActivationCode = (expirationDate: string | null) => {
  if (expirationDate) {
    const dateLimit = formatToCompleteFrenchDate(new Date(expirationDate), false)
    return `À activer avant le ${dateLimit}`
  }

  return 'À activer'
}

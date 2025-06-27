import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'

export const getBookingLabelForActivationCode = (expirationDate: string | null) => {
  if (expirationDate) {
    const dateLimit = formatToCompleteFrenchDate({
      date: new Date(expirationDate),
      shouldDisplayWeekDay: false,
    })
    return `À activer avant le ${dateLimit}`
  }

  return 'À activer'
}

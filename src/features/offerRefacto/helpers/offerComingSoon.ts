import { isAfter } from 'date-fns'

export const getIsAComingSoonOffer = (
  bookingAllowedDatetime: string | number | null | undefined
): boolean => {
  if (!bookingAllowedDatetime) return false

  const date =
    typeof bookingAllowedDatetime === 'number'
      ? new Date(bookingAllowedDatetime * 1000)
      : new Date(bookingAllowedDatetime)

  return isAfter(date, new Date())
}

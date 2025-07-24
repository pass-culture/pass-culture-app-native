import { isAfter } from 'date-fns'

export const getIsAComingSoonOffer = (
  bookingAllowedDatetime: string | null | undefined,
  isReleased?: boolean
): boolean =>
  !isReleased && !!bookingAllowedDatetime && isAfter(new Date(bookingAllowedDatetime), new Date())

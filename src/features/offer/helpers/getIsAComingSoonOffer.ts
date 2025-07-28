import { isAfter } from 'date-fns'

export const getIsAComingSoonOffer = (bookingAllowedDatetime: string | null | undefined): boolean =>
  !!bookingAllowedDatetime && isAfter(new Date(bookingAllowedDatetime), new Date())

import { BookingReponse } from 'api/gen'
import { BookingsStatus } from 'features/bookings/enum'
import { Valid } from 'ui/svg/icons/Valid'
import { Wrong } from 'ui/svg/icons/Wrong'

export type BookingProperties = {
  isDuo?: boolean
  isEvent?: boolean
  isPhysical?: boolean
  isDigital?: boolean
  isPermanent?: boolean
  hasActivationCode?: boolean
}

export type Booking = BookingReponse

export type BookingsStatusValue = `${BookingsStatus}Bookings`

export type EndedBookingReason = {
  title: string
  icon: typeof Valid | typeof Wrong
  type: 'Valid' | 'Error'
}

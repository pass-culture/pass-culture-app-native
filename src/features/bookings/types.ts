import { BookingReponse } from 'api/gen'
import { BookingsStatus } from 'features/bookings/enum'

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

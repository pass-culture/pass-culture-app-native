import { BookingReponse } from 'api/gen'

export type MovieScreeningBookingData = {
  date: Date
  hour: number
  stockId: number
}

export type MovieScreeningUserData = {
  hasNotCompletedSubscriptionYet?: boolean
  isUserLoggedIn?: boolean
  isUserEligible?: boolean
  isUserCreditExpired?: boolean
  hasEnoughCredit?: boolean
  hasBookedOffer?: boolean
  bookings?: BookingReponse
}

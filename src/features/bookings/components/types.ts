import { BookingReponse } from 'api/gen'

export type Booking = BookingReponse

export interface BookingItemProps {
  booking: Booking
}

export enum OFFER_WITHDRAWAL_TYPE_OPTIONS {
  ON_SITE = 'on_site',
  NO_TICKET = 'no_ticket',
  BY_EMAIL = 'by_email',
}

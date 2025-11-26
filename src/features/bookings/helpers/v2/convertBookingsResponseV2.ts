import {
  BookingListItemResponse,
  BookingResponse,
  BookingsListResponseV2,
  BookingsResponseV2,
} from 'api/gen'
import { BookingsStatusValue } from 'features/bookings/types'

export const convertBookingsResponseV2 = (
  bookings: BookingsResponseV2,
  status: BookingsStatusValue
): BookingsListResponseV2 => ({
  bookings: bookings[status].map(convertBooking),
})

const convertBooking = (booking: BookingResponse): BookingListItemResponse => ({
  ...booking,
  activationCode: booking.ticket.activationCode,
  stock: {
    ...booking.stock,
    offer: {
      ...booking.stock.offer,
      withdrawalType: booking.ticket.withdrawal.type,
      withdrawalDelay: booking.ticket.withdrawal.delay,
      imageUrl: booking.stock.offer.image?.url,
    },
  },
})

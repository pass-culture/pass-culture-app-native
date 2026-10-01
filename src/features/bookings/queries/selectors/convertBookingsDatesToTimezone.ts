import {
  BookingsResponseV2,
  BookingResponse,
  BookingListItemResponse,
  BookingsListResponseV2,
} from 'api/gen'
import { getTimeZonedDate } from 'libs/parsers/formatDates'

type Bookings = BookingResponse | BookingListItemResponse

const convertBookingsListDatesToTimezone = <T extends Bookings>(bookings: T[]): T[] => {
  if (!bookings.length) {
    return bookings
  }

  return bookings.map((booking) => convertBookingResponseDateToTimezone(booking))
}

const checkBookingsList = <T extends Bookings>(bookings: T[]): T[] =>
  Array.isArray(bookings) ? bookings : []

export const convertBookingResponseDateToTimezone = <T extends Bookings>(booking: T): T => {
  if (!('stock' in booking)) {
    return booking
  }

  const timezone = booking.stock.offer.address?.timezone ?? booking.stock.offer.venue.timezone
  return {
    ...booking,
    stock: {
      ...booking.stock,
      beginningDatetime: booking.stock.beginningDatetime
        ? getTimeZonedDate({
            date: new Date(booking.stock.beginningDatetime),
            timezone,
          }).toISOString()
        : null,
    },
  }
}

export const convertBookingsResponseV2DatesToTimezone = (
  bookings: BookingsResponseV2
): BookingsResponseV2 => ({
  hasBookingsAfter18: bookings.hasBookingsAfter18,
  ongoingBookings: convertBookingsListDatesToTimezone(checkBookingsList(bookings.ongoingBookings)),
  endedBookings: convertBookingsListDatesToTimezone(checkBookingsList(bookings.endedBookings)),
})

export const convertBookingsListResponseV2DatesToTimezone = (
  bookingsResponse: BookingsListResponseV2
): BookingsListResponseV2 => ({
  ...bookingsResponse,
  bookings: convertBookingsListDatesToTimezone(checkBookingsList(bookingsResponse.bookings)),
})

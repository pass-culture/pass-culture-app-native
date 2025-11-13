import { BookingsResponseV2, BookingResponse } from 'api/gen'
import { getTimeZonedDate } from 'libs/parsers/formatDates'

const convertBookingsListDatesToTimezone = (bookings: BookingResponse[]): BookingResponse[] => {
  return bookings?.map(convertBookingDateToTimezone)
}

export const convertBookingDateToTimezone = (booking: BookingResponse): BookingResponse => {
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
): BookingsResponseV2 => {
  return {
    hasBookingsAfter18: bookings.hasBookingsAfter18,
    ongoingBookings: convertBookingsListDatesToTimezone(bookings.ongoingBookings),
    endedBookings: convertBookingsListDatesToTimezone(bookings.endedBookings),
  }
}

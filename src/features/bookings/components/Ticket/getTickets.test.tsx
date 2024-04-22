import { BookingsResponse } from 'api/gen'
import { getTickets } from 'features/bookings/components/Ticket/getTickets'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'

const booking: BookingsResponse['ongoing_bookings'][number] = bookingsSnap.ongoing_bookings[1]

describe('getTickets', () => {
  it('should not display any ticket when external bookings is null', () => {
    booking.externalBookings = null

    const { tickets } = getTickets({ booking })

    expect(tickets).toEqual([])
  })

  it('should display ticket without external booking when there is no external bookings', () => {
    booking.externalBookings = []

    const { tickets } = getTickets({ booking })

    expect(tickets).toHaveLength(1)
  })

  it('should display as many tickets as there are external bookings', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]

    const { tickets } = getTickets({ booking })

    expect(tickets).toHaveLength(2)
  })

  it('should not display the seat number if there are one external bookings', () => {
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]

    const { tickets } = getTickets({ booking })
    const ticket = tickets[0]

    expect(ticket?.props.externalBookings.seatIndex).toEqual(undefined)
  })

  it('should display the seat number on the total number of seats', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: null },
    ]

    const { tickets } = getTickets({ booking })

    const firstTicket = tickets[0]
    const secondTicket = tickets[1]

    expect(firstTicket?.props.externalBookings.seatIndex).toEqual('1/2')

    expect(secondTicket?.props.externalBookings.seatIndex).toEqual('2/2')
  })

  it('should display only 2 tickets according to the default value (2) of max number of seats to display', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
    ]

    const { tickets } = getTickets({
      booking,
    })

    expect(tickets).toHaveLength(2)
  })

  it('should display the number of seats according to the value of max number of seats to display', () => {
    const maxNumberOfTicketsToDisplay = 3

    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A15' },
    ]

    const { tickets } = getTickets({
      booking,
      maxNumberOfTicketsToDisplay,
    })

    expect(tickets).toHaveLength(maxNumberOfTicketsToDisplay)
  })
})

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { getMultipleTickets } from 'features/bookings/components/SwiperTickets/getMultipleTickets'

const booking = bookingsSnap.ongoing_bookings[1]
const activationCodeFeatureEnabled = true

describe('getMultipleTickets', () => {
  it('should not display any ticket when external bookings is null', () => {
    booking.externalBookings = null

    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })

    expect(tickets).toEqual([])
  })

  it('should display ticket without external booking when there is no external bookings', () => {
    booking.externalBookings = []

    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })

    expect(tickets.length).toEqual(1)
  })

  it('should display as many tickets as there are external bookings', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]

    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })

    expect(tickets.length).toEqual(2)
  })

  it('should not display the seat number if there are one external bookings', () => {
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]

    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
    const ticket = tickets[0]

    expect(ticket.props.externalBookings.seatIndex).toEqual(undefined)
  })

  it('should display the seat number on the total number of seats', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: null },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
    ]

    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })

    const firstTicket = tickets[0]
    const secondTicket = tickets[1]
    const thirdTicket = tickets[2]
    expect(firstTicket.props.externalBookings.seatIndex).toEqual('1/3')
    expect(secondTicket.props.externalBookings.seatIndex).toEqual('2/3')
    expect(thirdTicket.props.externalBookings.seatIndex).toEqual('3/3')
  })
})

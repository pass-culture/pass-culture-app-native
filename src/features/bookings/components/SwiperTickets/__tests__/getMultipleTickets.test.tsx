import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { getMultipleTickets } from 'features/bookings/components/SwiperTickets/getMultipleTickets'

const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]
const activationCodeFeatureEnabled = true

describe('getMultipleTickets', () => {
  it('should return one ticket if externalBookingsInfos.length === 1', () => {
    booking.externalBookingsInfos = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
    expect(tickets.length).toEqual(1)
  })

  it('should return two tickets if externalBookingsInfos.length === 2', () => {
    booking.externalBookingsInfos = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
    expect(tickets.length).toEqual(2)
  })

  it('should not return tickets if externalBookingsInfos.length === 0', () => {
    booking.externalBookingsInfos = undefined
    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
    expect(tickets).toEqual([])
  })

  it('should return the correct seat index', () => {
    booking.externalBookingsInfos = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: null },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
    ]
    const { tickets } = getMultipleTickets({ booking, activationCodeFeatureEnabled })
    const firstTicket = tickets[0]
    const secondTicket = tickets[1]
    const thirdTicket = tickets[2]

    expect(firstTicket.props.externalBookingsInfos.seatIndex).toEqual('1/2')
    expect(secondTicket.props.externalBookingsInfos.seatIndex).toEqual(null)
    expect(thirdTicket.props.externalBookingsInfos.seatIndex).toEqual('2/2')
  })
})

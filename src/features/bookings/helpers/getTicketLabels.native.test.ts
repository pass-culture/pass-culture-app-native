import { BookingResponse, WithdrawalTypeEnum } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getTicketLabels } from 'features/bookings/helpers/getTicketLabels'
import { BookingProperties } from 'features/bookings/types'

const booking = bookingsSnapV2.endedBookings[0] as BookingResponse

const eventProperties: BookingProperties = {
  isDuo: false,
  isEvent: true,
  isPhysical: false,
  isDigital: false,
  isPermanent: false,
  hasActivationCode: false,
}

const digitalProperties: BookingProperties = {
  ...eventProperties,
  isEvent: false,
  isDigital: true,
}

const withTicketWithdrawal = (type: WithdrawalTypeEnum): BookingResponse => ({
  ...booking,
  ticket: { ...booking.ticket, withdrawal: { ...booking.ticket.withdrawal, type } },
})

describe('getTicketLabels', () => {
  it('should return the day and the hour for an event', () => {
    const { day, hour } = getTicketLabels(booking, eventProperties, booking.ticket)

    expect(day).toEqual(expect.any(String))
    expect(hour).toEqual(expect.any(String))
  })

  it('should not return the day and the hour when the booking is not an event', () => {
    const { day, hour } = getTicketLabels(booking, digitalProperties, booking.ticket)

    expect(day).toBeUndefined()
    expect(hour).toBeUndefined()
  })

  it('should return both expiration date labels with their prefix', () => {
    const bookingWithExpiration = { ...booking, expirationDate: '2021-03-20T10:00:00Z' }

    const { topExpirationDate, bottomExpirationDate } = getTicketLabels(
      bookingWithExpiration,
      eventProperties,
      booking.ticket
    )

    expect(topExpirationDate).toMatch(/^À récupérer avant le /)
    expect(bottomExpirationDate).toMatch(/^avant le /)
  })

  it('should not return expiration date labels without expiration date', () => {
    const { topExpirationDate, bottomExpirationDate } = getTicketLabels(
      { ...booking, expirationDate: null },
      eventProperties,
      booking.ticket
    )

    expect(topExpirationDate).toBeUndefined()
    expect(bottomExpirationDate).toBeUndefined()
  })

  it('should return the withdraw label for an on-site withdrawal', () => {
    const onSiteBooking = withTicketWithdrawal(WithdrawalTypeEnum.on_site)

    const { withdrawLabel } = getTicketLabels(onSiteBooking, eventProperties, onSiteBooking.ticket)

    expect(withdrawLabel).toEqual(expect.any(String))
  })

  it('should not return a withdraw label for another withdrawal type', () => {
    const byEmailBooking = withTicketWithdrawal(WithdrawalTypeEnum.by_email)

    const { withdrawLabel } = getTicketLabels(
      byEmailBooking,
      eventProperties,
      byEmailBooking.ticket
    )

    expect(withdrawLabel).toBeUndefined()
  })

  it('should return the offer full address when the offer has an address', () => {
    const { offerFullAddress } = getTicketLabels(booking, eventProperties, booking.ticket)

    expect(offerFullAddress).toContain('Drancy')
  })

  it('should not return an offer full address when the offer has no address', () => {
    const bookingWithoutAddress: BookingResponse = {
      ...booking,
      stock: { ...booking.stock, offer: { ...booking.stock.offer, address: null } },
    }

    const { offerFullAddress } = getTicketLabels(
      bookingWithoutAddress,
      eventProperties,
      booking.ticket
    )

    expect(offerFullAddress).toBeUndefined()
  })

  it('should return the ean when the offer has one', () => {
    const bookingWithEan: BookingResponse = {
      ...booking,
      stock: { ...booking.stock, offer: { ...booking.stock.offer, extraData: { ean: '123' } } },
    }

    expect(getTicketLabels(bookingWithEan, eventProperties, booking.ticket).ean).toBe('123')
  })
})

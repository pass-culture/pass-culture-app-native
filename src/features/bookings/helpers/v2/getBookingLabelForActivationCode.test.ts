import { getBookingLabelForActivationCodeV2 } from 'features/bookings/helpers'

describe('getBookingLabelForActivationCode', () => {
  it('should display the date in the label', () => {
    const label = getBookingLabelForActivationCodeV2.getBookingLabelForActivationCode(
      '2028-03-15T23:01:37.925926'
    )

    expect(label).toEqual('À activer avant le 15 mars 2028')
  })

  it('should only display "A activer" for empty expiration date', () => {
    const label = getBookingLabelForActivationCodeV2.getBookingLabelForActivationCode('')

    expect(label).toEqual('À activer')
  })

  it('should only display "A activer" for null expiration date', () => {
    const label = getBookingLabelForActivationCodeV2.getBookingLabelForActivationCode(null)

    expect(label).toEqual('À activer')
  })
})

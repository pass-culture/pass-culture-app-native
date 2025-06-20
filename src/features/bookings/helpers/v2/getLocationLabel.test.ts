import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getLocationLabelV2 } from 'features/bookings/helpers'

describe('getLocationLabel', () => {
  const initialBooking = bookingsSnapV2.ongoingBookings[1]
  const addressLabel = initialBooking.stock.offer.address.label
  const addressCity = initialBooking.stock.offer.address.city
  const venueName = initialBooking.stock.offer.venue.name

  it('should return empty string if permanent offer', () => {
    const properties = {
      isPermanent: true,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      addressLabel ?? undefined,
      addressCity,
      venueName
    )

    expect(offerRules).toEqual('')
  })

  it('should return empty string if digital offer', () => {
    const properties = {
      isDigital: true,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      addressLabel ?? undefined,
      addressCity,
      venueName
    )

    expect(offerRules).toEqual('')
  })

  it('should display the address label when it is specified', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      'Maison de la Briquette',
      addressCity,
      venueName
    )

    expect(offerRules).toEqual('Maison de la Briquette, Drancy')
  })

  it('should display the name of the venue when address label is not present', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      undefined,
      addressCity,
      venueName
    )

    expect(offerRules).toEqual('Maison de la Brique, Drancy')
  })

  it('should display only the name of the venue when city not specified in address', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      addressLabel ?? undefined,
      undefined,
      venueName
    )

    expect(offerRules).toEqual('Maison de la Brique')
  })

  it('should display only the name of the venue when city specified and is an empty string in address', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const offerRules = getLocationLabelV2.getLocationLabel(
      properties,
      addressLabel ?? undefined,
      '',
      venueName
    )

    expect(offerRules).toEqual('Maison de la Brique')
  })
})

import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getLocationLabel } from 'features/bookings/helpers'

describe('getLocationLabel', () => {
  const initialBooking = bookingsSnap.ongoing_bookings[1]

  it('should return empty string if permanent offer', () => {
    const properties = {
      isPermanent: true,
    }
    const offerRules = getLocationLabel(initialBooking.stock, properties)
    expect(offerRules).toEqual('')
  })

  it('should return empty string if digital offer', () => {
    const properties = {
      isDigital: true,
    }
    const offerRules = getLocationLabel(initialBooking.stock, properties)
    expect(offerRules).toEqual('')
  })

  it('should display the name of the venue when public name is not specified', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }
    const offerRules = getLocationLabel(initialBooking.stock, properties)
    expect(offerRules).toEqual('Maison de la Brique, Drancy')
  })

  it('should display the name of the venue when public name specified and is an empty string', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        offer: {
          ...initialBooking.stock.offer,
          venue: {
            ...initialBooking.stock.offer.venue,
            publicName: '',
          },
        },
      },
    }
    const offerRules = getLocationLabel(booking.stock, properties)
    expect(offerRules).toEqual('Maison de la Brique, Drancy')
  })

  it('should display the name of the venue when public name specified and is null', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        offer: {
          ...initialBooking.stock.offer,
          venue: {
            ...initialBooking.stock.offer.venue,
            publicName: null,
          },
        },
      },
    }
    const offerRules = getLocationLabel(booking.stock, properties)
    expect(offerRules).toEqual('Maison de la Brique, Drancy')
  })

  it('should display the public name of the venue when is specified and is not an empty string', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }

    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        offer: {
          ...initialBooking.stock.offer,
          venue: {
            ...initialBooking.stock.offer.venue,
            publicName: 'Maison de la Brique public',
          },
        },
      },
    }

    const offerRules = getLocationLabel(booking.stock, properties)
    expect(offerRules).toEqual('Maison de la Brique public, Drancy')
  })
})

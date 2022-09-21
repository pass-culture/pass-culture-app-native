import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { getLocationLabel } from 'features/bookings/getLocationLabel'

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

  it('should display the name of the venue when public name is not set', () => {
    const properties = {
      isPermanent: false,
      isDigital: false,
    }
    const offerRules = getLocationLabel(initialBooking.stock, properties)
    expect(offerRules).toEqual('Maison de la Brique, Drancy')
  })

  it('should display the public name of the venue if informed', () => {
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

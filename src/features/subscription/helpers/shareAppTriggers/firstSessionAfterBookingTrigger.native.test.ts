import { BookingsResponse, SubcategoryIdEnum } from 'api/gen'

import { firstSessionAfterBookingTrigger } from './firstSessionAfterBookingTrigger'

const booking: BookingsResponse['ongoing_bookings'][0] = {
  id: 123,
  cancellationDate: null,
  cancellationReason: null,
  confirmationDate: '2021-03-15T23:01:37.925926',
  dateCreated: '2021-02-15T23:01:37.925926',
  dateUsed: null,
  expirationDate: null,
  totalAmount: 1900,
  token: '352UW4',
  quantity: 10,
  qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
  stock: {
    id: 150230,
    beginningDatetime: '2021-03-15T20:00:00',
    price: 400,
    priceCategoryLabel: 'Cat 4',
    features: ['VOSTFR', '3D', 'IMAX'],
    offer: {
      id: 147874,
      bookingContact: null,
      name: 'Avez-vous déjà vu\u00a0?',
      extraData: {
        ean: '123456789',
      },
      isPermanent: false,
      isDigital: true,
      subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
      venue: {
        id: 2185,
        city: 'Drancy',
        name: 'Maison de la Brique',
        coordinates: {
          latitude: 48.91683,
          longitude: 2.43884,
        },
        address: '1 boulevard de la brique',
        postalCode: '93700',
        timezone: 'Europe/Paris',
      },
      withdrawalDetails: null,
    },
  },
  externalBookings: [],
}

describe('First session after booking trigger', () => {
  it('should be true when first session after last booking was consumed', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const dateUsed = new Date('2024-07-26T12:00:00').toISOString()
    const shouldTrigger = firstSessionAfterBookingTrigger({
      currentDate,
      ongoingBookings: [{ ...booking, dateUsed }],
    })()

    expect(shouldTrigger).toBe(true)
  })

  it('should be false when last booking was NOT consumed', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const dateUsed = undefined
    const shouldTrigger = firstSessionAfterBookingTrigger({
      currentDate,
      ongoingBookings: [{ ...booking, dateUsed }],
    })()

    expect(shouldTrigger).toBe(false)
  })
})

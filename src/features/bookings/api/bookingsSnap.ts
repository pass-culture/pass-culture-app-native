import { BookingCancellationReasons, BookingsResponse, SubcategoryIdEnum } from 'api/gen'

export const bookingsSnap: BookingsResponse = {
  ended_bookings: [
    {
      id: 321,
      cancellationDate: '2021-03-15T23:01:37.925926',
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
      confirmationDate: '2021-02-15T23:01:37.925926',
      dateUsed: null,
      expirationDate: null,
      totalAmount: 1900,
      token: '352UW5',
      quantity: 10,
      stock: {
        id: 150230,
        beginningDatetime: '2021-03-14T20:00:00',
        offer: {
          id: 147874,
          name: 'Avez-vous déjà vu ?',
          extraData: null,
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
          },
          withdrawalDetails: null,
        },
      },
    },
  ],
  ongoing_bookings: [
    {
      id: 123,
      cancellationDate: null,
      cancellationReason: null,
      confirmationDate: '2021-03-15T23:01:37.925926',
      dateUsed: null,
      expirationDate: null,
      totalAmount: 1900,
      token: '352UW4',
      quantity: 10,
      qrCodeData: 'PASSCULTURE:v3;TOKEN:352UW4',
      stock: {
        id: 150230,
        beginningDatetime: '2021-03-15T20:00:00',
        offer: {
          id: 147874,
          name: 'Avez-vous déjà vu ?',
          extraData: {
            isbn: '123456789',
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
          },
          withdrawalDetails: null,
        },
      },
    },
  ],
}

export const emptyBookingsSnap: BookingsResponse = {
  ended_bookings: [],
  ongoing_bookings: [],
}

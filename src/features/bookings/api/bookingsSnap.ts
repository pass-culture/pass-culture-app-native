import { BookingsResponse, CategoryNameEnum, CategoryType } from 'api/gen'

export const bookingsSnap: BookingsResponse = {
  ended_bookings: [],
  ongoing_bookings: [
    {
      id: 123,
      cancellationDate: null,
      cancellationReason: null,
      confirmationDate: new Date('2021-03-15T23:01:37.925926'),
      dateUsed: null,
      expirationDate: null,
      totalAmount: 1900,
      token: '352UW4',
      stock: {
        id: 150230,
        beginningDatetime: new Date('2021-03-15T20:00:00'),
        offer: {
          id: 147874,
          name: 'Avez-vous déjà vu ?',
          category: {
            categoryType: CategoryType.Event,
            label: 'Pratique artistique',
            name: CategoryNameEnum.LECON,
          },
          extraData: null,
          isPermanent: false,
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

import {
  BookingCancellationReasons,
  BookingsResponse,
  SubcategoryIdEnum,
  WithdrawalTypeEnum,
} from 'api/gen'

export const bookingsSnap: BookingsResponse = {
  ended_bookings: [
    {
      id: 321,
      cancellationDate: '2021-03-15T23:01:37.925926',
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
      confirmationDate: '2021-02-15T23:01:37.925926',
      dateCreated: '2021-02-15T23:01:37.925926',
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
          name: 'Avez-vous déjà vu\u00a0?',
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
            address: '1 boulevard de la brique',
            postalCode: '93700',
            publicName: 'Maison de la Brique en mousse',
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
        offer: {
          id: 147874,
          name: 'Avez-vous déjà vu\u00a0?',
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
            address: '1 boulevard de la brique',
            postalCode: '93700',
          },
          withdrawalDetails: null,
        },
      },
      externalBookings: [],
    },
    {
      id: 124,
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
        offer: {
          id: 147874,
          name: 'Avez-vous déjà vu\u00a0?',
          extraData: {
            isbn: '123456789',
          },
          isPermanent: false,
          isDigital: false,
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
          },
          withdrawalDetails: null,
          withdrawalType: WithdrawalTypeEnum.on_site,
        },
      },
      externalBookings: [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      ],
    },
  ],
  hasBookingsAfter18: true,
}

export const emptyBookingsSnap: BookingsResponse = {
  ended_bookings: [],
  ongoing_bookings: [],
  hasBookingsAfter18: true,
}

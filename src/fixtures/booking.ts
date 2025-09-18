import {
  BookingOfferResponse,
  BookingOfferResponseAddressV2,
  BookingOfferResponseV2,
  BookingReponse,
  BookingStockResponseV2,
  BookingsResponse,
  SubcategoryIdEnum,
} from 'api/gen'

export const mockedBookingOfferResponse: BookingOfferResponse = {
  id: 32871,
  isDigital: true,
  isPermanent: true,
  name: 'mockedBookingName',
  venue: {
    name: 'venueName',
    id: 3131,
    coordinates: {},
    timezone: 'Europe/Paris',
    isOpenToPublic: true,
  },
  subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
}

export const mockedBookingOfferResponseAddressV2: BookingOfferResponseAddressV2 = {
  id: 115,
  street: '1 boulevard de la brique',
  postalCode: '93700',
  city: 'Drancy',
  coordinates: {
    latitude: 48.91683,
    longitude: 2.43884,
  },
  timezone: 'Europe/Paris',
}

export const mockedBookingOfferResponseV2: BookingOfferResponseV2 = {
  id: 32871,
  isDigital: true,
  isPermanent: true,
  name: 'mockedBookingName',
  address: mockedBookingOfferResponseAddressV2,
  venue: {
    address: {
      id: 1212,
    },
    name: 'venueName',
    id: 3131,
    timezone: 'Europe/Paris',
    isOpenToPublic: true,
  },
  subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
}

export const mockedBookingStockResponseV2: BookingStockResponseV2 = {
  id: 150230,
  beginningDatetime: '2024-05-08T12:50:00Z',
  price: 400,
  priceCategoryLabel: 'Cat 4',
  features: ['VOSTFR', '3D', 'IMAX'],
  offer: {
    id: 147874,
    bookingContact: null,
    name: 'Avez-vous déjà vu\u00a0?',
    address: {
      id: 115,
      street: '1 boulevard de la brique',
      postalCode: '93700',
      city: 'Drancy',
      coordinates: {
        latitude: 48.91683,
        longitude: 2.43884,
      },
      timezone: 'Europe/Paris',
    },
    extraData: {
      ean: '123456789',
    },
    isPermanent: false,
    isDigital: false,
    subcategoryId: SubcategoryIdEnum.EVENEMENT_PATRIMOINE,
    venue: {
      address: {
        id: 116,
      },
      id: 2185,
      name: 'Maison de la Brique',
      timezone: 'Europe/Paris',
      isOpenToPublic: true,
    },
  },
}

export const mockedBookingApi: BookingReponse = {
  id: 123,
  quantity: 3,
  totalAmount: 4,
  canReact: true,
  enablePopUpReaction: true,
  stock: {
    id: 431,
    offer: mockedBookingOfferResponse,
    price: 400,
    priceCategoryLabel: 'Cat 4',
    features: ['VOSTFR', '3D', 'IMAX'],
  },
  token: 'bookingToken',
  dateCreated: '',
}

export const mockedBookingsResponse: BookingsResponse = {
  ongoing_bookings: [mockedBookingApi],
  ended_bookings: [{ ...mockedBookingApi, id: 321 }],
  hasBookingsAfter18: false,
}

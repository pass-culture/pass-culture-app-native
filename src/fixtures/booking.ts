import { BookingOfferResponse, BookingReponse, BookingsResponse, SubcategoryIdEnum } from 'api/gen'

const mockedBookingOfferResponse: BookingOfferResponse = {
  id: 32871,
  isDigital: true,
  isPermanent: true,
  name: 'mockedBookingName',
  venue: { name: 'venueName', id: 3131, coordinates: {}, timezone: 'Europe/Paris' },
  subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
}

export const mockedBookingApi: BookingReponse = {
  id: 123,
  quantity: 3,
  totalAmount: 4,
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

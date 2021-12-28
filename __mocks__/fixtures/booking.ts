import { BookingOfferResponse, SubcategoryIdEnum } from 'api/gen'

export const mockedBookingOfferResponse: BookingOfferResponse = {
  id: 32871,
  isDigital: true,
  isPermanent: true,
  name: 'mockedBookingName',
  venue: { name: 'venueName', id: 3131, coordinates: {} },
  subcategoryId: SubcategoryIdEnum.ABO_CONCERT,
}

export const mockedBookingApi = {
  id: 123,
  quantity: 3,
  totalAmount: 4,
  stock: { id: 431, offer: mockedBookingOfferResponse },
  token: 'bookingToken',
}

export const mockedBookingsResponse = {
  ongoing_bookings: [mockedBookingApi],
  ended_bookings: [{ ...mockedBookingApi, id: 321 }],
}

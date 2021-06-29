export const mockedBookingOfferResponse = {
  category: { label: 'categoryLabel', categoryType: 'Event' },
  id: 32871,
  isDigital: true,
  isPermanent: true,
  name: 'mockedBookingName',
  venue: { name: 'venueName', id: 3131, coordinates: {} },
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

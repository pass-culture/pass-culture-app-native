export const useBooking = jest.fn().mockReturnValue({
  bookingState: {
    offerId: undefined,
    stockId: undefined,
    step: 1,
    quantity: 2,
    date: undefined,
  },
  dispatch: () => null,
  dismissModal: () => null,
})

export const useBookingOffer = jest.fn().mockReturnValue({
  category: {},
  isDigital: false,
  fullAddress: 'mon adresse',
  name: 'mon nom',
  stocks: [],
})

export const useBookingStock = jest.fn().mockReturnValue({
  beginningDatetime: new Date('2020-12-01T00:00:00Z'),
  price: 11,
  activationCode: { expirationDate: new Date('2020-12-01T00:00:00Z') },
})

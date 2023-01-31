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

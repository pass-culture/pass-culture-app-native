export const useBookingStock = jest.fn().mockReturnValue({
  beginningDatetime: new Date('2020-12-01T00:00:00Z'),
  price: 11,
  activationCode: { expirationDate: new Date('2020-12-01T00:00:00Z') },
})

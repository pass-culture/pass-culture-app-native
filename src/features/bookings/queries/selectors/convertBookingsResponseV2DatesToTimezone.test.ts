import mockdate from 'mockdate'

import { BookingsResponseV2 } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { convertBookingsResponseV2DatesToTimezone } from 'features/bookings/queries/selectors/convertBookingsResponseV2DatesToTimezone'
import { mockBuilder } from 'tests/mockBuilder'

const offerWithoutAddress = mockBuilder.bookingOfferResponseV2({
  address: null,
})

const bookingResponseMock = mockBuilder.bookingResponseV2({
  stock: mockBuilder.bookingStockResponseV2({
    beginningDatetime: '2024-05-08T12:50:00Z',
    offer: mockBuilder.bookingOfferResponseV2({
      address: mockBuilder.bookingOfferResponseAddressV2({
        timezone: 'America/Martinique',
      }),
    }),
  }),
})

const bookingResponseWithoutAddressMock = mockBuilder.bookingResponseV2({
  stock: mockBuilder.bookingStockResponseV2({
    offer: offerWithoutAddress,
  }),
})

const bookingsResponseV2Mock: BookingsResponseV2 = {
  ongoingBookings: [bookingResponseMock],
  endedBookings: [bookingResponseMock],
  hasBookingsAfter18: false,
}

describe('convertBookingsResponseV2DatesToTimezone', () => {
  beforeEach(() => mockdate.set(CURRENT_DATE))

  it('should return the converted offerer dates in local timezone of offer address when present', () => {
    const result = convertBookingsResponseV2DatesToTimezone(bookingsResponseV2Mock)

    expect(result).toBeDefined()
    expect(result?.ongoingBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
    expect(result?.endedBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })

  it('should return the converted offerer dates in local timezone of venue address when offerer address is null', () => {
    const bookingsResponseV2WithoutAddress: BookingsResponseV2 = {
      ongoingBookings: [bookingResponseWithoutAddressMock],
      endedBookings: [bookingResponseMock],
      hasBookingsAfter18: false,
    }

    const result = convertBookingsResponseV2DatesToTimezone(bookingsResponseV2WithoutAddress)

    expect(result).toBeDefined()
    expect(result?.ongoingBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T14:50:00.000Z')
    expect(result?.endedBookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })

  it('should return itself when there are no bookings', () => {
    const emptyBookingsResponseV2: BookingsResponseV2 = {
      ongoingBookings: [],
      endedBookings: [],
      hasBookingsAfter18: false,
    }
    const result = convertBookingsResponseV2DatesToTimezone(emptyBookingsResponseV2)

    expect(result).toStrictEqual(emptyBookingsResponseV2)
  })
})

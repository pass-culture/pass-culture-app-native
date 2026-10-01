import mockdate from 'mockdate'

import { BookingsListResponseV2, BookingsResponseV2 } from 'api/gen'
import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import {
  convertBookingResponseDateToTimezone,
  convertBookingsListResponseV2DatesToTimezone,
  convertBookingsResponseV2DatesToTimezone,
} from 'features/bookings/queries/selectors/convertBookingsDatesToTimezone'
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

describe('convertBookingsDatesToTimezone', () => {
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

  it('should return the booking unchanged when stock is missing', () => {
    const bookingWithoutStock = {} as typeof bookingResponseMock

    expect(convertBookingResponseDateToTimezone(bookingWithoutStock)).toBe(bookingWithoutStock)
  })

  it('should not throw when a bookings list contains a booking without stock', () => {
    const bookingsResponseWithInvalidBooking: BookingsResponseV2 = {
      ongoingBookings: [{} as typeof bookingResponseMock],
      endedBookings: [],
      hasBookingsAfter18: false,
    }

    expect(() =>
      convertBookingsResponseV2DatesToTimezone(bookingsResponseWithInvalidBooking)
    ).not.toThrow()
  })

  it('should not throw when BookingsResponseV2 ongoing or ended bookings are missing', () => {
    const result = convertBookingsResponseV2DatesToTimezone({} as BookingsResponseV2)

    expect(result.ongoingBookings).toEqual([])
    expect(result.endedBookings).toEqual([])
  })

  it('should convert BookingsListResponseV2 dates to the offer timezone', () => {
    const bookingsListResponse: BookingsListResponseV2 = {
      bookings: [
        mockBuilder.ongoingBookingListItemResponse({
          stock: mockBuilder.bookingListItemStockResponse({
            beginningDatetime: '2024-05-08T12:50:00Z',
            offer: mockBuilder.bookingListItemOfferResponse({
              address: { city: 'Fort-de-France', label: null, timezone: 'America/Martinique' },
            }),
          }),
        }),
      ],
    }

    const result = convertBookingsListResponseV2DatesToTimezone(bookingsListResponse)

    expect(result.bookings[0]?.stock.beginningDatetime).toEqual('2024-05-08T08:50:00.000Z')
  })

  it('should not throw when BookingsListResponseV2.bookings are missing', () => {
    const result = convertBookingsListResponseV2DatesToTimezone({} as BookingsListResponseV2)

    expect(result.bookings).toEqual([])
  })
})

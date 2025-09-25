import { BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { bookingsSnap, bookingsSnapV2 } from 'features/bookings/fixtures'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import {
  useEndedBookingFromOfferIdQuery,
  useEndedBookingFromOfferIdQueryV2,
} from 'queries/bookings'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('@tanstack/react-query').useQuery,
}))

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/jwt/jwt')

describe('useEndedBookingFromOfferIdQuery', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', bookingsSnap)
  })

  // TODO(PC-36586): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return an ended booking if existing', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(
      () => useEndedBookingFromOfferIdQuery(booking.stock.offer.id, true),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  // TODO(PC-36586): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should not return an ended booking if not existing', async () => {
    const unknownOfferId = 91919191
    const { result } = renderHook(() => useEndedBookingFromOfferIdQuery(unknownOfferId, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data).toEqual(null)
  })
})

describe('useEndedBookingFromOfferIdQueryV2', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
  })

  it('should return an ended booking if existing', async () => {
    const booking = bookingsSnapV2.endedBookings[0]
    const { result } = renderHook(
      () => useEndedBookingFromOfferIdQueryV2(booking.stock.offer.id, true),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should not return an ended booking if not existing', async () => {
    const unknownOfferId = 91919191
    const { result } = renderHook(() => useEndedBookingFromOfferIdQueryV2(unknownOfferId, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data).toEqual(null)
  })
})

import { BookingsResponse, BookingsResponseV2 } from 'api/gen'
import { bookingsSnap, bookingsSnapV2 } from 'features/bookings/fixtures'
import {
  useOngoingOrEndedBookingQuery,
  useOngoingOrEndedBookingQueryV1,
} from 'features/bookings/queries/useOngoingOrEndedBookingQuery'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
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

describe('useOngoingOrEndedBookingQuery', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponse>('/v1/bookings', {
      requestOptions: {
        persist: true,
      },
      responseOptions: {
        statusCode: 200,
        data: bookingsSnap,
      },
    })
  })

  // TODO(PC-36586): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return ongoing_bookings when there is one', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV1(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  // TODO(PC-36586): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return ended_bookings when there is one', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV1(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  // TODO(PC-36586): Test flaky following the v5 react query update
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV1(bookingId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })
})

describe('useOngoingOrEndedBookingQueryV2', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
  })

  it('should return ongoingBookings when there is one', async () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQuery(booking.id, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return endedBookings when there is one', async () => {
    const booking = bookingsSnapV2.endedBookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQuery(booking.id, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBookingQuery(bookingId, true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })
})

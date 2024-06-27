import { BookingsResponse } from 'api/gen'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/jwt/jwt')

describe('useOngoingOrEndedBooking', () => {
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

  it('should return ongoing_bookings when there is one', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should return ended_bookings when there is one', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBooking(bookingId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.data).toBeNull()
  })
})

import { BookingsResponse } from 'api/gen'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, act } from 'tests/utils'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useOngoingOrEndedBooking', () => {
  beforeEach(() => {
    mockServer.get<BookingsResponse>('/native/v1/bookings', {
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
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})
    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should return ended_bookings when there is one', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await act(async () => {})

    expect(result.current?.data?.id).toEqual(booking.id)
    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBooking(bookingId), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})
    expect(result.current.data).toBeNull()
  })
})

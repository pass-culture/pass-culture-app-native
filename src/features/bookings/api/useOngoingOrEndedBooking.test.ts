import { rest } from 'msw'

import { BookingsResponse } from 'api/gen'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { env } from 'libs/environment'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/react-query/usePersistQuery', () => ({
  usePersistQuery: jest.requireActual('react-query').useQuery,
}))

server.use(
  rest.get<BookingsResponse>(`${env.API_BASE_URL}/native/v1/bookings`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(bookingsSnap))
  )
)

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock
mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useOngoingOrEndedBooking', () => {
  it('should return ongoing_bookings when there is one', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return ended_bookings when there is one', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBooking(bookingId), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })
})

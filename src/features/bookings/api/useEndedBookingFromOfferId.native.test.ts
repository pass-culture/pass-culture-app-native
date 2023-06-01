import { rest } from 'msw'

import { BookingsResponse } from 'api/gen'
import { useEndedBookingFromOfferId } from 'features/bookings/api'
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

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useEndedBookingFromOfferId', () => {
  it('should return an ended booking if existing', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useEndedBookingFromOfferId(booking.stock.offer.id), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should not return an ended booking if not existing', async () => {
    const unknownOfferId = 91919191
    const { result } = renderHook(() => useEndedBookingFromOfferId(unknownOfferId), {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data).toEqual(null)
    })
  })
})

import { BookingsResponseV2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { useOngoingOrEndedBookingQueryV2 } from 'features/bookings/queries/useOngoingOrEndedBookingQuery'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

mockUseNetInfoContext.mockReturnValue({ isConnected: true, isInternetReachable: true })

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

jest.mock('libs/jwt/jwt')

describe('useOngoingOrEndedBookingQueryV2', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
  })

  it('should return ongoingBookings when there is one', async () => {
    const booking = bookingsSnapV2.ongoingBookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV2(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return endedBookings when there is one', async () => {
    const booking = bookingsSnapV2.endedBookings[0]
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV2(booking.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderHook(() => useOngoingOrEndedBookingQueryV2(bookingId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })
})

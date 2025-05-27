import { BookingsResponse } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useOngoingOrEndedBookingQuery } from 'features/bookings/queries'
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

  it('should return ongoing_bookings when there is one', async () => {
    const booking = bookingsSnap.ongoing_bookings[0]
    const { result } = renderUseOngoingOrEndedBookingQuery(booking.id)

    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return ended_bookings when there is one', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderUseOngoingOrEndedBookingQuery(booking.id)
    await waitFor(() => {
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })
  })

  it('should return null if no ongoing nor ended booking can be found', async () => {
    const bookingId = 1230912039
    const { result } = renderUseOngoingOrEndedBookingQuery(bookingId)

    await waitFor(() => {
      expect(result.current.data).toBeNull()
    })
  })
})

const renderUseOngoingOrEndedBookingQuery = (bookingId: number) =>
  renderHook(() => useOngoingOrEndedBookingQuery(bookingId), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

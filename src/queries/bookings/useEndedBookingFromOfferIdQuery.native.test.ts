import { BookingsResponse } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { useEndedBookingFromOfferIdQuery } from 'queries/bookings/useEndedBookingFromOfferIdQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

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

  it('should return an ended booking if existing', async () => {
    const booking = bookingsSnap.ended_bookings[0]
    const { result } = renderHook(() => useEndedBookingFromOfferIdQuery(booking.stock.offer.id), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current?.data?.id).toEqual(booking.id))

    expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
  })

  it('should not return an ended booking if not existing', async () => {
    const unknownOfferId = 91919191
    const { result } = renderHook(() => useEndedBookingFromOfferIdQuery(unknownOfferId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })
    await waitFor(() => expect(result.current?.data).toEqual(null))
  })
})

import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { BookingsResponse } from 'api/gen'
import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { useOngoingOrEndedBooking } from '../queries'

server.use(
  rest.get<BookingsResponse>(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(bookingsSnap))
  )
)

describe('[API] booking queries', () => {
  describe('[Method] useOngoingOrEndedBooking', () => {
    it('should return ongoing_bookings when there is one', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const { result, waitFor } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.data !== undefined)
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })

    it('should return ended_bookings when there is one', async () => {
      const booking = bookingsSnap.ended_bookings[0]
      const { result, waitFor } = renderHook(() => useOngoingOrEndedBooking(booking.id), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.data !== undefined)
      expect(result.current?.data?.id).toEqual(booking.id)
      expect(result.current?.data?.stock.id).toEqual(booking.stock.id)
    })

    it('should return null if no ongoing nor ended booking can be found', async () => {
      const bookingId = 1230912039
      const { result, waitFor } = renderHook(() => useOngoingOrEndedBooking(bookingId), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.data === null)
      expect(result.current.data).toBeNull()
    })
  })
})

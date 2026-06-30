import { QueryClient } from '@tanstack/react-query'

import { BookingsResponseV2, BookOfferResponse } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { prefetchBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { prefetchBookingsV2Query } from 'queries/bookings/useBookingsQuery'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/adjust/adjust')

const props = { onError: jest.fn(), onSuccess: jest.fn() }

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData(['userProfile'], {
    email: 'email@domain.ext',
  })
}

jest.mock('queries/bookings/useBookingByIdQuery', () => ({
  ...jest.requireActual('queries/bookings/useBookingByIdQuery'),
  prefetchBookingByIdQuery: jest.fn(),
}))

jest.mock('queries/bookings/useBookingsQuery', () => ({
  ...jest.requireActual('queries/bookings/useBookingsQuery'),
  prefetchBookingsV2Query: jest.fn(),
}))

jest.mock('libs/jwt/jwt')

describe('useBookOfferMutation', () => {
  beforeEach(() => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
    })
  })

  it('invalidates userProfile after successfully booking an offer', async () => {
    mockServer.postApi<BookOfferResponse>('/v1/bookings', {})
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', {})

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find({ queryKey: ['userProfile'] })).toBeDefined()
    expect(queryCache.find({ queryKey: ['userProfile'] })?.state.isInvalidated).toBeFalsy()

    await act(async () => result.current.mutate({ quantity: 1, stockId: 10 }))

    await waitFor(() => {
      expect(props.onSuccess).toHaveBeenCalledTimes(1)
      expect(props.onError).not.toHaveBeenCalled()
      expect(queryCache.find({ queryKey: ['userProfile'] })?.state.isInvalidated).toBe(true)
    })
  })

  it('does not invalidates userProfile if error on booking an offer', async () => {
    mockServer.postApi('/v1/bookings', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find({ queryKey: ['userProfile'] })).toBeDefined()
    expect(queryCache.find({ queryKey: ['userProfile'] })?.state.isInvalidated).toBeFalsy()

    result.current.mutate({ quantity: 1, stockId: 10 })

    await waitFor(() => {
      expect(props.onSuccess).not.toHaveBeenCalled()
      expect(props.onError).toHaveBeenCalledTimes(1)
      expect(queryCache.find({ queryKey: ['userProfile'] })?.state.isInvalidated).toBeFalsy()
    })
  })

  it('prefetches booking details and bookings list after successful booking', async () => {
    const bookingId = 123

    mockServer.postApi<BookOfferResponse>('/v1/bookings', { bookingId })
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', {})

    const { result } = renderUseBookOfferMutation()

    result.current.mutate({ quantity: 1, stockId: 10 })

    await waitFor(() => expect(props.onSuccess).toHaveBeenCalledTimes(1))

    expect(prefetchBookingByIdQuery).toHaveBeenCalledWith(bookingId, true)
    expect(prefetchBookingsV2Query).toHaveBeenCalledTimes(1)
  })

  describe('Adjust event', () => {
    it('should log Adjust book offer event after successfully booking', async () => {
      mockServer.postApi<BookOfferResponse>('/v1/bookings', {})

      const { result } = renderUseBookOfferMutation()

      result.current.mutate({ quantity: 1, stockId: 10 })

      await waitFor(() => {
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.BOOK_OFFER)
      })
    })
  })
})

const renderUseBookOfferMutation = () =>
  renderHook(() => useBookOfferMutation(props), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setup),
  })

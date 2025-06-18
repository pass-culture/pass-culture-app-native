import { QueryClient } from '@tanstack/react-query'

import { BookingsResponse, BookOfferResponse } from 'api/gen'
import { useBookOfferMutation } from 'queries/bookOffer/useBookOfferMutation'
import { mockServer } from 'tests/mswServer'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

const props = { onError: jest.fn(), onSuccess: jest.fn() }

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData(['userProfile'], {
    email: 'email@domain.ext',
  })
}
jest.mock('libs/jwt/jwt')

describe('useBookOfferMutation', () => {
  //TODO(PC-36586): unskip this test
  it.skip('invalidates userProfile after successfully booking an offer', async () => {
    mockServer.postApi<BookOfferResponse>('/v1/bookings', {})
    mockServer.getApi<BookingsResponse>('/v1/bookings', {})

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find(['userProfile'])).toBeDefined()
    expect(queryCache.find(['userProfile'])?.state.isInvalidated).toBeFalsy()

    await act(async () => result.current.mutate({ quantity: 1, stockId: 10 }))

    await waitFor(() => {
      expect(props.onSuccess).toHaveBeenCalledTimes(1)
      expect(props.onError).not.toHaveBeenCalled()
      expect(queryCache.find(['userProfile'])?.state.isInvalidated).toBe(true)
    })
  })

  //TODO(PC-36586): unskip this test
  it.skip('does not invalidates userProfile if error on booking an offer', async () => {
    mockServer.postApi('/v1/bookings', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find(['userProfile'])).toBeDefined()
    expect(queryCache.find(['userProfile'])?.state.isInvalidated).toBeFalsy()

    result.current.mutate({ quantity: 1, stockId: 10 })

    await waitFor(() => {
      expect(props.onSuccess).not.toHaveBeenCalled()
      expect(props.onError).toHaveBeenCalledTimes(1)
      expect(queryCache.find(['userProfile'])?.state.isInvalidated).toBeFalsy()
    })
  })
})

const renderUseBookOfferMutation = () =>
  renderHook(() => useBookOfferMutation(props), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setup),
  })

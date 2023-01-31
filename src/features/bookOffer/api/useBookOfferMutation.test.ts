import { rest } from 'msw'
import { QueryClient } from 'react-query'

import { useBookOfferMutation } from 'features/bookOffer/api/useBookOfferMutation'
import { env } from 'libs/environment'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

const props = { onError: jest.fn(), onSuccess: jest.fn() }

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData('userProfile', {
    email: 'email@domain.ext',
  })
}

describe('useBookOfferMutation', () => {
  it('invalidates userProfile after successfully booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) => res(ctx.status(204)))
    )

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    result.current.mutate({ quantity: 1, stockId: 10 })

    await waitFor(() => {
      expect(props.onSuccess).toHaveBeenCalledTimes(1)
      expect(props.onError).not.toHaveBeenCalled()
      expect(queryCache.find('userProfile')?.state.isInvalidated).toBeTruthy()
    })
  })

  it('does not invalidates userProfile if error on booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/bookings', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({}))
      )
    )

    const { result } = renderUseBookOfferMutation()

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    result.current.mutate({ quantity: 1, stockId: 10 })

    await waitFor(() => {
      expect(props.onSuccess).not.toHaveBeenCalled()
      expect(props.onError).toHaveBeenCalledTimes(1)
      expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()
    })
  })
})

const renderUseBookOfferMutation = () =>
  renderHook(
    () => useBookOfferMutation(props),
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    { wrapper: ({ children }) => reactQueryProviderHOC(children, setup) }
  )

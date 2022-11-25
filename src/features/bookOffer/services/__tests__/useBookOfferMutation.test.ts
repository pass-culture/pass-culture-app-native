import { rest } from 'msw'
import { QueryClient } from 'react-query'

import { env } from 'libs/environment'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, renderHook, waitFor } from 'tests/utils'

import { useBookOfferMutation } from '../useBookOfferMutation'

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

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

    const { result } = renderHook(
      () => useBookOfferMutation(props),
      // eslint-disable-next-line react/display-name
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      { wrapper: ({ children }) => reactQueryProviderHOC(children, setup) }
    )

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    await act(async () => {
      await result.current.mutate({ quantity: 1, stockId: 10 })
    })

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

    const { result } = renderHook(
      () => useBookOfferMutation(props),
      // eslint-disable-next-line react/display-name
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      { wrapper: ({ children }) => reactQueryProviderHOC(children, setup) }
    )

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    await act(async () => {
      await result.current.mutate({ quantity: 1, stockId: 10 })
    })

    await waitFor(() => {
      expect(props.onSuccess).not.toHaveBeenCalled()
      expect(props.onError).toHaveBeenCalledTimes(1)
      expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()
    })
  })
})

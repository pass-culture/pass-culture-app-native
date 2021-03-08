import { renderHook, act } from '@testing-library/react-hooks'
import { rest } from 'msw'
import { QueryClient } from 'react-query'

import { env } from 'libs/environment'
import { queryCache, reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { useBookOfferMutation } from '../useBookOfferMutation'

const props = { onError: jest.fn(), onSuccess: jest.fn() }

const setup = (queryClient: QueryClient) => {
  queryClient.setQueryData('userProfile', {
    email: 'email@domain.ext',
  })
}

describe('useBookOfferMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('invalidates userProfile after successfully booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) => res(ctx.status(204)))
    )

    const { result, waitForNextUpdate } = renderHook(
      () => useBookOfferMutation(props),
      // eslint-disable-next-line react/display-name
      { wrapper: ({ children }) => reactQueryProviderHOC(children, setup) }
    )

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    await act(async () => {
      await result.current.mutate({ quantity: 1, stockId: '10' })
      await waitForNextUpdate()
    })

    expect(props.onSuccess).toHaveBeenCalled()
    expect(props.onError).not.toHaveBeenCalled()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeTruthy()
  })

  it('does not invalidates userProfile if error on booking an offer', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/native/v1/book_offer', (req, res, ctx) =>
        res(ctx.status(400), ctx.json({}))
      )
    )

    const { result, waitForNextUpdate } = renderHook(
      () => useBookOfferMutation(props),
      // eslint-disable-next-line react/display-name
      { wrapper: ({ children }) => reactQueryProviderHOC(children, setup) }
    )

    expect(queryCache.find('userProfile')).toBeDefined()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()

    await act(async () => {
      await result.current.mutate({ quantity: 1, stockId: '10' })
      await waitForNextUpdate()
    })

    expect(props.onSuccess).not.toHaveBeenCalled()
    expect(props.onError).toHaveBeenCalled()
    expect(queryCache.find('userProfile')?.state.isInvalidated).toBeFalsy()
  })
})

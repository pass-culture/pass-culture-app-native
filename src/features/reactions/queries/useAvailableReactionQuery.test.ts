import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useAvailableReaction', () => {
  beforeEach(() => {
    mockServer.getApi('/v1/reaction/available', availableReactionsSnap)
  })

  it('should fetch available reactions correctly', async () => {
    const { result } = renderHook(() => useAvailableReactionQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current?.data).toEqual(availableReactionsSnap)
  })

  it('should return an empty object if API response is empty', async () => {
    mockServer.getApi('/v1/reaction/available', {})

    const { result } = renderHook(() => useAvailableReactionQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.data).toEqual({})
  })

  it('should handle errors correctly', async () => {
    mockServer.getApi('/v1/reaction/available', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderHook(() => useAvailableReactionQuery(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })
})

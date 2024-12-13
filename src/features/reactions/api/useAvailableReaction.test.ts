import { useAvailableReaction } from 'features/reactions/api/useAvailableReaction'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')

describe('useAvailableReaction', () => {
  const mockAvailableReactions = {
    numberOfReactableBookings: 1,
    bookings: [
      {
        name: 'Product 27',
        offerId: 28,
        subcategoryId: 'LIVRE_PAPIER',
        image: null,
        dateUsed: '2024-12-13T11:04:01.974595Z',
      },
    ],
  }

  beforeEach(() => {
    mockServer.getApi('/v1/reaction/available', mockAvailableReactions)
  })

  it('should fetch available reactions correctly', async () => {
    const { result } = renderHook(() => useAvailableReaction(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current?.data).toEqual(mockAvailableReactions)
  })

  it('should return an empty object if API response is empty', async () => {
    mockServer.getApi('/v1/reaction/available', {})

    const { result } = renderHook(() => useAvailableReaction(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.data).toEqual({})
  })

  it('should handle errors correctly', async () => {
    mockServer.getApi('/v1/reaction/available', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderHook(() => useAvailableReaction(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeUndefined()
  })
})

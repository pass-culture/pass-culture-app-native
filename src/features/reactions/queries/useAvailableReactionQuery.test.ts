import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser, mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

mockAuthContextWithUser({
  ...beneficiaryUser,
})

describe('useAvailableReaction', () => {
  beforeEach(() => {
    mockServer.getApi('/v2/reaction/available', availableReactionsSnap)
  })

  it('should fetch available reactions correctly', async () => {
    const { result } = renderUseAvailableReaction()

    await waitFor(() => expect(result.current.data).toEqual(availableReactionsSnap))
  })

  it('should return an empty object if API response is empty', async () => {
    mockServer.getApi('/v2/reaction/available', {})

    const { result } = renderUseAvailableReaction()

    await waitFor(() => expect(result.current.data).toEqual({}))
  })

  it('should handle errors correctly', async () => {
    mockServer.getApi('/v2/reaction/available', { responseOptions: { statusCode: 400, data: {} } })

    const { result } = renderUseAvailableReaction()

    await waitFor(() => expect(result.current.isError).toBeTruthy())

    expect(result.current.data).toBeUndefined()
  })

  it('should only fetch data if user is loggedIn', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderUseAvailableReaction()

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderUseAvailableReaction = () => {
  return renderHook(() => useAvailableReactionQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}

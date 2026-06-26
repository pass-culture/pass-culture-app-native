import { useActivityTypesQuery } from 'features/identityCheck/queries/useActivityTypesQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

describe('useActivityTypesQuery', () => {
  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderActivityTypesQueryHook()

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderActivityTypesQueryHook = () =>
  renderHook(() => useActivityTypesQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

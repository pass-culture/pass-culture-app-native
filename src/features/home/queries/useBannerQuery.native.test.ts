import { useBannerQuery } from 'features/home/queries/useBannerQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')

describe('useBannerQuery', () => {
  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderBannerQueryHook(true)

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderBannerQueryHook = (hasGeolocationPosition: boolean) =>
  renderHook(() => useBannerQuery(hasGeolocationPosition), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

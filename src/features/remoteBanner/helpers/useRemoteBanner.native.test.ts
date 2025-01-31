import { useRemoteBanner } from 'features/remoteBanner/helpers/useRemoteBanner'
import { getRemoteBanner } from 'libs/firebase/firestore/getRemoteBanner/getRemoteBanner'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/getRemoteBanner/getBanner')
const mockGetBanner = getRemoteBanner as jest.Mock

describe('useRemoteBanner', () => {
  it('should return banner data', async () => {
    mockGetBanner.mockReturnValueOnce({
      title: 'title 1',
      subtitle: 'subtitle 1',
      redirectionUrl: 'www.test.fr',
    })

    const { result } = renderUseRemoteBanner()

    await waitFor(() => {
      expect(result.current).toEqual({
        title: 'title 1',
        subtitle: 'subtitle 1',
        redirectionUrl: 'www.test.fr',
      })
    })
  })
})

const renderUseRemoteBanner = () =>
  renderHook(useRemoteBanner, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

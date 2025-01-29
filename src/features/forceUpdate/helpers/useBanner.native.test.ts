import { useBanner } from 'features/forceUpdate/helpers/useBanner'
import { getBanner } from 'libs/firebase/firestore/getBanner/getBanner'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('@react-native-firebase/firestore')
jest.mock('libs/firebase/firestore/getBanner/getBanner')
const mockGetBanner = getBanner as jest.Mock

describe('useBanner', () => {
  it('should return banner data', async () => {
    mockGetBanner.mockReturnValueOnce({
      title: 'title 1',
      subtitle: 'subtitle 1',
      redirectionUrl: 'www.test.fr',
    })

    const { result } = renderUseBanner()

    await waitFor(() => {
      expect(result.current).toEqual({
        title: 'title 1',
        subtitle: 'subtitle 1',
        redirectionUrl: 'www.test.fr',
      })
    })
  })
})

const renderUseBanner = () =>
  renderHook(useBanner, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

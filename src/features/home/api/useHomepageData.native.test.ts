import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { Homepage } from 'features/home/types'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomepageData } from './useHomepageData'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const homepageEntryIds = [
  homepageEntriesAPIResponse.items[0].sys.id,
  homepageEntriesAPIResponse.items[1].sys.id,
]

describe('useHomepageModules', () => {
  it('calls the API and returns the data', async () => {
    const { result } = renderHook(useHomepageData, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedResult: Homepage = homepageList[0]

    await waitFor(() => {
      expect(result.current).toEqual(expectedResult)
    })
  })

  it('calls the API and returns the data of a thematic home page', async () => {
    const entryId = homepageEntryIds[1]
    const { result } = renderHook(() => useHomepageData(entryId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedResult = homepageList[1]

    await waitFor(() => {
      expect(result.current).toEqual(expectedResult)
    })
  })
})

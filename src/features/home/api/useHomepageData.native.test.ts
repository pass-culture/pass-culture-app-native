import { BookingsResponse } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures'
import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useHomepageData } from './useHomepageData'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const homepageEntryIds = [
  homepageEntriesAPIResponse.items[0].sys.id,
  homepageEntriesAPIResponse.items[1].sys.id,
]

describe('useHomepageModules', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponse>('/v2/bookings', bookingsSnap)
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, homepageEntriesAPIResponse)
  })

  it('calls the API and returns the data', async () => {
    const { result } = renderHook(useHomepageData, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const expectedResult = homepageList[0]

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

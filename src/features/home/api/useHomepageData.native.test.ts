/* eslint-disable local-rules/no-react-query-provider-hoc */
import { rest } from 'msw'

import { homepageList } from 'features/home/fixtures/homepageList.fixture'
import { Homepage } from 'features/home/types'
import { BASE_URL, PARAMS } from 'libs/contentful/fetchHomepageNatifContent'
import { homepageEntriesAPIResponse } from 'libs/contentful/fixtures/homepageEntriesAPIResponse'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { useHomepageData } from './useHomepageData'

server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  })
)

jest.mock('features/auth/AuthContext', () => ({
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

  it('should log ConsultHome with specified entryId', async () => {
    const entryId = homepageEntryIds[0]
    renderHook(() => useHomepageData(entryId), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() =>
      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: entryId })
    )
  })
})

import { renderHook } from '@testing-library/react-hooks'
import { rest } from 'msw'

import { processHomepageEntry } from 'features/home/contentful'
import { analytics } from 'libs/analytics'
import {
  homepageEntriesAPIResponse,
  adaptedHomepageEntry,
  adaptedSecondHomepageEntry,
} from 'tests/fixtures/homepageEntries'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'

import { getEntries, BASE_URL, PARAMS, useHomepageModules } from './api'

server.use(
  rest.get(`${BASE_URL}/entries/${PARAMS}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(homepageEntriesAPIResponse))
  })
)

jest.mock('features/auth/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))
const entryId = homepageEntriesAPIResponse.items[1].sys.id

describe('Home api calls', () => {
  it('getEntries', async () => {
    const result = await getEntries()
    expect(result[0]).toEqual(adaptedHomepageEntry)
    expect(result[1]).toEqual(adaptedSecondHomepageEntry)
  })

  describe('useHomepageModules', () => {
    it('calls the API and returns the data', async () => {
      const { result, waitFor } = renderHook(useHomepageModules, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(result.current).toEqual(processHomepageEntry(adaptedHomepageEntry))
    })

    it('calls the API and returns the data with specified entryId', async () => {
      const { result, waitFor } = renderHook(() => useHomepageModules(entryId), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(result.current).toEqual(processHomepageEntry(adaptedSecondHomepageEntry))
    })

    it('should log ConsultHome with specified entryId', async () => {
      const { result, waitFor } = renderHook(() => useHomepageModules(entryId), {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.length > 0)
      expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { entryId })
    })
  })
})

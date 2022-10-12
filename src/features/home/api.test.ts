/* eslint-disable local-rules/no-react-query-provider-hoc */
import { rest } from 'msw'

import { processHomepageEntry } from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'
import {
  homepageEntriesAPIResponse,
  adaptedHomepageEntry,
  adaptedSecondHomepageEntry,
} from 'tests/fixtures/homepageEntries'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

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
      const { result } = renderHook(useHomepageModules, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.modules.length > 0)
      expect(result.current).toEqual({
        modules: processHomepageEntry(adaptedHomepageEntry),
        homeEntryId: '16PgpnlCOYYIhUTclR0oO4',
      })
    })

    it('calls the API and returns the data with specified entryId', async () => {
      const { result } = renderHook(() => useHomepageModules(entryId), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => result.current.modules.length > 0)

      expect(result.current).toEqual({
        modules: processHomepageEntry(adaptedSecondHomepageEntry),
        homeEntryId: '7IuIeovqUykM1uvWwwPPh7',
      })
    })

    it('should log ConsultHome with specified entryId', async () => {
      renderHook(() => useHomepageModules(entryId), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() =>
        expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: entryId })
      )
    })
  })
})

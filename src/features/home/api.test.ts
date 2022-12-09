/* eslint-disable local-rules/no-react-query-provider-hoc */
import { rest } from 'msw'

import { processHomepageEntry } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { adaptedHomepageEntry } from 'tests/fixtures/adaptedHomepageEntry'
import { adaptedSecondHomepageEntry } from 'tests/fixtures/adaptedSecondHomepageEntry'
import { adaptedThematicHomepageEntry } from 'tests/fixtures/adaptedThematicHomepageEntry'
import { homepageEntriesAPIResponse } from 'tests/fixtures/homepageEntriesAPIResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

import { BASE_URL, fetchHomepageNatifContent, PARAMS, useHomepageData } from './api'

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
  it('fetchHomepageNatifContent', async () => {
    const result = await fetchHomepageNatifContent()
    expect(result[0]).toEqual(adaptedHomepageEntry)
    expect(result[1]).toEqual(adaptedSecondHomepageEntry)
  })

  describe('useHomepageModules', () => {
    it('calls the API and returns the data', async () => {
      const { result } = renderHook(useHomepageData, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => {
        expect(result.current).toEqual({
          modules: processHomepageEntry(adaptedHomepageEntry),
          homeEntryId: '16PgpnlCOYYIhUTclR0oO4',
          thematicHomeHeader: undefined,
        })
      })
    })

    it('calls the API and returns the data with specified entryId', async () => {
      const { result } = renderHook(() => useHomepageData(entryId), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => {
        expect(result.current).toEqual({
          modules: processHomepageEntry(adaptedSecondHomepageEntry),
          homeEntryId: '7IuIeovqUykM1uvWwwPPh7',
          thematicHomeHeader: undefined,
        })
      })
    })
    it('calls the API and returns the data of a thematic home page', async () => {
      const thematicHomeId = '7IuIeovqUykM1uvWwwPPh8'
      const { result } = renderHook(() => useHomepageData(thematicHomeId), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() => {
        expect(result.current).toEqual({
          modules: processHomepageEntry(adaptedThematicHomepageEntry),
          homeEntryId: '7IuIeovqUykM1uvWwwPPh8',
          thematicHeader: {
            title: 'cinéma',
            subtitle: 'Fais le plein de cinéma',
          },
        })
      })
    })

    it('should log ConsultHome with specified entryId', async () => {
      renderHook(() => useHomepageData(entryId), {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      })

      await waitFor(() =>
        expect(analytics.logConsultHome).toHaveBeenNthCalledWith(1, { homeEntryId: entryId })
      )
    })
  })
})

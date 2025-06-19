import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGetGTLPlaylistsConfigQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistsConfigQuery'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetGTLPlaylistConfigQuery', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulGtlPlaylistSnap)
  })

  it('should allow selecting a subset of data', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(true, (data) =>
      data.find((r) => r.id === defaultId)
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: { title: 'Jeunesse', layout: 'two-items', minOffers: 5 },
        offersModuleParameters: expect.objectContaining({
          title: 'Jeunesse',
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Jeunesse',
        }),
      })
    )
  })

  it('should not fetch gtl playlist config if enabled is false', async () => {
    const defaultId = '7FqRezKdV0mcUjOYerCUuJ'
    const { result } = renderUseGetGTLPlaylistConfigQuery(false, (data) =>
      data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(undefined)
  })
})

const renderUseGetGTLPlaylistConfigQuery = <TData = GtlPlaylistRequest[]>(
  enabled: boolean,
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  renderHook(() => useGetGTLPlaylistsConfigQuery(enabled, select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

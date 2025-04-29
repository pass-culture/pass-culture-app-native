import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { useGetGTLPlaylistConfigQuery } from 'features/gtlPlaylist/queries/useGetGTLPlaylistConfigQuery'
import { GtlPlaylistRequest } from 'features/gtlPlaylist/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

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
    const { result } = renderUseGetGTLPlaylistConfigQuery((data) =>
      data.find((r) => r.id === defaultId)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: { title: 'Jeunesse', layout: 'two-items', minOffers: 1 },
        offersModuleParameters: {
          title: 'Jeunesse',
          hitsPerPage: 35,
          gtlLevel: 1,
          gtlLabel: 'Jeunesse',
        },
      })
    )
  })
})

const renderUseGetGTLPlaylistConfigQuery = <TData = GtlPlaylistRequest[]>(
  select?: (data: GtlPlaylistRequest[]) => TData
) =>
  renderHook(() => useGetGTLPlaylistConfigQuery(select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

import { contentfulArtistPlaylistSnap } from 'features/artist/fixtures/contentfulArtistPlaylistSnap'
import { useGetArtistPlaylistConfigQuery } from 'features/artist/queries/useGetArtistPlaylistConfigQuery'
import { ArtistPlaylistModule } from 'features/home/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetArtistPlaylistConfigQuery', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulArtistPlaylistSnap)
  })

  it('should allow selecting a subset of data', async () => {
    const defaultArtistId = '819d02dd-6097-4d11-aa8d-8dd9dcba4c97'
    const { result } = renderUseGetArtistPlaylistConfigQuery((data) =>
      data.find((r) => r.artistId === defaultArtistId)
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '3ekwFnm4jZy5ohgDNTjLRK',
        artistId: '819d02dd-6097-4d11-aa8d-8dd9dcba4c97',
        displayParameters: expect.objectContaining({
          title: 'Reco d’artiste',
          layout: 'three-items',
          minOffers: 1,
        }),
        offersModuleParameters: [
          expect.objectContaining({
            hitsPerPage: 10,
          }),
        ],
      })
    )
  })
})

const renderUseGetArtistPlaylistConfigQuery = <TData = ArtistPlaylistModule[]>(
  select?: (data: ArtistPlaylistModule[]) => TData
) =>
  renderHook(() => useGetArtistPlaylistConfigQuery(select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

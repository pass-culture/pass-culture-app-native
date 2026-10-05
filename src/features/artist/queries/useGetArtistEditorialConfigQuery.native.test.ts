import { contentfulArtistEditorialSnap } from 'features/artist/fixtures/contentfulArtistEditorialSnap'
import { useGetArtistEditorialConfigQuery } from 'features/artist/queries/useGetArtistEditorialConfigQuery'
import { ArtistEditorialModule } from 'features/home/types'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetArtistEditorialConfigQuery', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulArtistEditorialSnap)
  })

  it('should allow selecting a subset of data', async () => {
    const defaultArtistId = '05b6af23-84b1-43a3-b648-a74433400c70'
    const { result } = renderUseGetArtistEditorialConfigQuery((data) =>
      data.find((r) => r.artistId === defaultArtistId)
    )

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: '5WgvNwbkdDj4BmtwYwWc9e',
        artistId: '05b6af23-84b1-43a3-b648-a74433400c70',
        title: 'Son incroyable discographie',
        color: 'Information04',
        illustration: 'MusicSheet',
        offersModuleParameters: [
          expect.objectContaining({
            hitsPerPage: 3,
          }),
        ],
      })
    )
  })
})

const renderUseGetArtistEditorialConfigQuery = <TData = ArtistEditorialModule[]>(
  select?: (data: ArtistEditorialModule[]) => TData
) =>
  renderHook(() => useGetArtistEditorialConfigQuery(select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

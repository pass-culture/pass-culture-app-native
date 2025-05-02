import { fetchGTLPlaylistConfig } from 'features/gtlPlaylist/api/fetchGTLPlaylistConfig'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'

describe('fetchGTLPlaylistConfig', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulGtlPlaylistSnap)
  })

  it('should return correct data', async () => {
    const result = await fetchGTLPlaylistConfig()

    expect(result).toEqual([
      expect.objectContaining({
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: expect.objectContaining({
          layout: 'two-items',
          minOffers: 5,
          title: 'Jeunesse',
        }),
        offersModuleParameters: expect.objectContaining({
          gtlLabel: 'Jeunesse',
          gtlLevel: 1,
          hitsPerPage: 35,
          title: 'Jeunesse',
        }),
      }),
      expect.objectContaining({
        id: '2xUlLBRfxdk6jeYyJszunX',
        displayParameters: expect.objectContaining({
          layout: 'two-items',
          minOffers: 1,
          title: 'Littérature',
        }),
        offersModuleParameters: expect.objectContaining({
          gtlLabel: 'Littérature',
          gtlLevel: 1,
          hitsPerPage: 35,
          isGeolocated: false,
          title: 'Littérature',
        }),
      }),
    ])
  })
})

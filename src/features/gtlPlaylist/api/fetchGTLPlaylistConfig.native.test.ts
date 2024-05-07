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
      {
        id: '7FqRezKdV0mcUjOYerCUuJ',
        displayParameters: {
          layout: 'two-items',
          minOffers: 1,
          title: 'Jeunesse',
        },
        offersModuleParameters: {
          gtlLabel: 'Jeunesse',
          gtlLevel: 1,
          hitsPerPage: 35,
          title: 'Jeunesse',
        },
      },
      {
        id: '2xUlLBRfxdk6jeYyJszunX',
        displayParameters: {
          layout: 'two-items',
          minOffers: 1,
          title: 'Littérature',
        },
        offersModuleParameters: {
          gtlLabel: 'Littérature',
          gtlLevel: 1,
          hitsPerPage: 35,
          isGeolocated: false,
          title: 'Littérature',
        },
      },
    ])
  })
})

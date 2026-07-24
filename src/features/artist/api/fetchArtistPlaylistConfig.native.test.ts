import { fetchArtistPlaylistConfig } from 'features/artist/api/fetchArtistPlaylistConfig'
import { contentfulArtistPlaylistSnap } from 'features/artist/fixtures/contentfulArtistPlaylistSnap'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'

describe('fetchArtistPlaylistConfig', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulArtistPlaylistSnap)
  })

  it('should return correct data', async () => {
    const result = await fetchArtistPlaylistConfig()

    expect(result).toEqual([
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
      }),
    ])
  })
})

import { fetchArtistEditorialConfig } from 'features/artist/api/fetchArtistEditorialConfig'
import { contentfulArtistEditorialSnap } from 'features/artist/fixtures/contentfulArtistEditorialSnap'
import { CONTENTFUL_BASE_URL } from 'libs/contentful/constants'
import { mockServer } from 'tests/mswServer'

describe('fetchArtistEditorialConfig', () => {
  beforeEach(() => {
    mockServer.universalGet(`${CONTENTFUL_BASE_URL}/entries`, contentfulArtistEditorialSnap)
  })

  it('should return correct data', async () => {
    const result = await fetchArtistEditorialConfig()

    expect(result).toEqual([
      expect.objectContaining({
        id: '5WgvNwbkdDj4BmtwYwWc9e',
        title: 'Son incroyable discographie',
        artistId: '05b6af23-84b1-43a3-b648-a74433400c70',
        color: 'Information04',
        illustration: 'MusicSheet',
        offersModuleParameters: [
          expect.objectContaining({
            hitsPerPage: 3,
          }),
        ],
      }),
    ])
  })
})

import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'

import { selectSearchArtists } from './selectSearchArtists'

const mockData: FetchSearchArtistsResponse = {
  artistsResponse: {
    hits: [
      {
        objectID: 'artist-a',
        name: 'Artist A',
        image: 'image-a.jpg',
        description: 'Description A',
      },
      {
        objectID: 'artist-b',
        name: 'Artist B',
        image: 'image-b.jpg',
        description: 'Description B',
      },
    ],
    nbHits: 2,
    page: 1,
    nbPages: 1,
    userData: null,
  },
}

describe('selectSearchArtists', () => {
  it('should convert AlgoliaArtist type to Artist type', () => {
    const result = selectSearchArtists(mockData)

    expect(result).toHaveLength(2)
    expect(result).toEqual([
      {
        id: 'artist-a',
        name: 'Artist A',
        image: 'image-a.jpg',
        description: 'Description A',
      },
      {
        id: 'artist-b',
        name: 'Artist B',
        image: 'image-b.jpg',
        description: 'Description B',
      },
    ])
  })

  it('should return an empty array when artistsResponse has no hits', () => {
    const emptyData = {
      artistsResponse: {
        hits: [],
        nbHits: 0,
        page: 0,
        nbPages: 0,
        userData: null,
      },
    }

    expect(selectSearchArtists(emptyData)).toEqual([])
  })

  it('should return an empty array when data is null or undefined', () => {
    expect(selectSearchArtists(null)).toEqual([])
  })
})

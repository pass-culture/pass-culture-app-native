import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'

import { selectSearchArtists } from './selectSearchArtists'

describe('selectSearchArtists', () => {
  it('should extract, flatten, and deduplicate artists from offer hits', () => {
    const mockData = {
      offerArtistsResponse: {
        hits: [
          {
            objectID: 'offer-1',
            artists: [
              { id: 'artist-a', name: 'Artist A' },
              { id: 'artist-b', name: 'Artist B' },
            ],
          },
          {
            objectID: 'offer-2',
            artists: [{ id: 'artist-a', name: 'Artist A' }],
          },
          {
            objectID: 'offer-3',
            artists: [],
          },
          {
            objectID: 'offer-4',
            artists: undefined,
          },
        ],
      },
    } as unknown as FetchSearchArtistsResponse

    const result = selectSearchArtists(mockData)

    expect(result).toHaveLength(2)
    expect(result).toEqual([
      { id: 'artist-a', name: 'Artist A' },
      { id: 'artist-b', name: 'Artist B' },
    ])
  })

  it('should return an empty array when no offers contain artists', () => {
    const mockData = {
      offerArtistsResponse: {
        hits: [
          { objectID: '1', artists: [] },
          { objectID: '2', artists: undefined },
        ],
      },
    } as unknown as FetchSearchArtistsResponse

    const result = selectSearchArtists(mockData)

    expect(result).toEqual([])
  })
})

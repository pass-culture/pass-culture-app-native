import { FetchSearchArtistsResponse } from 'features/search/queries/useSearchArtists/types'

import { selectSearchArtists } from './selectSearchArtists'

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

describe('selectSearchArtists', () => {
  describe('selectedFilter', () => {
    it('should return artists when selectedFilter is null', () => {
      const result = selectSearchArtists(mockData, null)

      expect(result).toHaveLength(2)
    })

    it('should return artists when selectedFilter is "Artistes"', () => {
      const result = selectSearchArtists(mockData, 'Artistes')

      expect(result).toHaveLength(2)
    })

    it('should return empty array when selectedFilter is "Offres"', () => {
      expect(selectSearchArtists(mockData, 'Offres')).toEqual([])
    })

    it('should return empty array when selectedFilter is "Lieux"', () => {
      expect(selectSearchArtists(mockData, 'Lieux')).toEqual([])
    })
  })

  describe('artists extraction', () => {
    it('should flatten and deduplicate artists across hits', () => {
      const result = selectSearchArtists(mockData, null)

      expect(result).toEqual([
        { id: 'artist-a', name: 'Artist A' },
        { id: 'artist-b', name: 'Artist B' },
      ])
    })

    it('should return an empty array when no offers contain artists', () => {
      const emptyData = {
        offerArtistsResponse: {
          hits: [
            { objectID: '1', artists: [] },
            { objectID: '2', artists: undefined },
          ],
        },
      } as unknown as FetchSearchArtistsResponse

      expect(selectSearchArtists(emptyData, null)).toEqual([])
    })
  })
})
